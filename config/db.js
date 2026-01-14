const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    user: "postgres",
    password: "sradha123",
    database: "Social_media",
     port: 5432,

});

pool.query("SELECT NOW()")
.then(() => console.log("DB connected successfully"))
.catch(err => console.error("DB error:", err.message));
 module.exports = pool;