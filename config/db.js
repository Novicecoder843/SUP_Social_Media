require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection failed");
    console.error(err.message);
  }
})();

const originalQuery = pool.query;

pool.query = async (...args) => {
  console.log("SQL:", args[0]);     // Query text
  console.log("Params:", args[1]);  // Values
  return originalQuery.apply(pool, args);
};
module.exports = pool;
