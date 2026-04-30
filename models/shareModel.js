const pool = require("../config/db");

exports.sharePost = (sender_id, receiver_id, post_id) => {
  return pool.query(
    "INSERT INTO shares (sender_id, receiver_id, post_id) VALUES ($1,$2,$3)",
    [sender_id, receiver_id, post_id]
  );
};