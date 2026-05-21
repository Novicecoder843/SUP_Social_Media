const express = require("express");
const router = express.Router();

const feedController = require("../controller/feedController");
const verifyToken = require("../middleware/authMiddleware");

// get feed
router.get("/feed", verifyToken, feedController.getFeed);

module.exports = router;