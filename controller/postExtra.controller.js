const PostExtra = require("../model/postExtra.model");


/* GET POSTS BY HASHTAG */

exports.getPostsByHashtag = async (req, res) => {

  try {

    const { tag } = req.params;

    const posts = await PostExtra.getPostsByHashtag(tag);

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* GET POST HASHTAGS */

exports.getPostHashtags = async (req, res) => {

  try {

    const { post_id } = req.params;

    const hashtags = await PostExtra.getPostHashtags(post_id);

    res.json({
      success: true,
      data: hashtags
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* GET POST MENTIONS */

exports.getPostMentions = async (req, res) => {

  try {

    const { post_id } = req.params;

    const mentions = await PostExtra.getPostMentions(post_id);

    res.json({
      success: true,
      data: mentions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* LIKE COMMENT */

exports.likeComment = async (req, res) => {

  try {

    const { comment_id, user_id } = req.body;

    await PostExtra.likeComment(comment_id, user_id);

    res.json({
      success: true,
      message: "Comment liked"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};