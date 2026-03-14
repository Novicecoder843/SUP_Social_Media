const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");  

exports.register = async ({ email, password }) => {

  const userExist = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userExist.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(password);

  // get role
  const roleResult = await pool.query(
    "SELECT id FROM roles WHERE name=$1",
    ["User"]
  );

  if (roleResult.rows.length === 0) {
    throw new Error("Role not found");
  }

  const roleId = roleResult.rows[0].id;

  const result = await pool.query(
    "INSERT INTO users(email,password,role_id) VALUES($1,$2,$3) RETURNING *",
    [email, hashed, roleId]
  );

  return result.rows[0];
};
exports.login = async ({ email, password }) => {

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0) {
    throw new Error("Invalid email");
  }

  const dbUser = user.rows[0];

  const match = await comparePassword(
    password,
    dbUser.password
  );

  if (!match) {
    throw new Error("Invalid password");
  }

  const token = generateToken(dbUser);

  return { token, user: dbUser };
};
