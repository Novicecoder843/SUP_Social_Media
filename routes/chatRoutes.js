const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

// 💬 send message
router.post("/chats/", auth, chatController.sendMessage);

// 🔁 reply
router.post("/replychats/:messageId/reply", auth, chatController.replyMessage);

// ❌ delete
router.delete("/deleteChats/:messageId", auth, chatController.deleteMessage);

// 📩 get chat
router.get("/getChats/:userId", auth, chatController.getChat);

module.exports = router;