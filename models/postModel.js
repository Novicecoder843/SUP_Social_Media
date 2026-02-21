const pool = require("../config/db");

exports.createPost = (userId, content, visibility) => {
  return pool.query(`
    INSERT INTO user_schema.posts (user_id, content, visibility)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [userId, content, visibility]);
};

exports.addPostMedia = (postId, mediaUrl, mediaType) => {
  return pool.query(`
    INSERT INTO user_schema.post_media (post_id, media_url, media_type)
    VALUES ($1, $2, $3)
  `, [postId, mediaUrl, mediaType]);
};

exports.getAllPosts = () => {
  return pool.query(`
    SELECT p.*, u.full_name
    FROM user_schema.posts p
    JOIN user_schema.userstable u ON p.user_id = u.id
    WHERE p.is_deleted = false
    ORDER BY p.created_at DESC
  `);
};

exports.getPostById = (postId) => {
  return pool.query(`
    SELECT p.*, u.full_name
    FROM user_schema.posts p
    JOIN user_schema.userstable u ON p.user_id = u.id
    WHERE p.id = $1 AND p.is_deleted = false
  `, [postId]);
};

exports.deletePost = (postId, userId) => {
  return pool.query(`
    UPDATE user_schema.posts
    SET is_deleted = true
    WHERE id = $1 AND user_id = $2
  `, [postId, userId]);
};