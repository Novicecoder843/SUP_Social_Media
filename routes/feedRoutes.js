const express = require("express");
const router = express.Router();

const feedController = require("../controller/feedController");
const verifyToken = require("../middleware/authMiddleware");

// GET feed
router.get("/feed", verifyToken, feedController.getFeed);

//  ADD THIS (VERY IMPORTANT)
router.post("/", verifyToken, feedController.createFeed);

module.exports = router;