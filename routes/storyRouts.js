const express = require("express");
 const router = express.Router();

 const upload = require("../middleware/storyUploadMiddleware")
 const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/storyController");

router.post("/",auth,upload.single("media"),controller.uploadStory);


router.get("/",auth,controller.getStories);


router.post("/:id/view",auth,controller.viewStory);


router.post("/:id/like",auth,controller.likeStory);


router.post("/:id/reply",auth,controller.replyStory);


router.get("/:id/viewers",auth,controller.getStoryViewers);


router.delete("/:id",auth,controller.deleteStory);

router.get("/:id/details",auth,controller.getStoryDetails);


module.exports = router;