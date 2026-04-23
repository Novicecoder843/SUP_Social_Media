
const pool = require("../config/db");
exports.createPost = async (userId, caption, files) => {
  const post = await pool.query(
    `INSERT INTO posts(user_id, caption)
     VALUES($1,$2) RETURNING *`,
    [userId, caption]
  );
  const postId = post.rows[0].id;
  for (let file of files) {
    await pool.query(
      `INSERT INTO post_images(post_id, image_url)
       VALUES($1,$2)`,
      [postId, file.key]
    );
  }
  return { message: "Post created" };
};
exports.getUserPosts = async (userId) => {
  const result = await pool.query(
    `
    SELECT p.id, p.caption, p.created_at, pi.image_url
    FROM posts p
    LEFT JOIN post_images pi ON p.id = pi.post_id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    `,
    [userId]
  );
  return result.rows;
};
exports.getFeed = async (userId) => {
  const result = await pool.query(
    `
    SELECT p.*, u.email,
    COUNT(DISTINCT l.id) as likes,
    COUNT(DISTINCT c.id) as comments
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN post_likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    WHERE p.user_id IN (
      SELECT following_id FROM user_followers WHERE follower_id = $1
    )
    GROUP BY p.id, u.email
    ORDER BY p.created_at DESC
    `,
    [userId]
  );
  return result.rows;
};
exports.likePost = async (userId, postId) => {
  await pool.query(
    `INSERT INTO post_likes(user_id, post_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [userId, postId]
  );

  return { message: "Liked" };
};
exports.commentPost = async (userId, postId, comment) => {
  await pool.query(
    `INSERT INTO comments(user_id, post_id, comment)
     VALUES($1,$2,$3)`,
    [userId, postId, comment]
  );

  return { message: "Comment added" };
};
exports.createNotification = async (userId, type, refId) => {
  await pool.query(
    `INSERT INTO notifications(user_id,type,reference_id)
     VALUES($1,$2,$3)`,
    [userId, type, refId]
  );
};
