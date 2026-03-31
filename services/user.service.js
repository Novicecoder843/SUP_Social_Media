const pool = require("../config/db");
exports.getMe = async (userId) => {
  const result = await pool.query(
    `SELECT u.id, u.email, p.username, p.bio, p.profile_image
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );
  const followers = await pool.query(
    "SELECT COUNT(*) FROM user_followers WHERE following_id=$1",
    [userId]
  );
  const following = await pool.query(
    "SELECT COUNT(*) FROM user_followers WHERE follower_id=$1",
    [userId]
  );

  return {
    ...result.rows[0],
    followers: parseInt(followers.rows[0].count),
    following: parseInt(following.rows[0].count),
  };
};


// ✅ 2. UPDATE PROFILE
exports.updateMe = async (userId, data) => {

  const { username, bio, profile_image } = data;

  // check username unique
  const check = await pool.query(
    "SELECT * FROM user_profiles WHERE username=$1 AND user_id != $2",
    [username, userId]
  );

  if (check.rows.length > 0) {
    throw new Error("Username already taken");
  }

  await pool.query(
    `INSERT INTO user_profiles(user_id, username, bio, profile_image)
     VALUES($1,$2,$3,$4)
     ON CONFLICT (user_id)
     DO UPDATE SET
       username=$2,
       bio=$3,
       profile_image=$4,
       updated_at=NOW()`,
    [userId, username, bio, profile_image]
  );

  return { message: "Profile updated" };
};


// ✅ 3. GET USER BY ID
exports.getUserById = async (myId, userId) => {

  // check block
  const blocked = await pool.query(
    `SELECT * FROM user_blocks
     WHERE (blocker_id=$1 AND blocked_id=$2)
        OR (blocker_id=$2 AND blocked_id=$1)`,
    [myId, userId]
  );

  if (blocked.rows.length > 0) {
    throw new Error("User not accessible");
  }

  const result = await pool.query(
    `SELECT user_id, username, bio, profile_image
     FROM user_profiles WHERE user_id=$1`,
    [userId]
  );

  // check following
  const follow = await pool.query(
    `SELECT * FROM user_followers
     WHERE follower_id=$1 AND following_id=$2`,
    [myId, userId]
  );

  return {
    ...result.rows[0],
    is_following: follow.rows.length > 0,
  };
};


// ✅ 4. FOLLOW
exports.follow = async (myId, userId) => {

  if (myId == userId) {
    throw new Error("Cannot follow yourself");
  }

  await pool.query(
    `INSERT INTO user_followers(follower_id, following_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [myId, userId]
  );

  return { message: "Followed" };
};


// ✅ 5. UNFOLLOW
exports.unfollow = async (myId, userId) => {

  await pool.query(
    `DELETE FROM user_followers
     WHERE follower_id=$1 AND following_id=$2`,
    [myId, userId]
  );

  return { message: "Unfollowed" };
};


// ✅ 6. BLOCK
exports.block = async (myId, userId) => {

  await pool.query(
    `INSERT INTO user_blocks(blocker_id, blocked_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [myId, userId]
  );

  // remove follow both ways
  await pool.query(
    `DELETE FROM user_followers
     WHERE (follower_id=$1 AND following_id=$2)
        OR (follower_id=$2 AND following_id=$1)`,
    [myId, userId]
  );

  return { message: "User blocked" };
};