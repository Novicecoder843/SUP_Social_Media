const express = require("express");
const router = express.Router();
const hashtagController = require("../controller/hashtagController");

// Add hashtags to post
router.post("/posts/:id/hashtags", hashtagController.addHashtags);

// Get hashtags of a post
router.get("/posts/:id/hashtags", hashtagController.getPostHashtags);

// Get posts by hashtag
router.get("/:tag/posts", hashtagController.getPostsByHashtag);

module.exports = router;