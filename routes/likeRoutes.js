const express = require("express");
const router = express.Router();

const likeController = require("../controller/likeController");
const verifyToken = require("../middleware/authMiddleware");

// like post
router.post("/posts/:id/like", verifyToken, likeController.likePost);

// unlike post
router.delete("/posts/:id/like", verifyToken, likeController.unlikePost);

//  like count
router.get("/posts/:postId", verifyToken, likeController.getLikesCount);

module.exports = router;