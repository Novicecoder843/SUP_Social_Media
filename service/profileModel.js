const pool = require("../db/db");

//  Create profile
const createProfile = async (user_id, username, bio, profile_image) => {
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, username, bio, profile_image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, username, bio, profile_image]
  );
  return result.rows[0];
};

//  Get profile
const getProfile = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE user_id=$1",
    [user_id]
  );
  return result.rows[0];
};

//  Update profile (image optional)
const updateProfile = async (user_id, username, bio, profile_image) => {
  let query;
  let values;

  if (profile_image) {
    query = `
      UPDATE user_profiles
      SET username=$1, bio=$2, profile_image=$3
      WHERE user_id=$4
      RETURNING *`;
    values = [username, bio, profile_image, user_id];
  } else {
    query = `
      UPDATE user_profiles
      SET username=$1, bio=$2
      WHERE user_id=$3
      RETURNING *`;
    values = [username, bio, user_id];
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

//  Find username
const findByUsername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE username=$1",
    [username]
  );
  return result.rows[0];
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  findByUsername
};