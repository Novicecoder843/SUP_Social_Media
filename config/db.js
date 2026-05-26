const { Pool } = require("pg");

const pool = new Pool ({
  host: process.env.DB_HOST,
  user: "postgres",
  port: 5432,
  password: "puja123",
  database: "Social_media",
  port: 5432,
});

// pool.query("SELECT NOW()")
// .then(() => console.log("DB connected successfully"))
// .catch(err => console.error("DB error:", err.message));
// module.exports = pool;

// const query = async (text, params) => {
//   console.log("Executing Query:", text);
//   console.log("With values:", params);
//   const result = await pool.query(text, params);
//   return result;
// };

// module.exports = {
//   query,
// };

pool.connect()
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.error("DB error:", err.message));

module.exports = pool;