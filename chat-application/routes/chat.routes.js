const router = require("express").Router();
const auth = require("../middleware/auth");
const chatController = require("../controllers/chat.controller");

// 💬 Send
router.post("/", auth, chatController.sendMessage);

// 🔁 Reply
router.post("/:messageId/reply", auth, chatController.replyMessage);

// ✅ Conversation (PUT THIS BEFORE :userId)
router.get("/conversation/:user1/:user2", auth, chatController.getConversation);

// ❌ Delete
router.delete("/:messageId", auth, chatController.deleteMessage);

// 📩 Get chat (KEEP THIS LAST)
router.get("/:userId", auth, chatController.getChat);

router.put("/delivered/:senderId", auth, chatController.markDelivered);
router.put("/seen/:senderId", auth, chatController.markSeen);

module.exports = router;