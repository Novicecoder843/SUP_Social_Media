const pool = require("../config/db");

exports.sharePost = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const receiver_id = req.body.receiver_id;
    const post_id = req.params.id;

    if (!receiver_id) {
      return res.status(400).json({ message: "receiver_id is required"});
    }

    await pool.query(
      "INSERT INTO shares (sender_id, receiver_id, post_id) VALUES ($1,$2,$3)",
      [sender_id, receiver_id, post_id]
    );

    res.json({ message: "Post shared" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error sharing post" });
  }
};