const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/send", authMiddleware, chatController.send);

module.exports = router;