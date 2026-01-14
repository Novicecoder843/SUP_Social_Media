// const db = require("../config/db");

// exports.findUserByEmail = async (email) => {
//   return db.query(
//     `SELECT * FROM users WHERE email = $1`,
//     [email]
//   );
// };

// exports.createUser = async (name, email, password, role_id) => {
//   const query = `
//     INSERT INTO users (name, email, password, role_id)
//     VALUES ($1, $2, $3, $4)
//     RETURNING *
//   `;
//   return db.query(query, [name, email, password, role_id]);
// };

const db = require("../config/db");

exports.createUser = async (name, email, password, role_id) => {
  const query = `
    INSERT INTO users (name, email, password, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role_id
  `;
  const result = await db.query(query, [name, email, password, role_id]);
  return result.rows[0];
};

exports.getUsers = async () => {
  const query = `
    SELECT users.id, users.name, users.email, roles.name AS role
    FROM users
    JOIN roles ON users.role_id = roles.id
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.updateUser = async (id, name, email, role_id) => {
  const query = `
    UPDATE users
    SET name = $1, email = $2, role_id = $3
    WHERE id = $4
    RETURNING id, name, email, role_id
  `;
  const result = await db.query(query, [name, email, role_id, id]);
  return result.rows[0];
};

exports.deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};