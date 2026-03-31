require('dotenv').config();
const express = require("express");

const bodyParser = require('body-parser')
//const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const postRoutes = require("./routes/postRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.originalUrl);
    console.log("Request Params:", req.params);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
    console.log("----------------------------------------------");
    next();
});

//app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

