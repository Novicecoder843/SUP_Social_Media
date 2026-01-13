const db = require("../config/db");

exports.findUserByEmail = async (email) => {
  return db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
};

exports.createUser = async (name, email, password, role_id) => {
  const query = `
    INSERT INTO users (name, email, password, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  return db.query(query, [name, email, password, role_id]);
};