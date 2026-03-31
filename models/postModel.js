const db = require("../config/db");

// Create Post
exports.createPost = async (user_id, content) => {
  const result = await db.query(
    "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
    [user_id, content]
  );
  return result.rows[0];
};
