require('dotenv').config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const morgan = require("morgan");
const logger = require("./utils/logger");

const bodyParser = require('body-parser')
//const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const postRoutes = require("./routes/postRoutes");
const fileRoutes = require("./routes/fileRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const saveRoutes = require("./routes/saveRoutes");
const shareRoutes = require("./routes/shareRoutes");
const feedRoutes = require("./routes/feedRoutes");
const hashtagRoutes = require("./routes/hashtagRoutes");
const storyRoutes = require("./routes/storyRoutes");
// const reelRoutes = require("./routes/reelRoutes");
// const viewRoutes = require("./routes/viewRoutes");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.originalUrl);
    console.log("Request Params:", req.params);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
    console.log("User ID:", req.params.id);
    console.log("----------------------------------------------");
    next();
});

//app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/posts", shareRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/hashtag", hashtagRoutes);
app.use("/api/story", storyRoutes);
// app.use("/api/reels", reelRoutes);
// app.use("api/view", viewRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/error", (req, res) => {

    logger.error("This is a test error");

    res.status(500).json({
        success: false,
        message: "Error checked"
    });

});

const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server started at http://localhost:${PORT}`);
});

