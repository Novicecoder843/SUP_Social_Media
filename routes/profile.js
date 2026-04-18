const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../uploads/upload");

// Create profile
router.post("/", authMiddleware, upload.single("profile_image"), profileController.createProfile);

// Get profile
router.get("/", authMiddleware, profileController.getProfile);

// Update profile
router.put("/", upload.single("profile_image"),   authMiddleware, profileController.updateProfile);

module.exports = router;