const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
 
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;

