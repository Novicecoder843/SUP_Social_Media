const express = require("express");
const router = express.Router();

const likeController = require("../controller/likeController");
const verifyToken = require("../middleware/authMiddleware");
const validations = require("../middleware/validate");

const {
    postIdSchema,
    likesCountSchema
} = require("../validations/likeValidation");

// like post
router.post("/posts/:id/like", verifyToken, validations(postIdSchema), likeController.likePost);

// unlike post
router.delete("/posts/:id/like", verifyToken, validations(postIdSchema), likeController.unlikePost);

//  like count
router.get("/posts/:postId", verifyToken, validations(likesCountSchema), likeController.getLikesCount);

module.exports = router;