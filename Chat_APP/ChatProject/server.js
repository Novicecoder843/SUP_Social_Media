

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const chatRoutes = require("./routes/chatRouts");
const chatSocket = require("./sockets/chatSocket");




const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Debug socket connection
io.on("connection", (socket) => {
  console.log("⚡ Socket Connected:", socket.id);
}); 

const onlineUsers = chatSocket(io);


app.set("onlineUsers", onlineUsers); 
app.set("io", io);


app.use("/api/chat", chatRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});


const PORT = process.env.PORT || 3001;


server.listen(PORT , () => {
  console.log("🚀 Server running on 3001");
});