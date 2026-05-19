require("dotenv").config();
require("./cron/storyCleanup");
const cors = require("cors");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const roleRoutes = require("./routes/roleRouts");
const authRouter =  require("./routes/authRouters");
const hastagRouter =  require("./routes/hastagRouter");
const chatRouter = require("./routes/chatRoutes")
const chatSocket  = require("./utlis/chatSoket");
const storyRoutes =require("./routes/storyRouts");
const reelRoutes = require("./routes/reelRouts");

const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());


app.use(express.static("fronted"));

const server = http.createServer(app);

// ✅ socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// ✅ attach socket logic (ONLY ONE PLACE)
const onlineUsers = chatSocket(io);


// ✅ make available in controllers
app.set("onlineUsers", onlineUsers);
app.set("io", io);




// app.use("/api/users", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRouter );
app.use("/api/hashtags", hastagRouter );
app.use("/api/chats", chatRouter );
app.use("/api/stories",storyRoutes);
app.use("/api/reels",reelRoutes);

// app.use("/uploads", express.static("uploads"));
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

server.listen(3000, () => {
  console.log("Server running on port http://localhost:3000 ");
});
