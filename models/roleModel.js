const pool = require("../config/db");

exports.createRole = (data) => {
  return pool.query(
    `INSERT INTO user_schema.roles (role_name, description)
     VALUES ($1, $2) RETURNING *`,
    [data.role_name, data.description]
  );
};

exports.getRoles = () => {
  return pool.query(`SELECT * FROM user_schema.roles WHERE status='active'`);
};

exports.updateRole = (id, data) => {
  return pool.query(
    `UPDATE user_schema.roles SET role_name=$1, description=$2, updated_at=NOW()
     WHERE id=$3 RETURNING *`,
    [data.role_name, data.description, id]
  );
};

exports.deleteRole = (id) => {
  return pool.query(
    `UPDATE user_schema.roles SET status='inactive' WHERE id=$1`,
    [id]
  );
};


