const express = require("express");
const router = express.Router();

const shareController = require("../controllers/shareController");
const authMiddleware = require("../middleware/authMiddleware");

// SHARE
router.post("/:postId/share", authMiddleware, shareController.sharePost);

// UNSHARE
router.delete("/:postId/unshare", authMiddleware, shareController.unsharePost);

// COUNT
router.get("/:postId/shares/count", authMiddleware, shareController.getShareCount);

// USERS
router.get("/:postId/shares", authMiddleware, shareController.getSharedUsers);

module.exports = router;