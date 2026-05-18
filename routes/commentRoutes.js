const express = require("express");
const router = express.Router();

const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/authMiddleware");
const validations = require("../middleware/validate");

const {
    addCommentSchema,
  addReplySchema,
  updateCommentSchema,
  postIdSchema,
  commentIdSchema,
  updateCommentIdSchema
} = require("../validations/commentValidation");

// add comment
router.post("/posts/:id/comment", verifyToken, validations(addCommentSchema), commentController.addComment);

// add reply
router.post("/reply", verifyToken, validations(addReplySchema), commentController.addReply);

// get comments
router.get("/posts/:postId/comments", commentController.getComments);

//update comment
router.put("/:commentId", verifyToken, validations(updateCommentIdSchema), commentController.updateComment);

// delete comment
router.delete("/comments/:id", verifyToken, commentController.deleteComment);

module.exports = router;