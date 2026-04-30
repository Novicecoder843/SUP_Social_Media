const express = require("express");
const router = express.Router();

const mediaController = require("../controller/mediaController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// Upload route
router.post("/media/upload",verifyToken,
upload.single("image"), mediaController. uploadMedia
);

router.get("/posts/:postId", mediaController.getMediaByPost);

router.delete("/:id", verifyToken, mediaController.deleteMedia);

module.exports = router;


