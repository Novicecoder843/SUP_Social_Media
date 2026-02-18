const pool = require("../config/db");

// Find user by email
const findByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Create user
const createUser = async ({ username, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, password]
  );

  return result.rows[0];
};

// ✅ Update user password
const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `UPDATE users 
     SET password = $1 
     WHERE id = $2`,
    [hashedPassword, userId]
  );
};

module.exports = {
  findByEmail,
  createUser,
  updatePassword,
};
