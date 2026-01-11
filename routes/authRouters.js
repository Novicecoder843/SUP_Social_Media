const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControler");
// const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
