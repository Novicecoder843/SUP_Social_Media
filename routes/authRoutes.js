const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const Validation = require("../middleware/validate");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/authValidation");

router.post("/register", Validation(registerSchema), authController.register);
router.post("/login", Validation(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/forgot-password", Validation(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", Validation(resetPasswordSchema), authController.resetPassword);

module.exports = router;