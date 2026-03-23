const Comment = require('../models/comment.model');

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content required"
      });
    }

    const comment = await Comment.addComment(
      req.params.id,
      req.user.id,
      content
    );

    res.status(201).json({
      message: "Comment added",
      comment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.getComments(req.params.id);
    res.json(comments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};