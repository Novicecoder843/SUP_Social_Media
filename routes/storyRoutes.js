const express = require("express");
const router = express.Router();

const storyController = require("../controller/storyController");

const verifyToken = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadS3");

const Validation = require("../middleware/validate");

const {
  createStorySchema,
  feedStoriesSchema,
  userStoriesSchema,
  storyIdSchema,

  addReactionSchema,
  getReactionSchema,

  addReplySchema,
  getRepliesSchema,

   createHighlightSchema,
  addStoryToHighlightSchema,
  removeStoryFromHighlightSchema,
  highlightIdSchema,

  userIdSchema,

  friendIdSchema,
} = require("../validations/storyValidation");
// CREATE STORY
router.post( "/", verifyToken, upload.single("media"), Validation(createStorySchema), storyController.createStory);
// FEED
router.get("/feed", verifyToken, Validation(feedStoriesSchema), storyController.getFeedStories);
// USER STORIES
router.get("/user/:userId", verifyToken, Validation(userIdSchema), storyController.getUserStories);
// ADD CLOSE FRIEND
router.post("/close-friends/:friendId", verifyToken, Validation(friendIdSchema), storyController.addCloseFriend);

router.delete("/close-friends/:friendId", verifyToken, Validation(friendIdSchema), storyController.removeCloseFriend);

router.get("/close-friends", verifyToken, storyController.getCloseFriends);
/* ----------------------Highlights---------------- */
router.post("/highlights", verifyToken, Validation(createHighlightSchema), storyController.createHighlight);

router.get("/highlights/user/:userId", verifyToken, Validation(userIdSchema), storyController.getUserHighlights);

router.post("/highlights/:highlightId/add-story", verifyToken, Validation(addStoryToHighlightSchema), 
   storyController.addStoryToHighlight);

router.delete("/highlights/:highlightId/story/:storyId", verifyToken, Validation(removeStoryFromHighlightSchema),
   storyController.removeStoryFromHighlight);

router.delete("/highlights/:highlightId", verifyToken, Validation(highlightIdSchema), storyController.deleteHighlight);
// VIEW
router.post("/:storyId/view", verifyToken, Validation(storyIdSchema), storyController.viewStory);

router.get("/:storyId/views", verifyToken, Validation(storyIdSchema), storyController.getStoryViews);
// RECTIONS
router.post("/:storyId/reaction", verifyToken, Validation(addReactionSchema), storyController.addReaction);

router.get("/:storyId/reactions", verifyToken, Validation(getReactionSchema), storyController.getStoryReactions);

router.delete("/:storyId/reaction", verifyToken, Validation(storyIdSchema), storyController.deleteReaction);
// REPLIES
router.post("/:storyId/reply", verifyToken, Validation(addReplySchema), storyController.addReply);

router.get("/:storyId/replies", verifyToken, Validation(getRepliesSchema), storyController.getStoryReplies);

router.delete("/reply/:replyId", verifyToken, storyController.deleteReply);
// STORY
router.delete("/:storyId", verifyToken, Validation(storyIdSchema), storyController.deleteStory);

router.get("/:storyId", verifyToken, Validation(storyIdSchema), storyController.getStoryDetails);

module.exports = router;