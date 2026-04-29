const express = require("express");
const router = express.Router();

const mediaController = require("../controller/mediaController");
 const verifyToken = require("../middleware/authMiddleware");
const uploads = require("../middleware/uploadS3");

router.post(
  "/media/upload",
  verifyToken,
  uploads.single("image"),
  mediaController.uploadMedia
);

module.exports = router;