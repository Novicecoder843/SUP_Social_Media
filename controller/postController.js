const postModel = require("../models/postModel");

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const user_id = req.user.id;

    const post = await postModel.createPost(user_id, content);

    if (media && media.length) {
      for (let m of media) {
        await postModel.addPostMedia(post.id, m.url, m.type);
      }
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
