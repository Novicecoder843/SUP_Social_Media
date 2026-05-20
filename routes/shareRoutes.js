const express = require("express");
const router = express.Router();

const shareController = require("../controller/shareController");
const  verifyToken  = require("../middleware/authMiddleware");
const validations = require("../middleware/validate");

const {
    sharePostSchema
} = require("../validations/shareValidation");

// share post
router.post("/:id/share", verifyToken, validations(sharePostSchema), shareController.sharePost);

module.exports = router; 