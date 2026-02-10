require("dotenv").config();
const express = require("express");
require("./config/db");

const userRoutes = require("../SUP_Social_Media/routes/user.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "server is running" });
});

app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
