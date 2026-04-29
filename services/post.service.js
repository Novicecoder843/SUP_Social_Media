
const pool = require("../config/db");
const { getImageUrl } = require("../utils/s3url");
const { getIO } = require("../sockets/socket");
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
exports.createReel = async (userId, caption, file) => {
  if (!file) {
    throw new Error("Video file missing"); // 👈 ADD THIS
  }

  const post = await pool.query(
    `INSERT INTO posts(user_id, caption, type)
     VALUES($1,$2,'reel') RETURNING *`,
    [userId, caption]
  );

  const postId = post.rows[0].id;

  const videoUrl = file.location || file.key; // 👈 FIX

  await pool.query(
    `INSERT INTO post_images(post_id, image_url)
     VALUES($1,$2)`,
    [postId, videoUrl]
  );

  return { message: "Reel created" };
};
exports.getReels = async () => {
  const result = await pool.query(
    `
    SELECT p.*
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.type = 'reel'
    ORDER BY p.created_at DESC
    `
  );
  return result.rows;
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
 return result.rows.map(post => ({
    ...post,
    image_url: getImageUrl(post.image_url)
  }));
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
   // get post owner
  const result = await pool.query(
    `SELECT user_id FROM posts WHERE id=$1`,
    [postId]
  );

  const receiverId = result.rows[0].user_id;
   await notificationService.createNotification({
    senderId: userId,
    receiverId,
    type: "like",
    postId
  });

  return { message: "Liked" };
};
exports.commentPost = async (userId, postId, comment) => {
  await pool.query(
    `INSERT INTO comments(user_id, post_id, comment)
     VALUES($1,$2,$3)`,
    [userId, postId, comment]
  );
  const result = await pool.query(
    `SELECT user_id FROM posts WHERE id=$1`,
    [postId]
  );

  const receiverId = result.rows[0].user_id;
   await notificationService.createNotification({
    senderId: userId,
    receiverId,
    type: "comment",
    postId
  });

  return { message: "Comment added" };
};
exports.addComment = async (userId, postId, comment, parentId = null) => {
  await pool.query(
    `
    INSERT INTO comments(user_id, post_id, comment, parent_id)
    VALUES($1,$2,$3,$4)
    `,
    [userId, postId, comment, parentId]
  );

  return { message: "Comment added" };
};
exports.getCommentsByPost = async (postId) => {
  const result = await pool.query(
    `
    SELECT c.*, u.email
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `,
    [postId]
  );

  const comments = result.rows;

  const map = {};
  const roots = [];

  // create map
  comments.forEach(c => {
    c.replies = [];
    map[c.id] = c;
  });

  // attach replies
  comments.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
};
exports.getPostById = async (postId, userId) => {
  const result = await pool.query(
    `
    SELECT 
      p.id,
      p.caption,
      p.created_at,
     json_agg(DISTINCT pi.image_url) 
    FILTER (WHERE pi.image_url IS NOT NULL) AS images, 
      COUNT(DISTINCT l.id) AS likes,
      COUNT(DISTINCT c.id) AS comments,

      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE user_id=$2 AND post_id=p.id
      ) AS is_liked,

      EXISTS (
        SELECT 1 FROM saved_posts 
        WHERE user_id=$2 AND post_id=p.id
      ) AS is_saved

    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN post_images pi ON pi.post_id = p.id
    LEFT JOIN post_likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id

    WHERE p.id = $1
    GROUP BY p.id, u.email
    `,
    [postId, userId]
  );
  const post = result.rows[0];
   const comments = await exports.getCommentsByPost(postId);
   return {
  ...post,
  images: post.images ? post.images.map(img => getImageUrl(img)) : [],
  comment_list: comments 
 };
};
exports.savePost = async (userId, postId) => {
  await pool.query(
    `
    INSERT INTO saved_posts(user_id, post_id)
    VALUES($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [userId, postId]
  );
  return { message: "Post saved" };
};
exports.unsavePost = async (userId, postId) => {
  await pool.query(
    `
    DELETE FROM saved_posts
    WHERE user_id=$1 AND post_id=$2
    `,
    [userId, postId]
  );

  return { message: "Post removed" };
};