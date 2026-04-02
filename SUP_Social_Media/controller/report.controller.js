const Report = require('../models/report.model');

exports.reportPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: "Reason is required"
      });
    }

    await Report.reportPost(userId, postId, reason);

    res.json({
      message: "Post reported successfully"
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};