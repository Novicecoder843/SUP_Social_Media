const pool = require("../db/db");

// CREATE POST
const createPost = async (user_id, content, image_url) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, content, image_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, content, image_url]
  );
  return result.rows[0];
};

// GET ALL POSTS
const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT p.*, u.name 
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );
  return result.rows;
};

// GET SINGLE POST
const getPostById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE id=$1",
    [id]
  );
  return result.rows[0];
};

// UPDATE POST
const updatePost = async (id, user_id, content, image_url) => {
  let query;
  let values;

  if (image_url) {
    query = `
      UPDATE posts
      SET content=$1, image_url=$2, updated_at=NOW()
      WHERE id=$3 AND user_id=$4
      RETURNING *`;
    values = [content, image_url, id, user_id];
  } else {
    query = `
      UPDATE posts
      SET content=$1, updated_at=NOW()
      WHERE id=$2 AND user_id=$3
      RETURNING *`;
    values = [content, id, user_id];
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE POST
const deletePost = async (id, user_id) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, user_id]
  );
  return result.rows[0];
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};