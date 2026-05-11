const pool = require("../db/db");

// CREATE REEL
const createReel = async (
  user_id,
  caption,
  video_url,
  thumbnail_url,
  hashtags
) => {

  const result = await pool.query(
    `
    INSERT INTO reels
    (
      user_id,
      caption,
      video_url,
      thumbnail_url,
      hashtags
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      user_id,
      caption,
      video_url,
      thumbnail_url,
      hashtags
    ]
  );

  return result.rows[0];
};

// GET ALL REELS
const getAllReels = async () => {

  const result = await pool.query(
    `
    SELECT
      reels.*,
      users.username,
      users.profile_picture
    FROM reels
    JOIN users
    ON reels.user_id = users.id
    ORDER BY reels.created_at DESC
    `
  );

  return result.rows;
};

// GET SINGLE REEL
const getSingleReel = async (id) => {

  const result = await pool.query(
    `
    SELECT * FROM reels
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// DELETE REEL
const deleteReel = async (id) => {

  await pool.query(
    `
    DELETE FROM reels
    WHERE id = $1
    `,
    [id]
  );
};

// LIKE REEL
const likeReel = async (reel_id, user_id) => {

  await pool.query(
    `
    INSERT INTO reel_likes
    (reel_id, user_id)
    VALUES ($1, $2)
    `,
    [reel_id, user_id]
  );

  await pool.query(
    `
    UPDATE reels
    SET likes_count = likes_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );
};

// COMMENT REEL
const commentReel = async (
  reel_id,
  user_id,
  comment
) => {

  await pool.query(
    `
    INSERT INTO reel_comments
    (
      reel_id,
      user_id,
      comment
    )
    VALUES ($1, $2, $3)
    `,
    [
      reel_id,
      user_id,
      comment
    ]
  );

  await pool.query(
    `
    UPDATE reels
    SET comments_count = comments_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );
};

// SAVE REEL
const saveReel = async (
  reel_id,
  user_id
) => {

  await pool.query(
    `
    INSERT INTO reel_saves
    (reel_id, user_id)
    VALUES ($1, $2)
    `,
    [
      reel_id,
      user_id
    ]
  );
};

// SHARE REEL
const shareReel = async (
  reel_id,
  user_id
) => {

  await pool.query(
    `
    INSERT INTO reel_shares
    (reel_id, user_id)
    VALUES ($1, $2)
    `,
    [
      reel_id,
      user_id
    ]
  );

  await pool.query(
    `
    UPDATE reels
    SET shares_count = shares_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );
};

// ADD VIEW
const addView = async (reel_id) => {

  await pool.query(
    `
    UPDATE reels
    SET views_count = views_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );
};

module.exports = {
  createReel,
  getAllReels,
  getSingleReel,
  deleteReel,
  likeReel,
  commentReel,
  saveReel,
  shareReel,
  addView
};