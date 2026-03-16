const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, visibility = "public" } = req.body;

    const postResult = await Post.createPost(userId, content, visibility);
    const post = postResult.rows[0];

    // ✅ Save uploaded media
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const mediaType = file.mimetype.startsWith("image")
          ? "image"
          : "video";

        await Post.addPostMedia(
          post.id,
          `uploads/posts/${file.path}`,
          mediaType
        );
      }
    }

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.AllPosts = async (req, res) => {
  try {
    const posts = await Post.getAllPosts();
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId))
      return res.status(400).json({ message: "Invalid post ID" });

    const post = await Post.getPostById(postId);

    if (post.rows.length === 0)
      return res.status(404).json({ message: "Post not found" });

    res.json(post.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const result = await Post.deletePost(postId, userId);

    if (result.rowCount === 0)
      return res.status(403).json({ message: "Not allowed or post not found" });

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }

    await Post.likePost(userId, postId);

    res.json({ message: "Post liked " });

  } catch (err) {
    res.status(500).json({
      message: 'cant find post id'
    });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { comment } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }

    await Post.commentPost(userId, postId, comment);

    res.json({ message: "Comment added" });

  } catch (err) {
    res.status(500).json({ error: err.message ,  message: 'cant find post id'});
  }
};

exports.sharePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }
    await Post.sharePost(userId, postId);

    res.json({ message: "Post shared" });

  } catch (err) {
    res.status(500).json({ error: err.message , message: 'cant find post id' });
  }
};

exports.getPostStats = async (req, res) => {
  try {
    const postId = req.params.id;

    const stats = await Post.getStats(postId);

    res.json(stats.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};