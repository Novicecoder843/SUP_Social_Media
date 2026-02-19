const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const userFollowController = require("../controller/userfollow.controller");

// FOLLOW USER
router.post("/follow/:id", verifyToken, userFollowController.follow);

// UNFOLLOW USER
router.post("/unfollow/:id", verifyToken, userFollowController.unfollow);

// BLOCK USER
router.post("/block/:id", verifyToken, userFollowController.block);

module.exports = router;
