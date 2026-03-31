
const router = require("express").Router();
const authController = require("../controllers/auth.controller");

const { validate } = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../validators/auth.validation");
router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", validate(refreshSchema), authController.refresh);

router.post("/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post("/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);
router.get("/verify-email", authController.verifyEmail);

module.exports = router;