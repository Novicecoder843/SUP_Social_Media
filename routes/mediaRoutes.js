const express = require("express");
const router = express.Router();

const mediaController = require("../controller/mediaController");
const verifyToken = require("../middleware/authMiddleware");
const uploads = require("../middleware/uploadS3");
const Validation = require("../middleware/validate");

const {
  uploadMediaSchema,
  postIdSchema,
  mediaIdSchema
} = require("../validations/mediaValidation");

router.post(
  "/media/upload",
  verifyToken,
  uploads.single("image"), Validation(uploadMediaSchema),
  mediaController.uploadMedia
);

router.get("/post/:postId", Validation(postIdSchema), mediaController.getMediaByPost);

router.delete("/:id", verifyToken, Validation(mediaIdSchema), mediaController.deleteMedia);

module.exports = router;