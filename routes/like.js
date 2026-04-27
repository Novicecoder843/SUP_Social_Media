const express = require("express");
const router = express.Router();

const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

// LIKE
router.post("/:postId/like", authMiddleware, likeController.likePost);

// UNLIKE
router.delete("/:postId/unlike", authMiddleware, likeController.unlikePost);

// COUNT
router.get("/:postId/likes", authMiddleware, likeController.getLikeCount);

// USERS
router.get("/:postId/likes/users", authMiddleware, likeController.getLikedUsers);

module.exports = router;