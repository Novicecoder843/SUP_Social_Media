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

// LIKE POST //

exports.likePost = async (userId, postId) => {

  await pool.query(
    `INSERT INTO user_schema.post_likes(post_id,user_id)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING`,
    [postId, userId]
  );

  await pool.query(
    `UPDATE user_schema.posts
     SET like_count = like_count + 1
     WHERE id=$1`,
    [postId]
  );
};

// COMMENT POST // 

exports.commentPost = async (userId, postId, comment) => {

  await pool.query(
    `INSERT INTO user_schema.post_comments(post_id,user_id,comment)
     VALUES($1,$2,$3)`,
    [postId, userId, comment]
  );

  await pool.query(
    `UPDATE user_schema.posts
     SET comment_count = comment_count + 1
     WHERE id=$1`,
    [postId]
  );
};


// SHAIR POST//

exports.sharePost = async (userId, postId) => {

  await pool.query(
    `INSERT INTO user_schema.post_shares(post_id,user_id)
     VALUES($1,$2)`,
    [postId, userId]
  );

  await pool.query(
    `UPDATE user_schema.posts
     SET share_count = share_count + 1
     WHERE id=$1`,
    [postId]
  );
};

// GET STATSAS //

exports.getStats = (postId) => {
  return pool.query(
    `SELECT like_count, comment_count, share_count
     FROM user_schema.posts
     WHERE id=$1`,
    [postId]
  );
};


exports.replyComment = async (userId, commentId, comment) => {

  // get post id from parent comment
  const parent = await pool.query(
    `SELECT post_id FROM user_schema.post_comments
     WHERE id=$1`,
    [commentId]
  );

  if (parent.rows.length === 0) {
    throw new Error("Comment not found");
  }

  const postId = parent.rows[0].post_id;

  return pool.query(
    `INSERT INTO user_schema.post_comments
     (post_id,user_id,comment,parent_comment_id)
     VALUES($1,$2,$3,$4)
     RETURNING *`,
    [postId, userId, comment, commentId]
  );
};


exports.getPostComments = (postId) => {

  return pool.query(
    `SELECT 
        c.id,
        c.comment,
        c.parent_comment_id,
        c.created_at,
        u.full_name
     FROM user_schema.post_comments c
     JOIN user_schema.userstable u
        ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );

};


exports.toggleLike = async (userId, commentId) => {

  const check = await pool.query(
    `SELECT * FROM user_schema.comment_likes
     WHERE user_id=$1 AND comment_id=$2`,
    [userId, commentId]
  );

  if (check.rows.length > 0) {
    await pool.query(
      `DELETE FROM user_schema.comment_likes
       WHERE user_id=$1 AND comment_id=$2`,
      [userId, commentId]
    );
    return { message: "Unliked" };
  }

  await pool.query(
    `INSERT INTO user_schema.comment_likes(user_id,comment_id)
     VALUES($1,$2)`,
    [userId, commentId]
  );

  return { message: "Liked" };
};


exports.editComment = (userId, commentId, comment) => {
  return pool.query(
    `UPDATE user_schema.post_comments
     SET comment=$1
     WHERE id=$2 AND user_id=$3`,
    [comment, commentId, userId]
  );
};


exports.deleteComments = (userId, commentId) => {
  return pool.query(
    `UPDATE user_schema.post_comments
     SET is_deleted=true
     WHERE id=$1 AND user_id=$2`,
    [commentId, userId]
  );
};



// get post tag

exports.getPostHashtags = (postId) => {
  return pool.query(
    `SELECT h.id, h.tag
     FROM user_schema.hashtags h
     JOIN user_schema.post_hashtags ph
        ON h.id = ph.hashtag_id
     WHERE ph.post_id = $1`,
    [postId]
  );
};

