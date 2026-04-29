const saveModel = require("../service/saveModel");

// SAVE
const savePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.postId;

  await saveModel.savePost(user_id, post_id);

  res.json({ message: "Post saved" });
};

// UNSAVE
const unsavePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.postId;

  await saveModel.unsavePost(user_id, post_id);

  res.json({ message: "Post unsaved" });
};

// GET SAVED POSTS
const getSavedPosts = async (req, res) => {
  const user_id = req.user.id;

  const posts = await saveModel.getSavedPosts(user_id);

  res.json(posts);
};

module.exports = {
  savePost,
  unsavePost,
  getSavedPosts
};