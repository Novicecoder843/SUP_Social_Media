const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


JWT Authentication (Used by most APIs)
auth.middleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "JWT required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.user_id }; // 🔑 user identity
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


➡️ Every protected API starts here

2️⃣ GET /api/users/me → Who am I?
Controller Code
exports.getMe = async (req, res) => {
  const userId = req.user.id;

  const result = await db.query(`
    SELECT u.id, u.email, p.username, p.bio, p.profile_image,
      (SELECT COUNT(*) FROM user_followers WHERE following_id = u.id) AS followers,
      (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) AS following
    FROM users u
    JOIN user_profiles p ON p.user_id = u.id
    WHERE u.id = $1
  `, [userId]);

  res.json(result.rows[0]);
};

Step-by-Step Flow

JWT validated

user_id extracted

Join users + user_profiles

Count followers & following

Return full private profile

✔ Used for Profile / Settings / Edit Profile

3️⃣ PUT /api/users/me → Edit myself
Controller Code
exports.updateMe = async (req, res) => {
  const { username, bio, profile_image } = req.body;
  const userId = req.user.id;

  // 🔒 Username uniqueness check
  const exists = await db.query(
    `SELECT 1 FROM user_profiles WHERE username = $1 AND user_id != $2`,
    [username, userId]
  );

  if (exists.rowCount > 0) {
    return res.status(400).json({ message: "Username already taken" });
  }

  await db.query(`
    UPDATE user_profiles
    SET username = $1,
        bio = $2,
        profile_image = $3,
        updated_at = NOW()
    WHERE user_id = $4
  `, [username, bio, profile_image, userId]);

  res.json({ message: "Profile updated" });
};


4️⃣ GET /api/users/:id → Who is this person?
Controller Code
exports.getUserById = async (req, res) => {
  const targetId = req.params.id;
  const viewerId = req.user?.id;

  // 🚫 Block check
  if (viewerId) {
    const blocked = await db.query(`
      SELECT 1 FROM user_blocks
      WHERE (blocker_id = $1 AND blocked_id = $2)
         OR (blocker_id = $2 AND blocked_id = $1)
    `, [viewerId, targetId]);

    if (blocked.rowCount > 0) {
      return res.status(403).json({ message: "Access denied" });
    }
  }

  const profile = await db.query(`
    SELECT user_id, username, bio, profile_image
    FROM user_profiles
    WHERE user_id = $1
  `, [targetId]);

  const isFollowing = viewerId
    ? await db.query(`
        SELECT 1 FROM user_followers
        WHERE follower_id = $1 AND following_id = $2
      `, [viewerId, targetId])
    : { rowCount: 0 };

  res.json({
    ...profile.rows[0],
    is_following: isFollowing.rowCount > 0
  });
};


5️⃣ POST /api/users/follow/:id → Connect
Controller Code
exports.followUser = async (req, res) => {
  const me = req.user.id;
  const target = req.params.id;

  if (me == target) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  await db.query(`
    INSERT INTO user_followers (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [me, target]);

  res.json({ message: "Followed successfully" });
};


6️⃣ POST /api/users/unfollow/:id → Disconnect
exports.unfollowUser = async (req, res) => {
  await db.query(`
    DELETE FROM user_followers
    WHERE follower_id = $1 AND following_id = $2
  `, [req.user.id, req.params.id]);

  res.json({ message: "Unfollowed" });
};


7️⃣ POST /api/users/block/:id → Protect myself
Controller Code
exports.blockUser = async (req, res) => {
  const me = req.user.id;
  const blocked = req.params.id;

  await db.query(`
    INSERT INTO user_blocks (blocker_id, blocked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [me, blocked]);

  // ❌ Remove follow relationships both ways
  await db.query(`
    DELETE FROM user_followers
    WHERE (follower_id = $1 AND following_id = $2)
       OR (follower_id = $2 AND following_id = $1)
  `, [me, blocked]);

  res.json({ message: "User blocked" });
};