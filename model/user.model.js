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
