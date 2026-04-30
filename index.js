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

// ✅ parse JSON
app.use(express.json());

// ✅ FIXED LOGGER (no undefined body)
app.use((req, res, next) => {
  console.log("\n===============================");
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);

  if (Object.keys(req.params).length > 0) {
    console.log("Params:", req.params);
  }

  if (Object.keys(req.query).length > 0) {
    console.log("Query:", req.query);
  }

  // ✅ only print body if exists
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }

  console.log("===============================");
  next();
});

// ✅ routes
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/hashtag",hashtagRoutes);

// ✅ static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});