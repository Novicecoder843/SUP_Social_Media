const pool = require("../db/db");

// Create profile
const createProfile = async (user_id, username, bio, profile_image) => {
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, username, bio, profile_image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, username, bio, profile_image]
  );
  return result.rows[0];
};

// Get profile
const getProfile = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE user_id=$1",
    [user_id]
  );
  return result.rows[0];
};

// Update profile
const updateProfile = async (user_id, username, bio, profile_image) => {
  const result = await pool.query(
    `UPDATE user_profiles
     SET username=$1, bio=$2, profile_image=$3, updated_at=NOW()
     WHERE user_id=$4
     RETURNING *`,
    [username, bio, profile_image, user_id]
  );
  return result.rows[0];
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile  
};