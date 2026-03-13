const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

module.exports = pool;

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Socialmedia",
//   password: "8917",
//   port: 5432,
// });

// pool.connect()
//   .then(() => {
//     console.log("✅ DB Connected");
//   })
//   .catch((err) => {
//     console.log("❌ DB Not Connected", err.message);
//   });

// module.exports = pool;