require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");
const likeRoutes = require("./routes/like");
const commentRoutes = require("./routes/comment");
const shareRoutes = require("./routes/share");
const saveRoutes = require("./routes/save");
const reelRoutes = require("./routes/reel");
const chatRoutes = require("./routes/chat");

const app = express();

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// IMPORT SOCKET FILE
require("./sockets/chatSocket")(io);

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE PUBLIC FOLDER
app.use(express.static("public"));

// SERVE UPLOADS
app.use("/uploads", express.static("uploads"));



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/posts", shareRoutes);
app.use("/api/posts", saveRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/chats", chatRoutes);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});