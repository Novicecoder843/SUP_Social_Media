const pool = require("../config/db");

const db = require("../config/db");

// LIKE
exports.likePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;

    await pool.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [user_id, post_id]
    );

    // const total_likes = parseInt(Result.rows[0].count);

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ message: "Error liking post" });
  }
};

// UNLIKE
exports.unlikePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;

    await pool.query(
      "DELETE FROM likes WHERE user_id=$1 AND post_id=$2",
      [user_id, post_id]
    );

    res.json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ message: "Error unliking post" });
  }
};


exports.getLikesCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.status(200).json({
      postId,
      likes: parseInt(result.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching likes count",
    });
  }
};