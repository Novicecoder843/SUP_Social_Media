require("dotenv").config();
const express = require("express");
require("./config/db");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const userProfileRoutes = require("./routes/userprofile.routes");
const userFollowRoutes = require("./routes/userfollow.routes");
const postRoutes = require("./routes/post.routes");
const postExtraRoutes = require("./routes/postExtra.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/users", userFollowRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post-extra", postExtraRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});