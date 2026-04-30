 require("dotenv").config();
 const express = require("express");
 const path = require("path");

 const bodyParser = require('body-parser')
 //const pool = require("./config/db");
 const userRoutes = require("./routes/userRoutes")
 const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const fileRoutes = require("./routes/fileRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const saveRoutes = require("./routes/saveRoutes");
const shareRoutes = require("./routes/shareRoutes");
const feedRoutes = require("./routes/feedRoutes");
const hashtagRoutes = require("./routes/hashtagRoutes");

const app = express();
 app.use(express.json());

  app.use((req, res, next) => {
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.originalUrl);
    console.log("Request params:", req.params);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
    console.log("-------------------------------------------");
    next();
});

//app.use(bodyParser.json());

app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/posts", shareRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/hashtag", hashtagRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = 3000;

 app.listen(PORT, () => {
     console.log(`Server started at http://localhost:${PORT}`);
 });

