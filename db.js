const { Client } = require("pg");
const client = new Client ({
    host : process.env.DB_HOST,
    user: "postgres",
    port : 5432,
    password: "lagna@123",
    database : "Social_media",
});
async function connectedDB(){
    try{
        await client.connect();
        console.log("connected to postgrsql");

        const res = await client.quiery("SELECT NOW()");
        console.log(res.rows);
    } catch (error) {
        console.error("DB connection error:", error.message);
    }
}
connectedDB();
module.export = client;