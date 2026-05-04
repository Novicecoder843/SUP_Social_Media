require("dotenv").config();
const express = require("express");
const http = require("http");
const { setSocket } = require("./config/socket");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chats", require("./routes/chat.routes"));

// test route
app.get("/", (req, res) => {
  res.send("Chat API running 🚀");
});

/////////////////////////////////////////////////////
// 🔥 CREATE HTTP SERVER (IMPORTANT)
/////////////////////////////////////////////////////
const server = http.createServer(app);

/////////////////////////////////////////////////////
// 🔌 INIT SOCKET.IO
/////////////////////////////////////////////////////
setSocket(server);

/////////////////////////////////////////////////////
// 🚀 START SERVER
/////////////////////////////////////////////////////
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});