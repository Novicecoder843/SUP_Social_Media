const pool = require("../config/db");

// ADD COMMENT
exports.addComment = (user_id, post_id, comment_text) => {
  return pool.query(
    "INSERT INTO comments (user_id, post_id, comment_text) VALUES ($1,$2,$3) RETURNING *",
    [user_id, post_id, comment_text]
  );
};

// GET COMMENTS
exports.getComments = (post_id) => {
  return pool.query(
    "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at DESC",
    [post_id]
  );
};

// DELETE COMMENT (only owner)
exports.deleteComment = (comment_id, user_id) => {
  return pool.query(
    "DELETE FROM comments WHERE id=$1 AND user_id=$2",
    [comment_id, user_id]
  );
};