const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.get("/me", authMiddleware, userController.getMe);

module.exports = router;


