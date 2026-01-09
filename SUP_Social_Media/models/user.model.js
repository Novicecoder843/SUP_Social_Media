const pool = require('../config/db');

// CREATE
// ===============================================
exports.createUser = (data) => {
  const { email, password, mobile, name, first_name, last_name, city } = data;

  return pool.query(
    `INSERT INTO user_schema.users
     (email,password,mobile,name,first_name,last_name,city)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [email, password, mobile, name, first_name, last_name, city]
  );
};

// GET ALL
// ====================================================
exports.getAllUsers = () => {
  return pool.query(
    `SELECT * FROM user_schema.users
     WHERE deleted_at IS NULL
     ORDER BY uid`
  );
};

// GET BY ID
// =======================================================
exports.getUserById = (id) => {
  return pool.query(
    `SELECT * FROM user_schema.users
     WHERE uid=$1 AND deleted_at IS NULL`,
    [id]
  );
};

// UPDATE
// =========================================================
exports.updateUser = (id, data) => {
  const { name, city, status } = data;

  return pool.query(
    `UPDATE user_schema.users
     SET name=$1, city=$2, status=$3, updated_at=NOW()
     WHERE uid=$4 AND deleted_at IS NULL
     RETURNING *`,
    [name, city, status, id]
  );
};

// DELETE
// =======================================================
exports.deleteUser = (id) => {
  return pool.query(
    `UPDATE user_schema.users
     SET deleted_at=NOW()
     WHERE uid=$1`,
    [id]
  );
};
