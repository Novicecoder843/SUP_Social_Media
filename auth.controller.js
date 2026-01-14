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

