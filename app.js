const express = require("express");
require("dotenv").config();
const http = require("http");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use("/api", routes);
//create http server
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
global.io = io;
const onlineUsers = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
});
socket.on("disconnect", () => {
  for(let userid in onlineUsers) {
    if(onlineUsers[userid] === socket.id) {
      delete onlineUsers[userid];
      break;
     }
    }
  });
});
global.onlineUsers = onlineUsers;

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});

 