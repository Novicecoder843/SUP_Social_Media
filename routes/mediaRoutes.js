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

/**
 * @swagger
 * /media/media/upload:
 *   post:
 *     summary: Upload media
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               post_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/media/upload",
  verifyToken,
  uploads.single("image"), Validation(uploadMediaSchema),
  mediaController.uploadMedia
);
/**
 * @swagger
 * /media/post/{postId}:
 *   get:
 *     summary: Get media by post ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media fetched successfully
 *       404:
 *         description: Media not found
 */

router.get("/post/:postId", Validation(postIdSchema), mediaController.getMediaByPost);
/**
 * @swagger
 * /media/{id}:
 *   delete:
 *     summary: Delete media
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Media not found
 */
router.delete("/:id", verifyToken, Validation(mediaIdSchema), mediaController.deleteMedia);

module.exports = router;