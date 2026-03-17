const { Pool } = require("pg");

const pool = new Pool({
    host:"localhost",
    user: "postgres",
    password: "puchu",
    database: "Social_media",
     port: 5432,

});

pool.query("SELECT NOW()")
.then(() => console.log("DB connected successfully"))
.catch(err => console.error("DB error:", err.message)); 


// const originalQuery = pool.query;

// pool.query = async (...args) => {
//   console.log("SQL:", args[0]);     // Query text
//   console.log("Params:", args[1]);  // Values
//   return originalQuery.apply(pool, args);
// };
//  module.exports = pool;

const query = async (text, params) => {
  console.log("Executing Query:", text);
  console.log("With Values:", params);
  const result = await pool.query(text, params);
  return result;
};

module.exports = {
  query,
};
