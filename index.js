const express = require("express");
const client = require("./config/db");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Sever is running fine");
});

app.get("/db", async (req, res) => {
    try {
        const result = await
        client.query("SELECT NOW()");
        res.json({
            message: "Database connected successfully",
            time: result.rows[0]
        }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log('Server started at http://localhost:${PORT}');
});