require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");
const likeRoutes = require("./routes/like");
const commentRoutes = require("./routes/comment");
const shareRoutes = require("./routes/share");
const saveRoutes = require("./routes/save");
const reelRoutes = require("./routes/reel");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads Folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/posts", shareRoutes);
app.use("/api/posts", saveRoutes);
app.use("/api/reels", reelRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Social Media Backend Running");
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});