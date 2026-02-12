require("dotenv").config();
const express = require("express");
require("./config/db");

const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ✅ Correct route prefix
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
