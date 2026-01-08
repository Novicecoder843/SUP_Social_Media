const { Pool } = require("pg");
const pool = new Pool ({
  host: process.env.DB_HOST,
  user: "postgres",
  port: 5432,
  password: "puja123",
  database: "Social_media",
});
(async () => {
  try {
 const res = await pool.query("SELECT NOW()");
    console.log(res.rows);
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
})();