const pool = require("../config/db");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content } = req.body;

    const result = await pool.query(
      "INSERT INTO posts (user_id, content) VALUES ($1,$2) RETURNING *",
      [user_id, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
};

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
  res.json(result.rows);
};

// GET SINGLE POST
exports.getSinglePost = async (req, res) => {
  const result = await pool.query("SELECT * FROM posts WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
};

// UPDATE
exports.updatePost = async (req, res) => {
  const content = req.body;

  const result = await pool.query(
    "UPDATE posts SET content=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
    [content, req.params.id]
  );

  res.json(result.rows[0]);
};

// DELETE
exports.deletePost = async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [req.params.id]);
  res.json({ message: "Post deleted" });
};

// USER POSTS
exports.getUserPosts = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE user_id=$1",
    [req.params.id]
  );
  res.json(result.rows);
};