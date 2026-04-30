const db = require("../config/db");

// ✅ Link post with hashtag
exports.linkPostHashtag = async (postId, hashtagId) => {
  await db.query(
    `INSERT INTO post_hashtags (post_id, hashtag_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [postId, hashtagId]
  );
};





