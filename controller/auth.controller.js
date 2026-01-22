/* Register API */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const db = require("../config/db");
const jwtConfig = require("../config/jwt");
const { sendLoginEmail } = require("../utils/sendEmail");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    // Check role exists
    const role = await db.query(
      `SELECT id FROM roles WHERE id = $1 AND status = true`,
      [role_id]
    );
    if (!role.rows.length) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check email exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser.rows.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.createUser(
      name,
      email,
      hashedPassword,
      role_id
    );

    res.status(201).json({
      message: "User registered successfully",
      user: user.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* Login API */
const AuthModel = require("../models/authModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
      .status(400)
      .json({ message: "Email and password required" });
    }

    const user = await AuthModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" })
    }
    // 📧 SEND EMAIL TO LOGGED-IN USER
       sendLoginEmail(user.email, user.name)
      .catch(err => console.error("Login email failed:", err.message));

    // Generate JWT
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role_id
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* logout API */
exports.logout = async (rqe, res) => {
  try {
    res.status(200).json({
      message: "Logout successful"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
/* Password */
const crypto = require("crypto");

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate random token
    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const user = await AuthModel.setResetToken(email, token, expires);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(Reset token for ${email}: ${token});
    res.status(200).json({
      message: "Reset token generated successfully",
      token 
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password required" });
    }

    const user = await AuthModel.findByResetToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const updatedUser = await AuthModel.updatePassword(user.id, newPassword);

    res.status(200).json({
      message: "Password reset successful",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};