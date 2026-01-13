const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControler");
const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.get("/allRegister", authController.getAllUsers);
router.get("/GetRegister/:id", authController.getUserById);
router.put("/Updateregister/:id", authController.updateUser);
router.delete("/deleteregister/:id", authController.deleteUser);




router.post("/login", authController.login);
router.post("/logout",auth , authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
