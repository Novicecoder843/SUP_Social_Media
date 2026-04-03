const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/authMiddleWare");
const groupController = require("../controllers/groupController")



router.post("/register" ,  chatController.userRegister);

router.post("/login"  ,  chatController.loginUser);

router.post("/send", auth , chatController.sendMessage);

router.get("/conversation/:user2", auth ,chatController.getConversation);
router.post("/group", auth, groupController.createGroup);

router.put("/seen/:senderId",auth , chatController.markAsSeen);

module.exports = router;