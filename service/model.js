const pool = require("../db/db");

//  Find user (CASE-INSENSITIVE)
const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  return result.rows[0];
};


// Create user WITH ROLE
const createUser = async (name, email, age, password, role_id) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, age, password, role_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email.toLowerCase(), age, password, role_id] // ✅ store lowercase
  );
  return result.rows[0];
};


// Update password
const updatePasswordById = async (id, password) => {
  return pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [password, id]
  );
};


// Save OTP (FIXED + DEBUG)
const saveOTP = async (email, otp) => {
  const result = await pool.query(
    "UPDATE users SET otp=$1 WHERE LOWER(email)=LOWER($2) RETURNING *",
    [otp, email]
  );

  console.log("✅ OTP Save Result:", result.rows[0]); // debug

  return result;
};


// Clear OTP
const clearOTP = async (email) => {
  return pool.query(
    "UPDATE users SET otp=NULL WHERE LOWER(email)=LOWER($1)",
    [email]
  );
};


// Get users with roles
const getUsersWithRoles = async () => {
  const result = await pool.query(`
    SELECT users.id, users.name, users.email, roles.name AS role
    FROM users
    JOIN roles ON users.role_id = roles.id
  `);
  return result.rows;
};


module.exports = {
  findUserByEmail,
  createUser,
  updatePasswordById,
  saveOTP,
  clearOTP,
  getUsersWithRoles
};