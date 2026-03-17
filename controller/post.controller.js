const postModel = require("../model/post.model");


// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const post = await postModel.createPost(req.body);
    return res.json(post);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};


// ADD MEDIA
exports.addMedia = async (req, res) => {
  try {

    const { post_id } = req.body;
    const media = [];

    for (let file of req.files) {

      const type = file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE";

      const result = await postModel.addPostMedia(
        post_id,
        file.filename,
        type
      );

      media.push(result);
    }

    res.json(media);

  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};


// GET POST BY ID
exports.getPostById = async (req, res) => {
  try {
    const post = await postModel.getPostById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET USER POSTS
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await postModel.getMyPosts(req.params.user_id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ARCHIVE POST
exports.archivePost = async (req, res) => {
  try {
    await postModel.archivePost(req.body.post_id);
    res.json({ message: "Post archived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    await postModel.deletePost(req.body.post_id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// LIKE POST
exports.createLike = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    await postModel.createLike(post_id, user_id);

    res.json({ message: "Post liked" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// COMMENT
exports.createComment = async (req, res) => {
  try {

    const { post_id, user_id, content, parent_id } = req.body;

    const comment = await postModel.createComment(
      post_id,
      user_id,
      content,
      parent_id
    );

    res.json(comment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// SAVE POST
exports.savePost = async (req, res) => {
  try {

    const { user_id, post_id } = req.body;

    await postModel.savePost(user_id, post_id);

    res.json({ message: "Post saved" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// SHARE POST
exports.sharePost = async (req, res) => {
  try {

    const { user_id, post_id } = req.body;

    await postModel.sharePost(user_id, post_id);

    res.json({ message: "Post shared" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};