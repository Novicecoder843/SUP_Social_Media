const commentModel = require("../service/commentModel");

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.postId;
    const { content, parent_id } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const comment = await commentModel.addComment(
      user_id,
      post_id,
      content,
      parent_id || null
    );

    res.json({
      message: parent_id ? "Reply added" : "Comment added",
      comment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const post_id = req.params.postId;

    const comments = await commentModel.getComments(post_id);

    res.json(comments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const comment_id = req.params.commentId;

    await commentModel.deleteComment(comment_id, user_id);

    res.json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// COUNT COMMENTS
const getCommentCount = async (req, res) => {
  try {
    const post_id = req.params.postId;

    const count = await commentModel.getCommentCount(post_id);

    res.json({ count });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// EDIT COMMENT
const updateComment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const comment_id = req.params.commentId;
    const { content } = req.body;

    const updated = await commentModel.updateComment(
      comment_id,
      user_id,
      content
    );

    res.json({
      message: "Comment updated",
      updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LIKE COMMENT 
const likeComment = async (req, res) => {
  const user_id = req.user.id;
  const comment_id = req.params.commentId;

  await commentModel.likeComment(user_id, comment_id);

  res.json({ message: "Comment liked" });
};

//UNLIKE COMMENT 
const unlikeComment = async (req, res) => {
  const user_id = req.user.id;
  const comment_id = req.params.commentId;

  await commentModel.unlikeComment(user_id, comment_id);

  res.json({ message: "Comment unliked" });
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  getCommentCount,
  updateComment,
  likeComment,      
  unlikeComment
};