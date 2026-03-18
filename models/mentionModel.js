
const pool = require("../config/db");
// get user by username
exports.getUserByUsername = (username) => {
  return pool.query(
  `SELECT user_id AS id 
   FROM user_schema.user_profiles 
   WHERE LOWER(username) = LOWER($1)`,
  [username]
);
};

// save mention
exports.createMention = (postId, userId) => {
  return pool.query(
    `INSERT INTO user_schema.post_mentions (post_id, mentioned_user_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [postId, userId]
  );
};

// get posts mentioning a user
exports.getMentionsByUserId = (userId) => {
  return pool.query(
    `
    SELECT 
      p.id AS post_id,
      p.content,
      p.created_at,
      u.id AS user_id,
      u.full_name,
      up.username,
      up.profile_image
    FROM user_schema.post_mentions pm
    JOIN user_schema.posts p ON p.id = pm.post_id
    JOIN user_schema.userstable u ON u.id = p.user_id
    LEFT JOIN user_schema.user_profiles up ON up.user_id = u.id
    WHERE pm.mentioned_user_id = $1
    ORDER BY p.created_at DESC
    `,
    [userId]
  );
};