const pool = require("../config/db");

/* ================= CREATE USER ================= */
exports.createUser = async (username, email, hashedPassword, role) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role, created_at`,
    [username, email, hashedPassword, role]
  );

  return result.rows[0];
};

/* ================= GET ALL USERS ================= */
exports.getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users
     ORDER BY id DESC`
  );

  return result.rows;
};

/* ================= GET USER BY ID ================= */
exports.getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

/* ================= UPDATE USER ================= */
exports.updateUser = async (id, username, email, role) => {
  const result = await pool.query(
    `UPDATE users
     SET username = $1,
         email = $2,
         role = $3
     WHERE id = $4
     RETURNING id, username, email, role, created_at`,
    [username, email, role, id]
  );

  return result.rows[0];
};

/* ================= DELETE USER ================= */
exports.deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0];
};
