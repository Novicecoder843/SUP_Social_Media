const pool = require("../db/db");

// ADD COMMENT
const addComment = async (user_id, post_id, content, parent_id) => {
  const result = await pool.query(
    `INSERT INTO comments (user_id, post_id, content, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, post_id, content, parent_id]
  );
  return result.rows[0];
};

// GET COMMENTS
const getComments = async (post_id) => {
  const result = await pool.query(
    `SELECT * FROM comments WHERE post_id=$1`,
    [post_id]
  );

  const comments = result.rows;

  const main = comments.filter(c => c.parent_id === null);
  const replies = comments.filter(c => c.parent_id !== null);

  // attach replies
  main.forEach(comment => {
    comment.replies = replies.filter(r => r.parent_id === comment.id);
  });

  return main;
};

// DELETE COMMENT
const deleteComment = async (comment_id, user_id) => {
  await pool.query(
    `DELETE FROM comments
     WHERE id=$1 AND user_id=$2`,
    [comment_id, user_id]
  );
};

// COUNT COMMENTS
const getCommentCount = async (post_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM comments WHERE post_id=$1`,
    [post_id]
  );
  return result.rows[0].count;
};

// EDIT COMMENT
const updateComment = async (comment_id, user_id, content) => {
  const result = await pool.query(
    `UPDATE comments
     SET content=$1
     WHERE id=$2 AND user_id=$3
     RETURNING *`,
    [content, comment_id, user_id]
  );
  return result.rows[0];
};

// LIKE COMMENT
const likeComment = async (user_id, comment_id) => {
  await pool.query(
    `INSERT INTO comment_likes (user_id, comment_id)
     VALUES ($1, $2)`,
    [user_id, comment_id]
  );
};

// UNLIKE COMMENT
const unlikeComment = async (user_id, comment_id) => {
  await pool.query(
    `DELETE FROM comment_likes
     WHERE user_id=$1 AND comment_id=$2`,
    [user_id, comment_id]
  );
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