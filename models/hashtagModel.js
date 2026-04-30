const db = require("../config/db");

// ✅ Create or get hashtag
exports.createOrGetHashtag = async (tag) => {
  const result = await db.query(
    `INSERT INTO hashtags (tag)
     VALUES ($1)
     ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
     RETURNING id`,
    [tag.toLowerCase()]
  );

  return result.rows[0]; // { id }
};

// ✅ Get hashtags by postId
exports.getHashtagsByPost = async (postId) => {
  return await db.query(
    `SELECT h.*
     FROM hashtags h
     JOIN post_hashtags ph ON h.id = ph.hashtag_id
     WHERE ph.post_id = $1`,
    [postId]
  );
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