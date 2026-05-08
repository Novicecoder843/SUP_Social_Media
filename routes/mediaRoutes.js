const express = require("express");
const router = express.Router();

const mediaController = require("../controller/mediaController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// ✅ SINGLE upload
router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  mediaController.uploadMedia
);

// ✅ MULTIPLE upload
router.post(
  "/upload-multiple",
  verifyToken,
  upload.array("media", 5),
  mediaController.uploadMultipleMedia
);

// ✅ GET media by post
router.get("/post/:postId", mediaController.getMediaByPost);

// ✅ DELETE media
router.delete("/:id", verifyToken, mediaController.deleteMedia);

module.exports = router;