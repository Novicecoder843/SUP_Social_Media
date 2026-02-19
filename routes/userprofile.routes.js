const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const userController = require("../controller/userprofile.controller");

// CREATE MY PROFILE
router.post("/me", verifyToken, userController.createMyProfile);

// GET MY PROFILE
router.get("/me", verifyToken, userController.getMyProfile);

// UPDATE MY PROFILE
router.put("/me", verifyToken, userController.updateMyProfile);

// GET USER BY ID
router.get("/:id", userController.getUserById);

module.exports = router;
