const pool = require("../config/db");

exports.createReel = async (data) => {
  const {
    user_id,
    caption,
    video_url,
    thumbnail_url,
    duration,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO reels
    (user_id, caption, video_url, thumbnail_url, duration)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [user_id, caption, video_url, thumbnail_url, duration]
  );

  return result.rows[0];
};

exports.getAllReels = async () => {
  const result = await pool.query(`
    SELECT reels.*, users.username, users.profile_image
    FROM reels
    JOIN users ON reels.user_id = users.id
    ORDER BY reels.created_at DESC
  `);

  return result.rows;
};

exports.getSingleReel = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM reels
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

exports.deleteReel = async (id) => {
  await pool.query(
    `
    DELETE FROM reels
    WHERE id = $1
    `,
    [id]
  );
};

exports.likeReel = async (user_id, reel_id) => {

  const result = await pool.query(
    `
    INSERT INTO reel_likes
    (user_id, reel_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [user_id, reel_id]
  );

  await pool.query(
    `
    UPDATE reels
    SET likes_count = likes_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );

  return result.rows[0];
};

exports.commentReel = async (
  user_id,
  reel_id,
  comment_text,
  parent_id
) => {

  const result = await pool.query(
    `
    INSERT INTO reel_comments
    (user_id, reel_id, comment_text, parent_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      user_id,
      reel_id,
      comment_text,
      parent_id || null
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

  return result.rows[0];
};

exports.saveReel = async (user_id, reel_id) => {

  const result = await pool.query(
    `
    INSERT INTO reel_saved
    (user_id, reel_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [user_id, reel_id]
  );

  return result.rows[0];
};

exports.shareReel = async (
  sender_id,
  receiver_id,
  reel_id
) => {

  const result = await pool.query(
    `
    INSERT INTO reel_shares
    (sender_id, receiver_id, reel_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      sender_id,
      receiver_id,
      reel_id
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

  return result.rows[0];
};

exports.viewReel = async (
  user_id,
  reel_id,
  watched_seconds
) => {

  const result = await pool.query(
    `
    INSERT INTO reel_views
    (user_id, reel_id, watched_seconds)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      user_id,
      reel_id,
      watched_seconds || 0
    ]
  );

  await pool.query(
    `
    UPDATE reels
    SET views_count = views_count + 1
    WHERE id = $1
    `,
    [reel_id]
  );

  return result.rows[0];
};

exports.addHashtags = async (reel_id, tags) => {

  const addedTags = [];

  for (const tag of tags) {

    // check hashtag exists
    let hashtag = await pool.query(
      `
      SELECT * FROM hashtags
      WHERE tag = $1
      `,
      [tag]
    );

    let hashtag_id;

    // create if not exists
    if (hashtag.rows.length === 0) {

      const newTag = await pool.query(
        `
        INSERT INTO hashtags (tag)
        VALUES ($1)
        RETURNING *
        `,
        [tag]
      );

      hashtag_id = newTag.rows[0].id;

    } else {

      hashtag_id = hashtag.rows[0].id;
    }

    // connect reel + hashtag
    await pool.query(
      `
      INSERT INTO reel_hashtags
      (reel_id, hashtag_id)
      VALUES ($1, $2)
      `,
      [reel_id, hashtag_id]
    );

    addedTags.push({
      reel_id,
      hashtag_id,
      tag
    });
  }

  return addedTags;
};

exports.getReelHashtags = async (reel_id) => {

  const result = await pool.query(
    `
    SELECT
      hashtags.id,
      hashtags.tag
    FROM reel_hashtags
    JOIN hashtags
    ON reel_hashtags.hashtag_id = hashtags.id
    WHERE reel_hashtags.reel_id = $1
    `,
    [reel_id]
  );

  return result.rows;
};