const pool = require("../config/db");
const PostModel = require("../models/postModel");

//CREATE POST (with media)
exports.createPost = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user_id = req.user.id;
    const { content } = req.body;

    const postResult = await PostModel.createPost(client, user_id, content);
    const post = postResult.rows[0];

    //Prepare media list
    let mediaList = [];

    if (req.files && req.files.length > 0) {
      mediaList = req.files.map((file, index) => ({
        url: file.location,
        type: file.mimetype.startsWith("video") ? "video" : "image",
        order: index
      }));

      //Insert media
      await PostModel.addPostMediaBulk(client, post.id, mediaList);
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        ...post,
        media: mediaList
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error creating post"
    });
  } finally {
    client.release();
  }
};



// GET ALL POSTS (FEED)
exports.getAllPosts = async (req, res) => {
  try {
    const result = await PostModel.getAllPosts();

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts"
    });
  }
};



// GET SINGLE POST
exports.getSinglePost = async (req, res) => {
  try {
    const result = await PostModel.getPostById(req.params.id);

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching post"
    });
  }
};



// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.id;

    const result = await PostModel.updatePost(
      req.params.id,
      user_id,
      content
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating post"
    });
  }
};



// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const user_id = req.user.id;

    await PostModel.deletePost(req.params.id, user_id);

    res.status(200).json({
      success: true,
      message: "Post deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting post"
    });
  }
};

// USER POSTS
exports.getUserPosts = async (req, res) => {
  try {
    const user_id = req.params.id;

    const result = await PostModel.getUserPosts(user_id);

    // format response
    const formatted = result.rows.map(post => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,

      user: {
        id: post.user_id,
        name: post.name
      },

      media: post.media,
      likes_count: Number(post.likes_count),
      comments_count: Number(post.comments_count),
      shares_count: Number(post.shares_count)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};