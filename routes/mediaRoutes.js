const express = require("express");
const router = express.Router();

const mediaController = require("../controller/mediaController");
 const verifyToken = require("../middleware/authMiddleware");
const uploads = require("../middleware/upload");

router.post(
  "/media/upload",
  verifyToken,
  uploads.single("image"),
    mediaController.uploadMedia
  );

   router.get("/post/:postId", mediaController.getMediaByPost);
    
  router.delete("/:id", verifyToken, mediaController.deleteMedia);

module.exports = router;