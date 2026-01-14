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

// create role

app.post("/roles", async (req, res) => {
  const { name, description } = req.body;
  await db.query(
    "INSERT INTO roles (name, description) VALUES ($1, $2)",
    [name, description]
  );
  res.status(201).json({ message: "Role created" });
});

// read roles
app.get("/roles", async (req, res) => {
  const roles = await db.query("SELECT * FROM roles WHERE status = true");
  res.json(roles.rows);
});


// update roles

app.put("/roles/:id", async (req, res) => {
  const { name } = req.body;
  await db.query(
    "UPDATE roles SET name=$1, updated_at=NOW() WHERE id=$2",
    [name, req.params.id]
  );
  res.json({ message: "Role updated" });
});


//delete role

app.delete("/roles/:id", async (req, res) => {
  await db.query(
    "UPDATE roles SET status=false WHERE id=$1",
    [req.params.id]
  );
  res.json({ message: "Role deactivated" });
});

// register api

app.post("/api/auth/register", async (req, res) => {
  const { email, password, role_id } = req.body;

  // 1. Check email
  const existing = await db.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );
  if (existing.rowCount)
    return res.status(400).json({ message: "Email already exists" });

  // 2. Check role exists
  const role = await db.query(
    "SELECT id FROM roles WHERE id=$1 AND status=true",
    [role_id]
  );
  if (!role.rowCount)
    return res.status(400).json({ message: "Invalid role" });

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Save user
  await db.query(
    `INSERT INTO users (email, password, role_id)
     VALUES ($1, $2, $3)`,
    [email, hashedPassword, role_id]
  );

  res.status(201).json({ message: "User registered successfully" });
});


// login api

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Get user
  const result = await db.query(
    `SELECT u.*, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE email=$1`,
    [email]
  );

  if (!result.rowCount)
    return res.status(401).json({ message: "Invalid credentials" });

  const user = result.rows[0];

  // 2. Check status
  if (user.status !== "ACTIVE")
    return res.status(403).json({ message: "User is inactive" });

  // 3. Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ message: "Invalid credentials" });

  // 4. Generate JWT
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 5. Update last login
  await db.query(
    "UPDATE users SET last_login=NOW() WHERE id=$1",
    [user.id]
  );

  res.json({ token });
});


// jwt token

// {
//   "sub": 12,
//   "role": "ADMIN",
//   "iat": 1700000000,
//   "exp": 1700000900
// }


// jwtt verification

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

//ADMIN-Only Route

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN")
    return res.sendStatus(403);
  next();
};

app.get("/admin/dashboard", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// JWT Verification Middleware

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //  Token expired or invalid
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired → Unauthorized" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};


// Send Email via Nodemailer

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;



// Registration API

const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

app.post("/api/auth/register", async (req, res) => {
  const { email, password, role_id } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (email, password, role_id) VALUES ($1, $2, $3)",
    [email, hashedPassword, role_id]
  );

  //  Send email after successful DB insert
  await sendEmail({
    to: email,
    subject: "Welcome to Our Platform 🎉",
    html: `<p>Your account has been created successfully.</p>`
  });

  res.status(201).json({ message: "Registration successful" });
});


//Forgot Password API

const jwt = require("jsonwebtoken");

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  const result = await db.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (!result.rowCount)
    return res.status(404).json({ message: "User not found" });

  const userId = result.rows[0].id;

  const resetToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<a href="${resetLink}">Reset Password</a>`
  });

  res.json({ message: "Reset link sent" });
});


// Reset Password API

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [hashedPassword, decoded.userId]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset token expired" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
});

// {
//   "message": "Reset token expired"
// }


// Login API

const crypto = require("crypto");

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ message: "Invalid credentials" });

  // Access token
  const accessToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex");

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [user.id, refreshToken]
  );

  res.json({ accessToken, refreshToken });
});

// Refresh Token

app.post("/api/auth/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  const result = await db.query(
    `SELECT * FROM refresh_tokens
     WHERE token=$1 AND is_revoked=false AND expires_at > NOW()`,
    [refreshToken]
  );

  if (!result.rowCount)
    return res.status(401).json({ message: "Refresh token expired or revoked" });

  const newAccessToken = jwt.sign(
    { sub: result.rows[0].user_id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken: newAccessToken });
});


