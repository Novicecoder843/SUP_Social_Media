const pool = require("../config/db");

// Share post
exports.sharePost = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const receiver_id = req.body.receiver_id;
    const post_id = req.params.id;

    await pool.query(
      "INSERT INTO shares (sender_id, receiver_id, post_id) VALUES ($1,$2,$3)",
      [sender_id, receiver_id, post_id]
    );

    res.json({ message: "Post shared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sharing post" });
  }
};

// Get shared posts
exports.getShares = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM shares WHERE receiver_id=$1",
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching shared posts" });
  }
};