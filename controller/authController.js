/* Register API */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const db = require("../config/db");
const jwtConfig = require("../config/jwt");

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