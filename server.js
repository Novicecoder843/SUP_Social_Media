require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const roleRoutes = require("./routes/roleRouts");
const authRouter =  require("./routes/authRouters");
const hastagRouter =  require("./routes/hastagRouter");
const chatRouter = require("./routes/chatRoutes")
const { setSocket } = require("./config/socket");

const app = express();
app.use(express.json());

app.use(bodyParser.json());


const server = http.createServer(app);

// init socket
const io = setSocket(server);

// attach socket events
require("./utlis/chatSoket")(io);


// app.use("/api/users", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRouter );
app.use("/api/hashtags", hastagRouter );
app.use("/api/chats", chatRouter );
app.use("/uploads", express.static("uploads"));


app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000 ");
});
