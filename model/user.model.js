const pool = require("../config/db");


exports.updateUser = async (id, { name, email }) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 AND deleted_at IS NULL
     RETURNING *`,
    [name, email, id]
  );

  return result.rows[0];
};

exports.deleteUser = async (id) => {
  const result = await pool.query(
    `UPDATE users
     SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

exports.getAllUsers = async () => {
  const result = await pool.query(
    "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id"
  );

  return result.rows;
};

exports.getSingleUser = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );

  return result.rows[0];
};

// const pool = require("../config/db");

exports.findByEmail = async (email) => {
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
};

exports.createUser = async ({ name, first_name, last_name, email, password, mobile, role_id }) => {
  let fName = first_name;
  let lName = last_name || null;

  if (!fName && typeof name === 'string') {
    const parts = name.trim().split(/\s+/);
    fName = parts[0] || '';
    if (parts.length > 1) lName = parts.slice(1).join(' ');
  }

  // Ensure first name is not null to satisfy DB constraint
  if (!fName) fName = '';

  const res = await pool.query(
    `INSERT INTO users (first_name, last_name, email, mobile, password, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, role_id, first_name, last_name, mobile`,
    [fName, lName, email, mobile || null, password, role_id || null]
  );
  return res.rows[0];
};

exports.findByEmailWithRole = async (email) => {
  const res = await pool.query(
    `SELECT u.*, r.role_name
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.email = $1`,
    [email]
  );
  return res.rows[0];
};
exports.roleExists = async (role_id) => {
  const result = await pool.query(
    "SELECT id FROM roles WHERE id = $1",
    [role_id]
  );
  return result.rows.length > 0;
};

