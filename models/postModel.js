const pool = require("../config/db");

// CREATE POST (with client for transaction)
exports.createPost = (client, user_id, content,) => {
  return client.query(
    "INSERT INTO posts (user_id, content, created_at, updated_at) VALUES ($1,$2, NOW(), NOW()) RETURNING *",
    [user_id, content]
  );
};

// ADD MEDIA (transaction)
exports.addPostMedia = (client, post_id, url, type) => {
  return client.query(
    "INSERT INTO post_media (post_id, media_url, media_type) VALUES ($1,$2,$3)",
    [post_id, url, type]
  );
};

// GET ALL POSTS
exports.getAllPosts = () => {
  return pool.query("SELECT * FROM posts ORDER BY created_at DESC");
};

// GET SINGLE POST
exports.getPostById = (id) => {
  return pool.query("SELECT * FROM posts WHERE id=$1", [id]);
};

// UPDATE POST (only owner)
exports.updatePost = (post_id, user_id, content) => {
  return pool.query(
    "UPDATE posts SET content=$1, updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *",
    [content, post_id, user_id]
  );
};

// DELETE POST (only owner)
exports.deletePost = (post_id, user_id) => {
  return pool.query(
    "DELETE FROM posts WHERE id=$1 AND user_id=$2",
    [post_id, user_id]
  );
};

// GET USER POSTS
exports.getUserPosts = (user_id) => {
  return pool.query(
    "SELECT * FROM posts WHERE user_id=$1 ORDER BY created_at DESC",
    [user_id]
  );
};