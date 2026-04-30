const pool = require("../config/db");

const createMedia = async ({ post_id, media_url, media_type }) => {
  const result = await pool.query(
    `INSERT INTO post_media (post_id, media_url, media_type)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [post_id, media_url, media_type]
  );

  return result.rows[0];
};

const checkPostExists = async (post_id) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [post_id]
  );
  return result.rows.length > 0;
};

module.exports = {
  createMedia,
  checkPostExists,
};