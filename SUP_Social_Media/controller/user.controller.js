// const User = require('../models/user.model');

// // CREATE
// // ============================================
// exports.createUser = async (req, res) => {
//   try {
//     const result = await User.createUser(req.body);
//     res.status(201).json({
//       success: true,
//       data: result.rows[0]
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET ALL
// // =================================================
// exports.getAllUsers = async (req, res) => {
//   try {
//     const result = await User.getAllUsers();
//     res.json({ success: true, data: result.rows });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET SINGLE
// // ===========================================
// exports.getUserById = async (req, res) => {
//   try {
//     const result = await User.getUserById(req.params.id);

//     if (!result.rows.length) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // UPDATE
// // ============================================
// exports.updateUser = async (req, res) => {
//   try {
//     const result = await User.updateUser(req.params.id, req.body);
//     res.json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // DELETE
// // ===========================================
// exports.deleteUser = async (req, res) => {
//   try {
//     await User.deleteUser(req.params.id);
//     res.json({ success: true, message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };






const pool = require('../config/db'); 
const db = require('../config/db');

/* GET /api/users/me */

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.role,
         u.created_at,
         p.username,
         p.bio,
         p.profile_image,
         p.cover_image,
         (SELECT COUNT(*) FROM auth.user_followers WHERE following_id = u.id) AS followers_count,
         (SELECT COUNT(*) FROM auth.user_followers WHERE follower_id = u.id) AS following_count
       FROM auth."user" u
       LEFT JOIN auth.user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


/* PUT /api/users/me */

exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, profile_image, cover_image } = req.body;

    const result = await pool.query(
      `
      INSERT INTO auth.user_profiles (user_id, username, bio, profile_image, cover_image)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        username = EXCLUDED.username,
        bio = EXCLUDED.bio,
        profile_image = EXCLUDED.profile_image,
        cover_image = EXCLUDED.cover_image,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
      `,
      [userId, username, bio, profile_image, cover_image]
    );

    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* GET /api/users/:id */

exports.getUserById = async (req, res) => {
  try {
    const viewerId = req.user.id;
    const userId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        p.username,
        p.bio,
        p.profile_image,
        p.cover_image,
        (SELECT COUNT(*) FROM auth.user_followers WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM auth.user_followers WHERE follower_id = u.id) AS following_count,
        EXISTS (
          SELECT 1 FROM auth.user_followers
          WHERE follower_id = $1 AND following_id = u.id
        ) AS is_following
      FROM auth."user" u
      LEFT JOIN auth.user_profiles p ON p.user_id = u.id
      WHERE u.id = $2;
      `,
      [viewerId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// POST /api/users/follow/:id

// exports.followUser = async (req, res) => {
//   try {
//     const followerId = req.user.id;
//     const followingId = parseInt(req.params.id);

//     if (followerId === followingId) {
//       return res.status(400).json({ message: "You can't follow yourself" });
//     }

//     await pool.query(
//       `
//       INSERT INTO auth.user_followers (follower_id, following_id)
//       VALUES ($1, $2)
//       ON CONFLICT DO NOTHING
//       `,
//       [followerId, followingId]
//     );

//     res.json({ message: 'User followed successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.followUser = async (req, res) => {
  const followerId = req.user.id;          // from JWT
  const followingId = Number(req.params.id);

  if (followerId === followingId) {
    return res.status(400).json({
      message: "You cannot follow yourself"
    });
  }

  try {
    // 1️⃣ target user exists?
    const userCheck = await pool.query(
      `SELECT id FROM auth."user" WHERE id = $1`,
      [followingId]
    );

    if (userCheck.rowCount === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 2️⃣ already followed?
    const exists = await pool.query(
      `SELECT 1 FROM auth.user_followers
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({
        message: "Already following"
      });
    }

    // 3️⃣ insert follow
    await pool.query(
      `INSERT INTO auth.user_followers (follower_id, following_id)
       VALUES ($1, $2)`,
      [followerId, followingId]
    );

    res.status(201).json({
      message: "Followed successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /api/users/unfollow/:id



// exports.unfollowUser = async (req, res) => {
//   try {
//     const followerId = req.user.id;
//     const followingId = parseInt(req.params.id);

//     await pool.query(
//       `
//       DELETE FROM auth.user_followers
//       WHERE follower_id = $1 AND following_id = $2
//       `,
//       [followerId, followingId]
//     );

//     res.json({ message: 'User unfollowed successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = Number(req.params.id);

  if (followerId === followingId) {
    return res.status(400).json({
      message: "You cannot unfollow yourself"
    });
  }

  try {
    // check follow exists
    const exists = await pool.query(
      `SELECT 1 FROM auth.user_followers
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );

    if (exists.rowCount === 0) {
      return res.status(400).json({
        message: "You are not following this user"
      });
    }

    // delete follow
    await pool.query(
      `DELETE FROM auth.user_followers
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );

    res.json({
      message: "Unfollowed successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// POST /api/users/block/:id

exports.blockUser = async (req, res) => {
  const blockerId = req.user.id;
  const blockedId = Number(req.params.id);

  if (blockerId === blockedId) {
    return res.status(400).json({
      message: "You cannot block yourself"
    });
  }

  try {
    await pool.query("BEGIN");

    // insert block
    await pool.query(
      `INSERT INTO auth.user_blocks (blocker_id, blocked_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [blockerId, blockedId]
    );

    // remove follow both ways
    await pool.query(
      `DELETE FROM auth.user_followers
       WHERE (follower_id = $1 AND following_id = $2)
          OR (follower_id = $2 AND following_id = $1)`,
      [blockerId, blockedId]
    );

    await pool.query("COMMIT");

    res.json({
      message: "User blocked successfully"
    });

  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};
