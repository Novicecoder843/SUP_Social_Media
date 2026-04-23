const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");



router.post("/send", auth, chatController.sendMessage);
router.post("/group", auth, chatController.createGroup);
router.get("/group/:groupId",chatController.getGroupMessages);
router.get("/conversation/:receiver_id", auth, chatController.getConversation);
router.delete("/message/:id" , auth , chatController.deleteMessage);
module.exports = router;