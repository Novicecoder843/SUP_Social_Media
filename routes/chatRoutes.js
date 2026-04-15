const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

router.post("/send", auth, chatController.sendMessage);
router.get("/conversation/:user2", auth, chatController.getConversation);
module.exports = router;