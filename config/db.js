const { Pool } = require("pg");

const pool = new Pool({
    host:"localhost",
    user: "postgres",
    password: "puchu",
    database: "Social_media",
     port: 5432,

});
(async () => {
   try {
      const res = await pool.query("SELECT NOW()");
      console.log("DB connected successfully");
      console.log(res.rows);
   } catch (err) {
      console.error("DB error:", err.message);
   }
})();

