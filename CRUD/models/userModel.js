const pool = require("../config/db");


const createUser = async (name, email) => {
  return await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
};


const getAllUsers = async () => {
  return await pool.query(
    "SELECT * FROM users WHERE is_deleted = false"
  );
};


const getUserById = async (id) => {
  return await pool.query(
    "SELECT * FROM users WHERE id = $1 AND is_deleted = false",
    [id]
  );
};


const updateUser = async (id, name, email) => {
  return await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
};


const hardDeleteUser = async (id) => {
  return await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );
};


const softDeleteUser = async (id) => {
  return await pool.query(
    "UPDATE users SET is_deleted = true WHERE id = $1",
    [id]
  );
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
};
