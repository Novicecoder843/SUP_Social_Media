const express = require("express");
const router = express.Router();
const hashtagController = require("../controller/hashtagController");
const validations = require("../middleware/validate");

const {
    addHashtagSchema,
  postIdSchema,
  tagSchema
} = require("../validations/hashtagValidation");

// Add hashtags to post
router.post("/posts/:id/hashtags", validations(addHashtagSchema), hashtagController.addHashtags);

// Get hashtags of a post
router.get("/posts/:id/hashtags", validations(postIdSchema), hashtagController.getPostHashtags);

// Get posts by hashtag
router.get("/:tag/posts", validations(tagSchema), hashtagController.getPostsByHashtag);

module.exports = router;