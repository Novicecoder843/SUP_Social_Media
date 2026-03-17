const pool = require("../config/db");


// CREATE POST
exports.createPost = async (data) => {

  const { user_id, content, visibility, location } = data;

  const result = await pool.query(
    `INSERT INTO posts (user_id, content, visibility, location)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [user_id, content, visibility, location]
  );

  return result.rows[0];
};


// ADD MEDIA
exports.addPostMedia = async (post_id, media_url, media_type) => {

  const result = await pool.query(
    `INSERT INTO post_media (post_id, media_url, media_type)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [post_id, media_url, media_type]
  );

  return result.rows[0];
};


// GET POST BY ID
exports.getPostById = async (post_id) => {

  const result = await pool.query(
    `SELECT posts.*, json_agg(post_media.*) as media
     FROM posts
     LEFT JOIN post_media
     ON posts.id = post_media.post_id
     WHERE posts.id=$1
     GROUP BY posts.id`,
    [post_id]
  );

  return result.rows[0];
};


// GET USER POSTS
exports.getMyPosts = async (user_id) => {

  const result = await pool.query(
    `SELECT *
     FROM posts
     WHERE user_id=$1
     AND is_deleted=false
     ORDER BY created_at DESC`,
    [user_id]
  );

  return result.rows;
};


// ARCHIVE POST
exports.archivePost = async (post_id) => {

  await pool.query(
    `UPDATE posts
     SET visibility='PRIVATE'
     WHERE id=$1`,
    [post_id]
  );

};


// DELETE POST
exports.deletePost = async (post_id) => {

  await pool.query(
    `UPDATE posts
     SET is_deleted=true
     WHERE id=$1`,
    [post_id]
  );

};


// LIKE POST
exports.createLike = async (post_id, user_id) => {

  await pool.query(
    `INSERT INTO post_likes(post_id,user_id)
     VALUES ($1,$2)`,
    [post_id, user_id]
  );

  await pool.query(
    `UPDATE posts
     SET like_count = like_count + 1
     WHERE id=$1`,
    [post_id]
  );

};


// COMMENT
exports.createComment = async (post_id, user_id, content, parent_id) => {

  const result = await pool.query(
    `INSERT INTO comments(post_id,user_id,content,parent_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [post_id, user_id, content, parent_id]
  );

  await pool.query(
    `UPDATE posts
     SET comment_count = comment_count + 1
     WHERE id=$1`,
    [post_id]
  );

  return result.rows[0];
};


// SAVE POST
exports.savePost = async (user_id, post_id) => {

  await pool.query(
    `INSERT INTO saved_posts(user_id,post_id)
     VALUES ($1,$2)`,
    [user_id, post_id]
  );

};


// SHARE POST
exports.sharePost = async (user_id, post_id) => {

  await pool.query(
    `INSERT INTO post_shares(user_id,post_id)
     VALUES ($1,$2)`,
    [user_id, post_id]
  );

  await pool.query(
    `UPDATE posts
     SET share_count = share_count + 1
     WHERE id=$1`,
    [post_id]
  );

};