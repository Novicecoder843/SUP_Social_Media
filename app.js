require("dotenv").config();
const express = require("express");
const pool = require("./config/db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    data: [],
    success: true,
    message: "server is running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
