const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL CONVERSATIONS
router.get(
  "/",
  authMiddleware,
  chatController.getConversations
);

// GET CHAT HISTORY
router.get(
  "/:userId",
  authMiddleware,
  chatController.getChats
);

module.exports = router;