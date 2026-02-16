require("dotenv").config();
const express = require("express");
require("./config/db");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes"); // <-- Add auth routes

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Routes
app.use("/api/users", userRoutes); // User-related CRUD routes
app.use("/api/auth", authRoutes);  // Auth routes (register, login, etc.)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
