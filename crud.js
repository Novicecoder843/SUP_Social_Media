const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());


//  GET all users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.json(result.rows);
});


// GET single user
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(result.rows[0]);
});


//  INSERT user
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  const result = await pool.query(
    "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
    [name, email, age]
  );

  res.json(result.rows[0]);
});


//  UPDATE user
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, age } = req.body;
  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *",
    [name, email, age, id]
  );
console.log(result.rows)
  res.json(result.rows[0]);
});


//  DELETE user
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  await pool.query("DELETE FROM users WHERE id=$1", [id]);

  res.json({ message: "User deleted successfully" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the USER CRUD");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});