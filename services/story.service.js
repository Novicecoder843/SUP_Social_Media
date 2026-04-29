const pool = require("../config/db");
exports.createStory = async (userId, file) => {
  if (!file) {
    throw new Error("File missing"); // 👈 ADD THIS
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const mediaUrl = file.location || file.key; // 👈 FIX

  await pool.query(
    `INSERT INTO stories(user_id, media_url, expires_at)
     VALUES($1,$2,$3)`,
    [userId, mediaUrl, expiresAt]
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