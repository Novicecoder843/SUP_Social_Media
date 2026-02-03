const db = require("../config/db");

exports.findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

exports.setResetToken = async (email, token, expires) => {
  const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expires = $2
    WHERE email = $3
    RETURNING id, email
  `;
  const result = await db.query(query, [token, expires, email]);
  return result.rows[0];
};

exports.findByResetToken = async (token) => {
  const query = `
    SELECT * FROM users
    WHERE reset_token = $1 AND reset_token_expires > NOW()
  `;
  const result = await db.query(query, [token]);
  return result.rows[0];
};

exports.updatePassword = async (id, newPassword) => {
  const query = `
    UPDATE users
    SET password = $1, reset_token = NULL, reset_token_expires = NULL
    WHERE id = $2
    RETURNING id, email
  `;
  const result = await db.query(query, [newPassword, id]);
  return result.rows[0];
};