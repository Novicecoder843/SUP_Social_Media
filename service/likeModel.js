const pool = require("../db/db");

// LIKE
const likePost = async (user_id, post_id) => {
  const result = await pool.query(
    `INSERT INTO post_likes (user_id, post_id)
     VALUES ($1, $2)
     RETURNING *`,
    [user_id, post_id]
  );
  return result.rows[0];
};

// UNLIKE
const unlikePost = async (user_id, post_id) => {
  await pool.query(
    `DELETE FROM post_likes
     WHERE user_id=$1 AND post_id=$2`,
    [user_id, post_id]
  );
};

// COUNT
const getLikeCount = async (post_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM post_likes WHERE post_id=$1`,
    [post_id]
  );
  return result.rows[0].count;
};

// USERS
const getLikedUsers = async (post_id) => {
  const result = await pool.query(
    `SELECT users.id, users.name
     FROM post_likes
     JOIN users ON users.id = post_likes.user_id
     WHERE post_likes.post_id=$1`,
    [post_id]
  );
  return result.rows;
};

module.exports = {
  likePost,
  unlikePost,
  getLikeCount,
  getLikedUsers
};