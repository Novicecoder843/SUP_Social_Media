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
    `INSERT INTO users(email,password,role_id,is_email_verified)
     VALUES($1,$2,$3,false) RETURNING *`,
    [email, hashed, roleId]
  );

  const user = result.rows[0];

  const token = crypto.randomBytes(32).toString("hex");

  await pool.query(
    `INSERT INTO email_verifications(user_id,token,is_used)
     VALUES($1,$2,false)`,
    [user.id, token]
  );

  const link = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

  await sendEmail(email, "Verify Email", link);

  return { message: "Registered. Please verify email" };
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

  if (!dbUser.is_email_verified) {
    throw new Error("Please verify email first");
  }

  const match = await comparePassword(password, dbUser.password);

  if (!match) {
    throw new Error("Invalid password");
  }

  const accessToken = generateToken(dbUser);
  const refreshToken = generateRefreshToken(dbUser);

  await pool.query(
    `INSERT INTO refresh_tokens(user_id,token,is_revoked,expires_at)
     VALUES($1,$2,false, NOW() + INTERVAL '7 days')`,
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

  const decoded = verifyToken(token);

  const newToken = generateToken({
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

  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail(email, "Reset Password", link);

  return { message: "Reset link sent" };
};

exports.resetPassword = async (token, password) => {

  const user = await pool.query(
    "SELECT * FROM users WHERE reset_token=$1",
    [token]
  );

  if (user.rows.length === 0) {
    throw new Error("Invalid token");
  }

  const hashed = await hashPassword(password);

  await pool.query(
    `UPDATE users
     SET password=$1, reset_token=NULL
     WHERE reset_token=$2`,
    [hashed, token]
  );

  return { message: "Password reset successful" };
};
exports.verifyEmail = async (token) => {

  const data = await pool.query(
    `SELECT * FROM email_verifications
     WHERE token=$1 AND is_used=false`,
    [token]
  );

  if (data.rows.length === 0) {
    throw new Error("Invalid or expired token");
  }

  const userId = data.rows[0].user_id;

  await pool.query(
    "UPDATE users SET is_email_verified=true WHERE id=$1",
    [userId]
  );

  await pool.query(
    "UPDATE email_verifications SET is_used=true WHERE token=$1",
    [token]
  );

  return { message: "Email verified successfully" };
};