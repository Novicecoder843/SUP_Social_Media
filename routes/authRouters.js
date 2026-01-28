const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControler");
const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.get("/allRegister", authController.getAllUsers);
router.get("/GetRegister/:id", authController.getUserById);
router.put("/Updateregister/:id", authController.updateUser);
router.delete("/deleteregister/:id", authController.deleteUser);



router.post("/verify-login-otp", authController.verifyLoginOtp);
router.post("/login", authController.login);
router.post("/logout",auth , authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


router.get("/me",auth, authController.getMe);
router.put("/updateme",auth, authController.updateMe);

router.get("/:id",auth, authController.getUserById);

router.post("/follow/:id",auth, authController.follow);
router.post("/unfollow/:id",auth, authController.unfollow);
router.post("/block/:id",auth, authController.block);


module.exports = router;


