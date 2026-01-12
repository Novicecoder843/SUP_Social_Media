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

exports.findRoleById = (role_id) => {
  return pool.query(`SELECT * FROM user_schema.userstable WHERE role_id=$1`, [role_id]);
};


exports.getAllUsers = () => {
  return pool.query(
    `SELECT id, full_name, email, role_id 
         FROM user_schema.userstable 
         WHERE status = 'active'`
  );
};

exports.getUserById = (id) => {
  return pool.query(
    `SELECT id, full_name, email, role_id 
         FROM user_schema.userstable 
         WHERE id = $1`,
    [id]
  );
};

exports.updateUser = (id, full_name, role_id) => {
  return pool.query(
    `UPDATE user_schema.userstable
         SET full_name = $1, role_id = $2, updated_at = NOW()
         WHERE id = $3`,
    [full_name, role_id, id]
  );
};

exports.softDeleteUser = (id) => {
  return pool.query(
    `UPDATE user_schema.userstable
         SET status = 'inactive', updated_at = NOW()
         WHERE id = $1`,
    [id]
  );
};