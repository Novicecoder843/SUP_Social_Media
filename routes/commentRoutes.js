const express = require("express");
const router = express.Router();

const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/authMiddleware");

// add comment
router.post("/posts/:id/comment", verifyToken, commentController.addComment);

// add reply
router.post("/reply", verifyToken, commentController.addReply);

// get comments
router.get("/posts/:id/comments", commentController.getComments);

//update Comment
router.put("/:commentId", verifyToken, commentController.updateComment);

// delete comment
router.delete("/comments/:id", verifyToken, commentController.deleteComment);

module.exports = router;