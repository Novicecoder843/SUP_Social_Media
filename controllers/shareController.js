const shareModel = require("../service/shareModel");

// SHARE
const sharePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.postId;

  await shareModel.sharePost(user_id, post_id);

  res.json({ message: "Post shared" });
};

// UNSHARE
const unsharePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.postId;

  await shareModel.unsharePost(user_id, post_id);

  res.json({ message: "Post unshared" });
};

// COUNT
const getShareCount = async (req, res) => {
  const post_id = req.params.postId;

  const count = await shareModel.getShareCount(post_id);

  res.json({ count });
};

// USERS
const getSharedUsers = async (req, res) => {
  const post_id = req.params.postId;

  const users = await shareModel.getSharedUsers(post_id);

  res.json(users);
};

module.exports = {
  sharePost,
  unsharePost,
  getShareCount,
  getSharedUsers
};