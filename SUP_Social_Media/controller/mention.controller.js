const Mention = require('../models/mention.model');

exports.getMentionsByPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const mentions = await Mention.getMentionsByPost(postId);

    res.json(mentions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostsMentioningUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Mention.getPostsWhereUserMentioned(userId);

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};