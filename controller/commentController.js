const pool = require("../config/db");

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

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id=$1", [req.params.id]);
  res.json({ message: "Comment deleted" });
};