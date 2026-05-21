const express = require("express");
const router = express.Router();

const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/authMiddleware");
const validations = require("../middleware/validate");

const {
  addCommentSchema,
  addReplySchema,
  updateCommentIdSchema,
  commentIdSchema
} = require("../validations/commentValidation");

// ADD COMMENT
router.post(
  "/posts/:postId/comments",
  verifyToken,
  validations(addCommentSchema),
  commentController.addComment
);

// ADD REPLY
router.post(
  "/reply",
  verifyToken,
  validations(addReplySchema),
  commentController.addReply
);

// GET COMMENTS
router.get(
  "/posts/:postId/comments",
  commentController.getComments
);

// UPDATE COMMENT
router.put(
  "/:commentId",
  verifyToken,
  validations(updateCommentIdSchema),
  commentController.updateComment
);

// DELETE COMMENT
router.delete(
  "/:id",
  verifyToken,
  commentController.deleteComment
);

module.exports = router;