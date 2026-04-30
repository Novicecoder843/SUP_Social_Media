const pool = require("../config/db");
const db = require("../config/db");

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;
    const comment_text = req.body;

    const result = await pool.query(
      "INSERT INTO comments (user_id, post_id, comment_text) VALUES ($1,$2,$3) RETURNING *",
      [user_id, post_id, comment_text]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

// GET COMMENTS
exports.getComments = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at DESC",
    [req.params.id]
  );
  res.json(result.rows);
};

// UPDATE COMMENT 
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment_text } = req.body;

  try {
    // Check if comment exists
    const existing = await db.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // // OPTIONAL: Check ownership (VERY IMPORTANT 🔐)
    // if (existing.rows[0].user_id !== req.user.userId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const result = await db.query(
      "UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *",
      [comment_text, commentId]
    );

    res.status(200).json({
      message: "Comment updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating comment",
    });
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id=$1", [req.params.id]);
  res.json({ message: "Comment deleted" });
};