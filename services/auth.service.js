const crypto = require("crypto");
const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt");
const { sendEmail } = require("../utils/mailer");

exports.register = async ({ email, password }) => {

  const userExist = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userExist.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(password);
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

  const accessToken = generateToken(dbUser);

  const refreshToken = generateRefreshToken(dbUser);

  await pool.query(
    `INSERT INTO refresh_tokens(user_id,token,expires_at)
     VALUES($1,$2, NOW() + INTERVAL '7 days')`,
    [dbUser.id, refreshToken]
  );

  return {
    accessToken,
    refreshToken,
  };
};
exports.refresh = async (token) => {

  const data = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1 AND is_revoked=false",
    [token]
  );

  if (data.rows.length === 0) {
    throw new Error("Invalid refresh token");
  }

  const decoded = require("../utils/jwt").verifyToken(token);

  const newToken = require("../utils/jwt").generateToken({
    id: decoded.id,
  });

  return { accessToken: newToken };
};
exports.logout = async (token) => {

  await pool.query(
    "UPDATE refresh_tokens SET is_revoked=true WHERE token=$1",
    [token]
  );

  return { message: "Logged out" };
};
exports.forgotPassword = async (email) => {

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const token = crypto.randomBytes(32).toString("hex");

  await pool.query(
    "UPDATE users SET reset_token=$1 WHERE email=$2",
    [token, email]
  );

  const link =
    process.env.CLIENT_URL +
    "/reset-password?token=" +
    token;

  await sendEmail(
    email,
    "Reset Password",
    link
  );

  return { message: "Email sent" };
};
exports.resetPassword = async (token, password) => {

  const data = await pool.query(
    `SELECT * FROM password_resets
     WHERE token=$1 AND is_used=false`,
    [token]
  );

  if (data.rows.length === 0) {
    throw new Error("Invalid token");
  }

  const userId = data.rows[0].user_id;

  const hashed = await hashPassword(password);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hashed, userId]
  );

  await pool.query(
    "UPDATE password_resets SET is_used=true WHERE token=$1",
    [token]
  );

  return { message: "Password updated" };
};
exports.verifyEmail = async (userId) => {

  await pool.query(
    "UPDATE users SET is_email_verified=true WHERE id=$1",
    [userId]
  );

  return { message: "Email verified" };
};