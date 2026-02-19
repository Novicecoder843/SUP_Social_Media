const pool = require("../config/db");

/* ================= CREATE PROFILE ================= */
exports.createProfile = async (userId, bio, profile_image, cover_image) => {
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, bio, profile_image, cover_image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, bio, profile_image, cover_image]
  );

  return result.rows[0];
}

/* ================= GET MY PROFILE ================= */
exports.getMyProfile = async (userId) => {
  const result = await pool.query(
    `SELECT u.id, u.username, u.email, u.created_at,
            p.bio, p.profile_image, p.cover_image
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0];
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (userId, bio, profile_image, cover_image) => {
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, bio, profile_image, cover_image)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id)
     DO UPDATE SET
       bio = EXCLUDED.bio,
       profile_image = EXCLUDED.profile_image,
       cover_image = EXCLUDED.cover_image,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, bio, profile_image, cover_image]
  );

  return result.rows[0];
};

/* ================= GET USER BY ID ================= */
exports.getUserById = async (id) => {
  const result = await pool.query(
    `SELECT u.id, u.username, u.created_at,
            p.bio, p.profile_image, p.cover_image
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [id]
  );

  return result.rows[0];
};
