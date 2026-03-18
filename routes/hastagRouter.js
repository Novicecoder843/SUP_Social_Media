const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");


const hashtagController = require("../controllers/hastagsControl");


router.post("/create", auth,hashtagController.createPost);
// router.get("/find/", hashtagController.searchHashtags); 
router.get("/trending", hashtagController.getTrendingHashtags);

// get posts by hashtag
router.get("/:tag/posts", hashtagController.getPostsByHashtags);






module.exports = router;