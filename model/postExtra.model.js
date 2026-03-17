const db = require("../config/db");


/* GET POSTS BY HASHTAG */

exports.getPostsByHashtag = async (tag) => {

  const query = `
    SELECT p.*
    FROM posts p
    JOIN post_hashtags ph ON p.id = ph.post_id
    JOIN hashtags h ON h.id = ph.hashtag_id
    WHERE h.tag = $1
  `;

  const result = await db.query(query, [tag]);

  return result.rows;
};



/* GET POST HASHTAGS */

exports.getPostHashtags = async (post_id) => {

  const query = `
    SELECT h.tag
    FROM hashtags h
    JOIN post_hashtags ph ON h.id = ph.hashtag_id
    WHERE ph.post_id = $1
  `;

  const result = await db.query(query, [post_id]);

  return result.rows;
};



/* GET POST MENTIONS */

exports.getPostMentions = async (post_id) => {

  const query = `
    SELECT u.id, u.username
    FROM users u
    JOIN post_mentions pm ON pm.mentioned_user_id = u.id
    WHERE pm.post_id = $1
  `;

  const result = await db.query(query, [post_id]);

  return result.rows;
};



/* LIKE COMMENT */

exports.likeComment = async (comment_id, user_id) => {

  const query = `
    INSERT INTO comment_likes (comment_id, user_id)
    VALUES ($1, $2)
  `;

  return db.query(query, [comment_id, user_id]);
};