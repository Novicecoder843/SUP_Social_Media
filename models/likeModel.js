const pool = require("../config/db");

// LIKE
exports.likePost = (user_id, post_id) => {
  return pool.query(
    "INSERT INTO likes (user_id, post_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [user_id, post_id]
  );
};

// UNLIKE
exports.unlikePost = (user_id, post_id) => {
  return pool.query(
    "DELETE FROM likes WHERE user_id=$1 AND post_id=$2",
    [user_id, post_id]
  );
};