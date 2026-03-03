// const pool = require('../config/db');

// // CREATE
// // ===============================================
// exports.createUser = (data) => {
//   const { email, password, mobile, name, first_name, last_name, city } = data;

//   return pool.query(
//     `INSERT INTO user_schema.users
//      (email,password,mobile,name,first_name,last_name,city)
//      VALUES ($1,$2,$3,$4,$5,$6,$7)
//      RETURNING *`,
//     [email, password, mobile, name, first_name, last_name, city]
//   );
// };

// // GET ALL
// // ====================================================
// exports.getAllUsers = () => {
//   return pool.query(
//     `SELECT * FROM user_schema.users
//      WHERE deleted_at IS NULL
//      ORDER BY uid`
//   );
// };

// // GET BY ID
// // =======================================================
// exports.getUserById = (id) => {
//   return pool.query(
//     `SELECT * FROM user_schema.users
//      WHERE uid=$1 AND deleted_at IS NULL`,
//     [id]
//   );
// };

// // UPDATE
// // =========================================================
// exports.updateUser = (id, data) => {
//   const { name, city, status } = data;

//   return pool.query(
//     `UPDATE user_schema.users
//      SET name=$1, city=$2, status=$3, updated_at=NOW()
//      WHERE uid=$4 AND deleted_at IS NULL
//      RETURNING *`,
//     [name, city, status, id]
//   );
// };

// // DELETE
// // =======================================================
// exports.deleteUser = (id) => {
//   return pool.query(
//     `UPDATE user_schema.users
//      SET deleted_at=NOW()
//      WHERE uid=$1`,
//     [id]
//   );
// };



const pool = require("../config/db");

/* =====================================================
   GET MY PROFILE
   ===================================================== */
exports.getMyProfile = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
        u.id,
        u.email,
        u.role,
        p.username,
        p.bio,
        p.profile_image,
        p.cover_image,

        (SELECT COUNT(*) 
         FROM auth.user_followers 
         WHERE following_id = u.id) AS followers_count,

        (SELECT COUNT(*) 
         FROM auth.user_followers 
         WHERE follower_id = u.id) AS following_count

    FROM auth."user" u
    LEFT JOIN auth.user_profiles p 
        ON p.user_id = u.id
    WHERE u.id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

/* =====================================================
   UPSERT PROFILE (UPDATE / CREATE)
   ===================================================== */
exports.updatetProfile = async (
  userId,
  username,
  bio,
  profileImage,
  coverImage
) => {
  const result = await pool.query(
    `
    INSERT INTO auth.user_profiles
        (user_id, username, bio, profile_image, cover_image)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = COALESCE(EXCLUDED.username, auth.user_profiles.username),
        bio = COALESCE(EXCLUDED.bio, auth.user_profiles.bio),
        profile_image = COALESCE(EXCLUDED.profile_image, auth.user_profiles.profile_image),
        cover_image = COALESCE(EXCLUDED.cover_image, auth.user_profiles.cover_image),
        updated_at = NOW()
    RETURNING *;
    `,
    [userId, username, bio, profileImage, coverImage]
  );

  return result.rows[0];
};

/* =====================================================
   GET USER BY ID (WITH is_following)
   ===================================================== */
exports.getUserById = async (currentUserId, targetUserId) => {
  const result = await pool.query(
    `
    SELECT
        u.id,
        p.username,
        p.bio,
        p.profile_image,
        p.cover_image,

        (SELECT COUNT(*) 
         FROM auth.user_followers 
         WHERE following_id = u.id) AS followers_count,

        (SELECT COUNT(*) 
         FROM auth.user_followers 
         WHERE follower_id = u.id) AS following_count,

        EXISTS (
            SELECT 1
            FROM auth.user_followers
            WHERE follower_id = $1
            AND following_id = u.id
        ) AS is_following

    FROM auth."user" u
    LEFT JOIN auth.user_profiles p
        ON p.user_id = u.id
    WHERE u.id = $2
    `,
    [currentUserId, targetUserId]
  );

  return result.rows[0];
};

/* =====================================================
   FOLLOW USER
   ===================================================== */
exports.followUser = async (followerId, followingId) => {
  return pool.query(
    `
    INSERT INTO auth.user_followers (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [followerId, followingId]
  );
};

/* =====================================================
   UNFOLLOW USER
   ===================================================== */
exports.unfollowUser = async (followerId, followingId) => {
  return pool.query(
    `
    DELETE FROM auth.user_followers
    WHERE follower_id = $1
    AND following_id = $2
    `,
    [followerId, followingId]
  );
};

/* =====================================================
   BLOCK USER (Auto remove follow both sides)
   ===================================================== */
exports.blockUser = async (blockerId, blockedId) => {
  await pool.query(
    `
    INSERT INTO auth.user_blocks (blocker_id, blocked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [blockerId, blockedId]
  );

  return pool.query(
    `
    DELETE FROM auth.user_followers
    WHERE (follower_id = $1 AND following_id = $2)
       OR (follower_id = $2 AND following_id = $1)
    `,
    [blockerId, blockedId]
  );
};
