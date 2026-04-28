const pool = require("../config/db");
exports.createStory = async (userId, file) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO stories(user_id, media_url, expires_at)
     VALUES($1,$2,$3)`,
    [userId, file.key, expiresAt]
  );

  return { message: "Story uploaded" };
};

exports.getStories = async () => {
  const result = await pool.query(
    `
    SELECT * FROM stories
    WHERE expires_at > NOW()
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};