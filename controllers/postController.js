const Post = require("../models/postModel");
const { post } = require("../routes/authRouters");
const mentionModel = require("../models/mentionModel");
const { extractMentions } = require("../utlis/mentionUtil");


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

    // 3️⃣ Extract mentions from content
    const mentions = [...new Set(extractMentions(content))];
    console.log("Mentions:", mentions);
    // 4️⃣ Save mentions in DB
    for (const username of mentions) {
      const userRes = await mentionModel.getUserByUsername(username);

      console.log("Searching:", username, userRes.rows);

      if (userRes.rows.length > 0) {
        const mentionedUserId = userRes.rows[0].id;

        // console.log("mantionid" , mentionedUserId );
        console.log("Searching:", username, userRes.rows);
        await mentionModel.createMention(post.id, mentionedUserId);
      } else {
        console.log("User NOT found:", username);
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

// POST GET BY ID//

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


// DELETE POST//

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

// LIKE POST ///

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

// COMMENT POST //

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
    res.status(500).json({ error: err.message, message: 'cant find post id' });
  }
};

// SHAIR A POST//

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
    res.status(500).json({ error: err.message, message: 'cant find post id' });
  }
};
// GET POST STATUSH//

exports.getPostStats = async (req, res) => {
  try {
    const postId = req.params.id;

    const stats = await Post.getStats(postId);

    res.json(stats.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REPLAY TO COMMENT //

exports.replyComment = async (req, res) => {
  try {

    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId);
    const { comment } = req.body;

    if (isNaN(commentId)) {
      return res.status(400).json({
        message: "Invalid comment id"
      });
    }

    if (!comment) {
      return res.status(400).json({
        message: "Reply comment is required"
      });
    }

    const reply = await Post.replyComment(userId, commentId, comment);

    res.status(201).json({
      message: "Reply added successfully",
      reply: reply.rows[0]
    });

  } catch (err) {

    if (err.code === "23503") {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


// GET POST COMMENT //

exports.getPostComments = async (req, res) => {
  try {

    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }

    const comments = await Post.getPostComments(postId);

    res.status(200).json({
      comments: comments.rows
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
};

// LIKE AND UNLIKE COMMENT //
exports.toggleLikeComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = parseInt(req.params.id);

    const result = await Post.toggleLike(userId, commentId);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EDIT COMMENT //

exports.editComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = parseInt(req.params.id);
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment required" });
    }

    const updated = await Post.editComment(userId, commentId, comment);

    if (updated.rowCount === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ message: "Comment updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete comment//

exports.deleteComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = parseInt(req.params.id);

    const deleted = await Post.deleteComments(userId, commentId);

    if (deleted.rowCount === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// hastags//
exports.getPostHashtags = async (req, res) => {
  try {

    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }

    const result = await Post.getPostHashtags(postId);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No hashtags found"
      });
    }

    res.json({
      hashtags: result.rows
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};




exports.toggleSavePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    // 1️⃣ Check existing
    const existing = await Post.checkSaved(userId, postId);

    // 2️⃣ If exists → UNSAVE
    if (existing.rows.length > 0) {
      await Post.unsavePost(userId, postId);

      return res.json({
        message: "Post unsaved",
        saved: false
      });
    }

    // 3️⃣ Else → SAVE
    await Post.savePost(userId, postId);

    res.json({
      message: "Post saved",
      saved: true
    });

  } catch (err) {
    console.error(err);

    // FK error
    if (err.code === "23503") {
      return res.status(400).json({
        message: "Invalid post_id (post not found)"
      });
    }

    res.status(500).json({ error: err.message });
  }
};




exports.reportPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: "Report reason is required"
      });
    }

    await Post.reportPost(userId, postId, reason);

    res.json({
      message: "Post reported successfully" , reason
    });

  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        message: "Invalid post_id"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

