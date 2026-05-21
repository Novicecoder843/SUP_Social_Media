require("dotenv").config();
const express = require("express");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const commentRoutes = require("./routes/commentRoutes");
const feedRoutes = require("./routes/feedRoutes");
const likeRoutes = require("./routes/likeRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const postRoutes = require("./routes/postRoutes");
const saveRoutes = require("./routes/saveRoutes");
const shareRoutes = require("./routes/shareRoutes");
const hashtagRoutes = require("./routes/hashtagRoutes");

const app = express();

// BODY PARSER
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// LOGGER
app.use((req, res, next) => {
  console.log("\n===============================");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);

  if (Object.keys(req.params).length > 0) {
    console.log("Params:", req.params);
  }

  if (Object.keys(req.query).length > 0) {
    console.log("Query:", req.query);
  }

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }

  console.log("===============================");
  next();
});

// ROUTES
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/media", mediaRoutes);

// ✅ FIXED HERE (IMPORTANT)
app.use("/api/likes", likeRoutes);

app.use("/api/comment", commentRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/hashtag", hashtagRoutes);

// STATIC FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  if (err.message.includes("Only Image & Video")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Something went wrong" });
});

// SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});