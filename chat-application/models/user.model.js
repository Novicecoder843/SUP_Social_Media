const db = require("../config/db");

// create user
exports.createUser = async (email, password) => {
  const result = await db.query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)
     RETURNING id, email`,
    [email, password]
  );

  return result.rows[0];
};

// find user
exports.findByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  return result.rows[0];
};