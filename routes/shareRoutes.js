const express = require("express");
const router = express.Router();

const shareController = require("../controller/shareController");
const verifyToken = require("../middleware/authMiddleware");

// Share a post
router.post("/posts/:id/share", verifyToken, shareController.sharePost);

// Get all shared posts for logged-in user
router.get("/shared-posts", verifyToken, shareController.getShares);

module.exports = router;