const pool = require("../config/db");
const Hashtag = require("../models/hastagModel");
const { extractHashtags } = require("../utlis/hashtagUtil");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, visibility } = req.body;

    // 1️⃣ Create Post
    const postResult = await pool.query(
      `INSERT INTO user_schema.posts (user_id, content, visibility)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, content, visibility || "public"]
    );

    const postId = postResult.rows[0].id;

    // 2️⃣ Extract hashtags
    const hashtags = extractHashtags(content);

    // 3️⃣ Save hashtags + mapping
    for (let tag of hashtags) {
      const hashtag = await Hashtag.createHashtag(tag);
      await Hashtag.mapPostHashtag(postId, hashtag.id);
    }

    res.status(201).json({
      message: "Post created successfully",
      postId,
      hashtags
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};




exports.getPostsByHashtags = async (req, res) => {
  try {

    const tag = req.params.tag;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    if (!tag) {
      return res.status(400).json({
        message: "Hashtag is required"
      });
    }

    const posts = await Hashtag.getPostsByTag(tag, limit, offset);

    if (posts.rows.length === 0) {
      return res.status(404).json({
        message: "No posts found for this hashtag"
      });
    }

    res.json({
      page,
      limit,
      count: posts.rows.length,
      data: posts.rows
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


// GET TRANDING HASTAGS //

exports.getTrendingHashtags = async (req, res) => {
  try {

    const result = await Hashtag.getTrending();

    res.json({
      trending: result.rows
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
