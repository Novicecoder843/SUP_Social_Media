const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {

  const { email, password } = data;

  const userExist = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userExist.rows.length > 0) {
    throw new Error("Email exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users(email,password,role_id) VALUES($1,$2,1) RETURNING *",
    [email, hash]
  );

  return result.rows[0];
};



exports.login = async (data) => {

  const { email, password } = data;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};