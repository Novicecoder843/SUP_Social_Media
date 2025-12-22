const { Client } = require("pg");
const dbClient = new Client ({
  host: process.env.DB_HOST || "localhost",
  user: "postgres",
  port: 5432,
  password: "puja123",
  database: "Social_media",
});
dbClient.connect()
.then(() => console.log("Connected to PostgreSQL"))
.catch(err => console.error("DB connection error:", err.message));

module.exports = dbClient;