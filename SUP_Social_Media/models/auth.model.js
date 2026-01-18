// const pool = require('../config/db');

// exports.findByEmail = (email) => {
//   return pool.query(
//     'SELECT * FROM auth.user WHERE email=$1',
//     [email]
//   );
// };

// exports.createUser = (name, email, password, role) => {
//   return pool.query(
//     `INSERT INTO auth.user (name, email, password, role, status)
//      VALUES ($1,$2,$3,$4,'active')`,
//     [name, email, password, role]
//   );
// };

// exports.updatePassword = (email, password) => {
//   return pool.query(
//     `UPDATE auth.user SET password=$1 WHERE email=$2`,
//     [password, email]
//   );
// };
