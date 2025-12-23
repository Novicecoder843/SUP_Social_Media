const { Client } = require("pg");

const con = new Client({
  user: "postgres",
  host: "localhost",
  database: "social_media_db",
  password: "1234",
  port: 5432
});
con.connect().then(()=> console.log("connected"))

module.exports = con ;
