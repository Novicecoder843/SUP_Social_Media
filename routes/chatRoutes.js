const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");
const chatUploadmiddle = require("../middleware/chatUploadMiddleware")


router.post("/send", auth, chatController.sendMessage);
router.post("/group", auth, chatController.createGroup);
router.get("/group/:groupId", chatController.getGroupMessages);
router.post("/upload", auth, chatUploadmiddle.single("media"), (req, res) => {

    res.json({
        success: true,
        file: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });
});
router.get("/conversation/:receiver_id", auth, chatController.getConversation);
router.delete("/message/:id", auth, chatController.deleteMessage);
module.exports = router;
