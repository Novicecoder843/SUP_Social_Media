const { Client } = require("pg");
const client = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "puchu",
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