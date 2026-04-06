const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

// Optional: Test connection
pool.connect()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

module.exports = pool;