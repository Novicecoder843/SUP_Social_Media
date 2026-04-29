const router = require("express").Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notification.controller");

// GET all notifications
router.get("/", authMiddleware, notificationController.getNotifications);

module.exports = router;