// const { Client } = require("pg");

// const con = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "social_media_db",
//   password: "1234",
//   port: 5432
// });
// con.connect().then(()=> console.log("connected"))

// module.exports = con ;
const { Pool } = require("pg");

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

module.exports = pool;
