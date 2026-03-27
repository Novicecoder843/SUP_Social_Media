
const { Pool, Client } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "social_media_db",
  port: 5432,
});


pool.on("connect", () => {
  console.log("PostgreSQL connected successfuly");
console.log("connected successfully")

});

const originalQuery = pool.query;

pool.query = async (...args) => {
  console.log("SQL:", args[0]);     // Query text
  console.log("Params:", args[1]);  // Values
  return originalQuery.apply(pool, args);
};


module.exports = pool;
