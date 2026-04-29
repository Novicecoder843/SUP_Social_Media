const express = require("express");
const router = express.Router();

const shareController = require("../controller/shareController");
const verifyToken = require("../middleware/authMiddleware");

// share post
router.post("/:id/share", verifyToken, shareController.sharePost);

module.exports = router;