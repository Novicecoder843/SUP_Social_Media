const notificationService = require("../services/notification.service");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await notificationService.getNotifications(userId);

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};