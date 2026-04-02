const Saved = require('../models/saved.model');

// ✅ Save Post
exports.savePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await Saved.savePost(userId, postId);

    res.status(200).json({
      message: "Post saved successfully"
    });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Unsave Post
exports.unsavePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await Saved.unsavePost(userId, postId);

    res.status(200).json({
      message: "Post unsaved successfully"
    });

  } catch (err) {
    console.error("UNSAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get Saved Posts
exports.getMySavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Saved.getSavedPosts(userId);

    res.status(200).json({
      message: "Saved posts fetched",
      count: posts.length,
      posts
    });

  } catch (err) {
    console.error("GET SAVED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};