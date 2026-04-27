const likeModel = require("../service/likeModel");

// LIKE
const likePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.postId;

    const like = await likeModel.likePost(user_id, post_id);

    res.json({
      message: "Post liked",
      like
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Already liked"
      });
    }

    res.status(500).json({ error: error.message });
  }
};

// UNLIKE
const unlikePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.postId;

    await likeModel.unlikePost(user_id, post_id);

    res.json({
      message: "Post unliked"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// COUNT
const getLikeCount = async (req, res) => {
  try {
    const post_id = req.params.postId;

    const count = await likeModel.getLikeCount(post_id);

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// USERS
const getLikedUsers = async (req, res) => {
  try {
    const post_id = req.params.postId;

    const users = await likeModel.getLikedUsers(post_id);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikeCount,
  getLikedUsers
};