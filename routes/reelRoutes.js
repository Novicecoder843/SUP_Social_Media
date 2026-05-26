const express = require("express");
const router = express.Router();

const reelController = require("../controller/reelController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// const likeController = require("../controller/likeController");
// const auth = require("../middleware/authMiddleware");

// CREATE REEL
router.post(
  "/",
  verifyToken,
  upload.single("video"),
  reelController.createReel
);

// GET ALL REELS
router.get("/", reelController.getReels);

// GET SINGLE REEL
router.get("/:id", reelController.getReelById);

// UPDATE REEL
router.put(
  "/:id",
  verifyToken,
  upload.single("video"),
  reelController.updateReel
);

// DELETE REEL
router.delete("/:id", verifyToken, reelController.deleteReel);

//LIKE REEL
router.post("/:id/like", verifyToken, reelController.likeReel);

//UNLIKE REEL
router.delete("/:id/like", verifyToken, reelController.unlikeReel);

// ADD COMMENT
router.post(
  "/:id/comments",
  verifyToken,
  reelController.addComment
);

// GET COMMENTS
router.get(
  "/:id/comments",
  reelController.getComments
);

// REPLY COMMENT
router.post(
  "/comments/:id/reply",
  verifyToken,
  reelController.replyComment
);

// DELETE COMMENT
router.delete(
  "/comments/:id",
  verifyToken,
  reelController.deleteComment
);

// GET REPLIES
router.get(
  "/comments/:id/replies",
  reelController.getReplies
);

// SAVE REEL
router.post(
  "/:id/save",
  verifyToken,
  reelController.saveReel
);

// UNSAVE REEL
router.delete(
  "/:id/save",
  verifyToken,
  reelController.unSaveReel
);

// GET ALL SAVED REELS
router.get(
  "/saved/all",
  verifyToken,
  reelController.getSavedReels
);

// SHARE REEL
router.post(
  "/:id/share",
  verifyToken,
  reelController.shareReel
);

// GET SENT SHARES
router.get(
  "/shares/sent",
  verifyToken,
  reelController.getSentShares
);

// GET RECEIVED SHARES
router.get(
  "/shares/received",
  verifyToken,
  reelController.getReceivedShares
);

// DELETE SHARE
router.delete(
  "/shares/:share_id",
  verifyToken,
  reelController.deleteSharedReel
);

// SHARE COUNT
router.get(
  "/:id/share-count",
  reelController.getShareCount
);

// ADD VIEW
router.post(
  "/:id/view",
  reelController.addView
);

// GET VIEW COUNT
router.get(
  "/:id/view-count",
  reelController.getViewCount
);

// ADD HASHTAG TO REEL
router.post(
  "/:id/hashtags",
  verifyToken,
  reelController.addHashtagToReel
);

// GET REEL HASHTAGS
router.get(
  "/:id/hashtags",
  reelController.getReelHashtags
);

// REMOVE HASHTAG FROM REEL
router.delete(
  "/:id/hashtags/:hashtag_id",
  verifyToken,
  reelController.removeHashtagFromReel
);

//getReelAudio
router.get(
  "/:id/audio",
  reelController.getReelAudio
);

//UPDATEREEL
router.put(
  "/:id",
  verifyToken,
  upload.single("video"),
  reelController.updateReel
);

module.exports = router;