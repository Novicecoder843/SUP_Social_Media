const Share = require('../models/share.model');

// ✅ Share Post
exports.sharePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;

    await Share.sharePost(userId, postId, comment);

    res.status(200).json({
      message: "Post shared successfully"
    });

  } catch (err) {
    console.error("SHARE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get Shares
exports.getShares = async (req, res) => {
  try {
    const postId = req.params.postId;

    const data = await Share.getShares(postId);

    res.status(200).json({
      message: "Shares fetched",
      count: data.count,
      shares: data.users
    });

  } catch (err) {
    console.error("GET SHARES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};