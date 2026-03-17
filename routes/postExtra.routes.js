const express = require("express");

const router = express.Router();

const controller = require("../controller/postExtra.controller");


/* HASHTAGS */

router.get("/hashtag/:tag", controller.getPostsByHashtag);


/* POST HASHTAGS */

router.get("/post/:post_id/hashtags", controller.getPostHashtags);


/* POST MENTIONS */

router.get("/post/:post_id/mentions", controller.getPostMentions);


/* COMMENT LIKE */

router.post("/comment-like", controller.likeComment);


module.exports = router;