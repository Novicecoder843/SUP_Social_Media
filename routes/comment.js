const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// ADD COMMENT
router.post("/:postId/comments", authMiddleware, commentController.addComment);

// GET COMMENTS
router.get("/:postId/comments", authMiddleware, commentController.getComments);

// COUNT COMMENTS
router.get("/:postId/comments/count", authMiddleware, commentController.getCommentCount);

// DELETE COMMENT
router.delete("/comment/:commentId", authMiddleware, commentController.deleteComment);

// EDIT COMMENT
router.put("/comment/:commentId", authMiddleware, commentController.updateComment);

// LIKE COMMENT
router.post("/comment/:commentId/like", authMiddleware, commentController.likeComment);

// UNLIKE COMMENT
router.delete("/comment/:commentId/unlike", authMiddleware, commentController.unlikeComment);

module.exports = router;