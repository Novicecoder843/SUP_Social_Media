const router = require("express").Router();
const auth = require("../middleware/auth");
const chatController = require("../controllers/chat.controller");

// 💬 Send
router.post("/", auth, chatController.sendMessage);

// 🔁 Reply
router.post("/:messageId/reply", auth, chatController.replyMessage);

// ❌ Delete
router.delete("/:messageId", auth, chatController.deleteMessage);

// 📩 Get chat
router.get("/:userId", auth, chatController.getChat);

module.exports = router;