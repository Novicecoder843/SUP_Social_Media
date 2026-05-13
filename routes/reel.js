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

//UNLIKE REEL
router.delete("/:id/unlike",authMiddleware, reelController.unlikeReel);

//GET LIKE COUNT
router.get("/:id/likes", reelController.getLikeCount);

// COMMENT REEL
router.post("/:id/comment", authMiddleware, reelController.commentReel);

//GET COMMENT COUNT
router.get("/:id/comments", reelController.getCommentCount);

// SAVE REEL
router.post("/:id/save", authMiddleware, reelController.saveReel);

//UNSAVE REEL
router.delete("/:id/unsave", authMiddleware, reelController.unsaveReel);

// SHARE REEL
router.post("/:id/share", authMiddleware, reelController.shareReel);

//GET SHARE COUNT
router.get("/:id/shares", reelController.getShareCount);

// VIEW COUNT
router.post("/:id/view", authMiddleware, reelController.addView);

module.exports = router;