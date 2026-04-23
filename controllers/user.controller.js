const pool = require("../config/db");
const userService = require("../services/user.service");
const postService = require("../services/post.service");
exports.getMe = async (req, res) => {
  try {
    const data = await userService.getMe(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateMe = async (req, res) => {
  try {
    const data = await userService.updateMe(req.user.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const data = await userService.getUserById(
      req.user?.id || 0,
      req.params.id
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const data = await userService.follow(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.unfollow = async (req, res) => {
  try {
    const data = await userService.unfollow(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.block = async (req, res) => {
  try {
    const data = await userService.block(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = await userService.updateProfileImage(
      req.user.id,
      req.file.key
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { caption } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Images required" });
    }
    const data = await postService.createPost(
      userId,
      caption,
      req.files
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMyPosts = async (req, res) => {
  try {

    const data = await postService.getUserPosts(req.user.id);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.likePost = async (req, res) => {
  try {
    const data = await userService.likePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.unlikePost = async (req, res) => {
  try {
    const data = await userService.unlikePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.commentPost = async (req, res) => {
  try {
    const data = await userService.commentPost(
      req.user.id,
      req.params.postId,
      req.body.comment
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const data = await userService.deletePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.sharePost = async (req, res) => {
  try {
    const data = await userService.sharePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
