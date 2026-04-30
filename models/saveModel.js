const pool = require("../config/db");

// SAVE
exports.savePost = (user_id, post_id) => {
  return pool.query(
    "INSERT INTO saved_posts (user_id, post_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [user_id, post_id]
  );
};

// UNSAVE
exports.unsavePost = (user_id, post_id) => {
  return pool.query(
    "DELETE FROM saved_posts WHERE user_id=$1 AND post_id=$2",
    [user_id, post_id]
  );
};

// GET SAVED POSTS
exports.getSaved = (user_id) => {
  return pool.query(
    "SELECT * FROM saved_posts WHERE user_id=$1",
    [user_id]
  );
};