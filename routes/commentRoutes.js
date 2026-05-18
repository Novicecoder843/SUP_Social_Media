const express = require("express");
const router = express.Router();

const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/authMiddleware");
const Validations = require("../middleware/validate");

const {
    addCommentSchema,
    addReplySchema,
    updateCommentIdSchema,
    postIdSchema,
    commentIdSchema,
    updateCommentSchema
} = require("../validations/commentValidation");

// add comment
router.post("/posts/:id/comment", verifyToken, Validations(addCommentSchema), commentController.addComment);

// add reply
router.post("/reply", verifyToken, Validations(addReplySchema), commentController.addReply);

// get comments
router.get("/posts/:id/comments", commentController.getComments);

//update Comment
router.put("/:commentId", verifyToken, Validations(updateCommentIdSchema), commentController.updateComment);

// delete comment
router.delete("/comments/:id", verifyToken, Validations(postIdSchema), commentController.deleteComment);

module.exports = router;