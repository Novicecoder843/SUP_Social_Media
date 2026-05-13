const db = require("../config/db");

// ✅ Create or get hashtag
exports.createOrGetHashtag = async (tag) => {
  const result = await db.query(
    `INSERT INTO hashtags (tag)
     VALUES ($1)
     ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
     RETURNING id`,
    [String(tag).toLowerCase()]
  );

  return result.rows[0]; // { id }
};

exports.addPostHashtag = async (
  client,
  post_id,
  hashtag_id
) => {

  return client.query(
    `
    INSERT INTO post_hashtags
    (post_id, hashtag_id)
    VALUES ($1, $2)
    `,
    [post_id, hashtag_id]
  );
};

// ✅ Get hashtags of a post
exports.getHashtagsByPost = async (postId) => {
  const result = await db.query(
    `SELECT h.id, h.tag
     FROM hashtags h
     JOIN post_hashtags ph ON h.id = ph.hashtag_id
     WHERE ph.post_id = $1`,
    [postId]
  );

  return result.rows;
};

// ✅ Get posts by hashtag
exports.getPostsByTag = async (tag) => {
  const result = await db.query(
    `SELECT p.*
     FROM posts p
     JOIN post_hashtags ph ON p.id = ph.post_id
     JOIN hashtags h ON h.id = ph.hashtag_id
     WHERE h.tag = $1
     ORDER BY p.created_at DESC`,
    [tag.toLowerCase()]
  );

  return result.rows;
};