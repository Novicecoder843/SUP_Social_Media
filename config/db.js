const { client } = require("pg");
const client = new Client ({
  host: process.env.DB_HOST,
  user: "postgres",
  port: 5432,
  password: "puja@123",
  database: "Social_media",
});
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to postgreSQL");

    const res = await client.query("SELECT NOW()");
    console.log(res.rows);
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
}
  connectDB();
  module.exports = client;