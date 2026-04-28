const router = require("express").Router();
const authController = require("../controllers/auth.controller");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

module.exports = router;