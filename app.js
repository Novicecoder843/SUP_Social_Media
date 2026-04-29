const express = require("express");
require("dotenv").config();
const http = require("http");

const routes = require("./routes");
const postRoutes = require("./routes/user.routes");
const storyRoutes = require("./routes/user.routes");
const app = express();
app.use(express.json());
app.use("/api", routes);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
const { initSocket } = require("./sockets/socket");
// init socket
initSocket(server);

global.io = io;

const onlineUsers = {};
io.on("connection", (socket) => {
  console.log("user connected", socket.id );
  socket.on("join", (userId) => {
    socket.join(userId);
    onlineUsers[userId] = socket.id;
  });
  socket.on("send_message", (data) => {
    io.to(data.receiverId).emit("receive_message", data);
  });
});
global.onlineUsers = onlineUsers;
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});

 