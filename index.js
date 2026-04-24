require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploads
app.use("/uploads", express.static("uploads"));

// Auth Routes
app.use("/api/auth", authRoutes);

// Users Routes
app.use("/api/users", userRoutes);

// Profile Routes
app.use("/api/profile", profileRoutes);   

// POST Routes
app.use("/api/posts", postRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Social Media Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});