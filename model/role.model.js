const pool = require("../config/db");

exports.createRole = async (role_name, description) => {
  const res = await pool.query(
    `INSERT INTO roles (role_name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [role_name, description]
  );
  return res.rows[0];
};

exports.getRoles = async () => {
  const res = await pool.query("SELECT * FROM roles WHERE status = true");
  return res.rows;
};
