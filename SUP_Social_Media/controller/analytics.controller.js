const Analytics = require('../models/analytics.model');

exports.getPostAnalytics = async (req, res) => {
  try {
    const postId = req.params.postId;

    const data = await Analytics.getPostAnalytics(postId);

    res.json({
      message: "Post analytics",
      data
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};