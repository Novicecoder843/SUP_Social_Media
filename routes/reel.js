const express = require("express");
const router = express.Router();

const reelController = require("../controllers/reelController");
const authMiddleware = require("../middleware/authMiddleware");
const reelUpload = require("../middleware/reelUploadMiddleware");

// CREATE REEL
router.post("/", authMiddleware, reelUpload.single("video"), reelController.createReel);

// GET ALL REELS
router.get("/", authMiddleware, reelController.getAllReels);

// GET SINGLE REEL
router.get("/:id", authMiddleware, reelController.getSingleReel);

// DELETE REEL
router.delete("/:id", authMiddleware, reelController.deleteReel);

// LIKE REEL
router.post("/:id/like", authMiddleware, reelController.likeReel);

// COMMENT REEL
router.post("/:id/comment", authMiddleware, reelController.commentReel);

// SAVE REEL
router.post("/:id/save", authMiddleware, reelController.saveReel);

// SHARE REEL
router.post("/:id/share", authMiddleware, reelController.shareReel);

// VIEW COUNT
router.post("/:id/view", authMiddleware, reelController.addView);

module.exports = router;