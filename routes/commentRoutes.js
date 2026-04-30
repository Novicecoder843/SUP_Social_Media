const express = require("express");
const router = express.Router();

const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/authMiddleware");

// add comment
router.post("/posts/:id/comment", verifyToken, commentController.addComment);

// get comments
router.get("/posts/:id/comments", commentController.getComments);

// delete comment
router.delete("/comments/:id", verifyToken, commentController.deleteComment);

//update Comment
router.put("/:commentId", verifyToken, commentController.updateComment);

module.exports = router;