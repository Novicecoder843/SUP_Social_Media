const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "password",
  database: "testdb",
  port: 5432
});

/* =========================
   CREATE USER
========================= */
app.post("/users", async (req, res) => {
  try {
    const { email, password, mobile, name, first_name, last_name, city } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      `INSERT INTO user_schema.users
       (email, password, mobile, name, first_name, last_name, city)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [email, password, mobile, name, first_name, last_name, city]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET USERS
========================= */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_schema.users LIMIT 10"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   SERVER
========================= */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
