const pool = require("../config/db");

// create hashtag if not exists
exports.createHashtag = async (tag) => {
  const result = await pool.query(
    `INSERT INTO user_schema.hashtags (tag)
     VALUES ($1)
     ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
     RETURNING id`,
    [tag]
  );
  return result.rows[0];
};

// map post + hashtag
exports.mapPostHashtag = async (postId, hashtagId) => {
  await pool.query(
    `INSERT INTO user_schema.post_hashtags (post_id, hashtag_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [postId, hashtagId]
  );
};

exports.getPostsByTag = (tag, limit, offset) => {
  return pool.query(
    `SELECT 
        p.id,
        p.content,
        p.created_at,
        u.full_name,
        p.like_count,
        p.comment_count
     FROM user_schema.posts p
     JOIN user_schema.post_hashtags ph
        ON p.id = ph.post_id
     JOIN user_schema.hashtags h
        ON ph.hashtag_id = h.id
     JOIN user_schema.userstable u
        ON p.user_id = u.id
     WHERE h.tag = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [tag, limit, offset]
  );
};

// // tranding hastag quarry//

exports.getTrending = () => {
  return pool.query(
    `SELECT h.tag, COUNT(ph.post_id) AS usage_count
     FROM user_schema.hashtags h
     JOIN user_schema.post_hashtags ph
       ON h.id = ph.hashtag_id
     GROUP BY h.id
     ORDER BY usage_count DESC
     LIMIT 10`
  );
};