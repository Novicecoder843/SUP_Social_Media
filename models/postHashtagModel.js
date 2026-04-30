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


// // ✅ Get hashtags of a post
// exports.getHashtagsByPost = async (postId) => {
//   const result = await db.query(
//     `SELECT h.id, h.tag
//      FROM hashtags h
//      JOIN post_hashtags ph ON h.id = ph.hashtag_id
//      WHERE ph.post_id = $1`,
//     [postId]
//   );

//   return result.rows;
// };


