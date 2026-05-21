const pool = require("../config/db");

// SAVE
exports.savePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;

    await pool.query(
      "INSERT INTO saved_posts (user_id, post_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [user_id, post_id]
    );

    res.json({ message: "Post saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving post" });
  }
};

// UNSAVE
exports.unsavePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.id;

  await pool.query(
    "DELETE FROM saved_posts WHERE user_id=$1 AND post_id=$2",
    [user_id, post_id]
  );

  res.json({ message: "Post unsaved" });
};

// GET SAVED
// GET SAVED
exports.getSaved = async (req, res) => {
  try {
    const user_id = req.params.id;

    console.log("User ID:", user_id);

    const result = await pool.query(
      "SELECT * FROM saved_posts WHERE user_id = $1",
      [user_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("Get Saved Error:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching saved posts"
    });
  }
};