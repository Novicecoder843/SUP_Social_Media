const postModel = require("../service/postModel");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content } = req.body;

    const image_url = req.file ? req.file.key : null;

    if (!content && !image_url) {
      return res.status(400).json({
        message: "Content or image is required"
      });
    }

    const post = await postModel.createPost(
      user_id,
      content,
      image_url
    );

    res.json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();

    const updatedPosts = posts.map(post => {
      if (post.image_url && !post.image_url.startsWith("http")) {
        post.image_url =
          process.env.AWS_BASE_URL + "/" + post.image_url;
      }
      return post;
    });

    res.json(updatedPosts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE POST
const getPost = async (req, res) => {
  try {
    const post = await postModel.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image_url && !post.image_url.startsWith("http")) {
      post.image_url =
        process.env.AWS_BASE_URL + "/" + post.image_url;
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE POST
const updatePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content } = req.body;

    const image_url = req.file ? req.file.key : null;

    const post = await postModel.updatePost(
      req.params.id,
      user_id,
      content,
      image_url
    );

    if (!post) {
      return res.status(403).json({
        message: "Not allowed or post not found"
      });
    }

    res.json({
      message: "Post updated successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const user_id = req.user.id;

    const post = await postModel.deletePost(
      req.params.id,
      user_id
    );

    if (!post) {
      return res.status(403).json({
        message: "Not allowed or post not found"
      });
    }

    res.json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
};