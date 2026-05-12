const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// 📝 REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email & password required"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser(email, hashedPassword);

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {

    console.log("🔥 LOGIN API HIT");

    const { email, password } = req.body;

    console.log(email, password);

    // find user
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // send response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {

    console.log("❌ LOGIN ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};