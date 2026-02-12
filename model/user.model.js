const pool = require("../config/db");

/* ================= CREATE USER ================= */
exports.createUser = async ({ username, email, password, role }) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role, created_at`,
    [username, email, password, role]
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
exports.updateUser = async (id, data) => {
  console.log("id:", id, "data:", data);

  const fields = Object.keys(data);       // ['username', 'email', 'role']
  const values = Object.values(data);     // ['subrat', '...', 'user']

  if (fields.length === 0) return null;   // Nothing to update

  // Build dynamic SET part
  const setQuery = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const query = `
    UPDATE users
    SET ${setQuery}
    WHERE id = $${fields.length + 1}
    RETURNING id, username, email, role, created_at
  `;

  const result = await pool.query(query, [...values, id]);

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
