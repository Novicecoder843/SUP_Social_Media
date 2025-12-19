
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
.then(() => {
  console.log("Connected to the database successfully.");
})
.catch((err) => {
  console.error("Database connection error:", err.stack);
});

module.exports = pool;