const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // save user to DB (example)
    const user = {
      email,
      password: hashedPassword
    };

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // get user from DB (example)
    const user = await User.findOne({ email }); // replace with your model
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// In-memory "database"
const users = [];

/* Helpers */
const generateAccessToken = (user) =>
  jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

/* ================= AUTH ROUTES ================= */

/* REGISTER */
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword,
    isVerified: false,
    refreshToken: null
  });

  res.status(201).json({ message: "User registered" });
});

/* LOGIN */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  res.json({ accessToken, refreshToken });
});

/* LOGOUT */
app.post("/api/auth/logout", (req, res) => {
  const { refreshToken } = req.body;
  const user = users.find(u => u.refreshToken === refreshToken);

  if (user) user.refreshToken = null;

  res.json({ message: "Logged out successfully" });
});

/* REFRESH TOKEN */
app.post("/api/auth/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find(u => u.refreshToken === refreshToken);
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
    if (err) return res.sendStatus(403);
    res.json({ accessToken: generateAccessToken(user) });
  });
});

/* VERIFY EMAIL */
app.post("/api/auth/verify-email", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.sendStatus(404);

  user.isVerified = true;
  res.json({ message: "Email verified" });
});

/* FORGOT PASSWORD */
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.sendStatus(404);

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

  // Normally emailed
  res.json({ resetToken });
});

/* RESET PASSWORD */
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.email === decoded.email);

    if (!user) return res.sendStatus(404);

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: "Password reset successful" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

/* SERVER */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
