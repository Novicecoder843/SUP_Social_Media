const pool = require("../config/db");
const { getImageUrl } = require("../utils/s3url");
const userService = require("../services/user.service");
const postService = require("../services/post.service");
const storyService = require("../services/story.service");
const { uploadToS3 } = require("../utils/s3url.js") ;

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
    const safeCaption = caption || "";
    const post = await postService.createPost(
      userId,
      safeCaption,
      req.files
    );
    const images = req.files.map(file => getImageUrl(file.key));
    res.json({
      message: "Post created successfully",
      post: {
        id: post.postId,
        caption: safeCaption,
        images,
        created_at: new Date()
      }
    });
  } catch (err) {
    console.error("CREATE POST ERROR:", err); 
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
exports.addComment = async (req, res) => {
  try {
    const { postId, comment, parentId } = req.body;
    const data = await postService.addComment(
      req.user.id,
      postId,
      comment,
      parentId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getComments = async (req, res) => {
  try {
    const data = await postService.getCommentsByPost(req.params.postId);
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
exports.getPostById = async (req, res) => {
  try {
    const data = await postService.getPostById(
      req.params.id,
      req.user.id
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addComment = async (req, res) => {
  try {
    const { postId, comment, parentId } = req.body;

    const data = await postService.addComment(
      req.user.id,
      postId,
      comment,
      parentId
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.savePost = async (req, res) => {
  try {
    const data = await postService.savePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unsavePost = async (req, res) => {
  try {
    const data = await postService.unsavePost(
      req.user.id,
      req.params.postId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createReel = async (req, res) => {
  try {
    const userId = req.user.id;
    const caption = req.body.caption;
    const file = req.file;

    const result = await postService.createReel(
      userId,
      caption,
      file
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating reel" });
  }
};

exports.getReels = async (req, res) => {
  try {
    const reels = await postService.getReels();
    res.json(reels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reels" });
  }
};

exports.createStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    const result = await storyService.createStory(userId, file);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload story" });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await storyService.getStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};