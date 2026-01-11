const pool = require("../config/db");

exports.createUser = (user) => {
  return pool.query(
    `INSERT INTO user_schema.userstable (full_name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user.full_name, user.email, user.password_hash, user.role_id]
  );
};

exports.findByEmail = (email) => {
  return pool.query(`SELECT * FROM user_schema.userstable WHERE email=$1`, [email]);
};
