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


router.put("/delivered/:senderId", auth, chatController.markDelivered);
// seen
router.put("/seen/:senderId", auth, chatController.markSeen);

module.exports = router;

