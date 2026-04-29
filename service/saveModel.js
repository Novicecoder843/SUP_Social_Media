const pool = require("../db/db");

// SAVE
const savePost = async (user_id, post_id) => {
  await pool.query(
    `INSERT INTO saved_posts (user_id, post_id)
     VALUES ($1, $2)`,
    [user_id, post_id]
  );
};

// UNSAVE
const unsavePost = async (user_id, post_id) => {
  await pool.query(
    `DELETE FROM saved_posts
     WHERE user_id=$1 AND post_id=$2`,
    [user_id, post_id]
  );
};

// GET SAVED POSTS
const getSavedPosts = async (user_id) => {
  const result = await pool.query(
    `SELECT posts.*
     FROM saved_posts
     JOIN posts ON saved_posts.post_id = posts.id
     WHERE saved_posts.user_id=$1
     ORDER BY saved_posts.created_at DESC`,
    [user_id]
  );

  return result.rows;
};

module.exports = {
  savePost,
  unsavePost,
  getSavedPosts
};