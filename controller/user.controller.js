
const UserModel = require("../model/user.model");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const userResult = await UserModel.createUser({
      name,
      email,
      password,
      mobile
    });

    res.status(201).json({
      data: userResult,
      success: true,
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const userResult = await UserModel.updateUser(id, { name, email });

    res.status(200).json({
      data: userResult,
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await UserModel.deleteUser(id);

    res.status(200).json({
      data: userResult,
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();

    res.status(200).json({
      data: users,
      success: true,
      message: "Users fetched successfully"
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.getSingleUser(id);

    res.status(200).json({
      data: user,
      success: true,
      message: "User fetched successfully"
    });
  } catch (error) {
    console.error("Get Single User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(`
      SELECT u.id, u.email, p.username, p.bio, p.profile_image,
      (SELECT COUNT(*) FROM user_followers WHERE following_id = u.id) AS followers,
      (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) AS following
      FROM users u
      JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, profile_image, cover_image } = req.body;

    if (username) {
      const exists = await pool.query(
        `SELECT user_id FROM user_profiles WHERE username = $1 AND user_id != $2`,
        [username, userId]
      );

      if (exists.rows.length) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    await pool.query(`
      UPDATE user_profiles 
      SET username = COALESCE($1, username),
          bio = COALESCE($2, bio),
          profile_image = COALESCE($3, profile_image),
          cover_image = COALESCE($4, cover_image),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
    `, [username, bio, profile_image, cover_image, userId]);

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const viewerId = req.user?.id || null;
    const targetId = req.params.id;

    const blocked = await pool.query(`
      SELECT 1 FROM user_blocks
      WHERE (blocker_id = $1 AND blocked_id = $2)
         OR (blocker_id = $2 AND blocked_id = $1)
    `, [viewerId, targetId]);

    if (blocked.rows.length) {
      return res.status(403).json({ message: "Access denied" });
    }

    const profile = await pool.query(`
      SELECT user_id, username, bio, profile_image
      FROM user_profiles
      WHERE user_id = $1
    `, [targetId]);

    if (!profile.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    let isFollowing = false;

    if (viewerId) {
      const followCheck = await pool.query(`
        SELECT 1 FROM user_followers
        WHERE follower_id = $1 AND following_id = $2
      `, [viewerId, targetId]);

      isFollowing = followCheck.rows.length > 0;
    }

    res.json({
      ...profile.rows[0],
      is_following: isFollowing
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId == followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const exists = await pool.query(`
      SELECT 1 FROM user_followers
      WHERE follower_id = $1 AND following_id = $2
    `, [followerId, followingId]);

    if (exists.rows.length) {
      return res.status(400).json({ message: "Already following" });
    }

    await pool.query(`
      INSERT INTO user_followers (follower_id, following_id)
      VALUES ($1, $2)
    `, [followerId, followingId]);

    res.json({ message: "Followed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    await pool.query(`
      DELETE FROM user_followers
      WHERE follower_id = $1 AND following_id = $2
    `, [followerId, followingId]);

    res.json({ message: "Unfollowed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.id;

    await pool.query(`
      INSERT INTO user_blocks (blocker_id, blocked_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [blockerId, blockedId]);

    await pool.query(`
      DELETE FROM user_followers
      WHERE (follower_id = $1 AND following_id = $2)
         OR (follower_id = $2 AND following_id = $1)
    `, [blockerId, blockedId]);

    res.json({ message: "User blocked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};