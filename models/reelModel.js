const pool = require("../config/db");


// CREATE REEL
exports.createReel = async (data) => {

  const {
    user_id,
    caption,
    location_id,
    tagged_users,
    hashtags,
    audio_id,
    video_url,
    visibility,
  } = data;


  // GET TAGGED USERNAMES
  let taggedUserNames = [];

  if (
    Array.isArray(tagged_users) &&
    tagged_users.length > 0
  ) {

    const usersResult = await pool.query(
      `SELECT username
       FROM users
       WHERE id = ANY($1)`,
      [tagged_users]
    );

    taggedUserNames =
      usersResult.rows.map(
        user => user.username
      );
  }


  // GET HASHTAG NAMES
  let hashtagNames = [];

  if (
    Array.isArray(hashtags) &&
    hashtags.length > 0
  ) {

    const hashtagResult = await pool.query(
      `SELECT id, tag
       FROM hashtags
       WHERE id = ANY($1)`,
      [hashtags]
    );

    hashtagNames =
      hashtagResult.rows.map(
        tag => tag.tag
      );
  }


  // INSERT REEL
  const result = await pool.query(
    `INSERT INTO reels
    (
      user_id,
      caption,
      location_id,
      tagged_users,
      hashtags,
      audio_id,
      video_url,
      visibility
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      user_id,
      caption || null,
      location_id || null,

      // STORE USERNAMES
      JSON.stringify(taggedUserNames),

      // STORE HASHTAG NAMES
      JSON.stringify(hashtagNames),

      audio_id || null,
      video_url,
      visibility || "PUBLIC",
    ]
  );

  const reel = result.rows[0];


  // INSERT REEL_HASHTAGS RELATION
  if (
    Array.isArray(hashtags) &&
    hashtags.length > 0
  ) {

    for (const hashtag_id of hashtags) {

      await pool.query(
        `INSERT INTO reel_hashtags
        (
          reel_id,
          hashtag_id
        )
        VALUES ($1,$2)`,
        [reel.id, hashtag_id]
      );
    }
  }

  return await exports.getReelById(
    reel.id
  );
};



// GET ALL REELS
exports.getReels = async () => {

  const result = await pool.query(
    `SELECT
      r.id,
      r.caption,

      CONCAT(
        'http://localhost:3000/',
        r.video_url
      ) AS video_url,

      CONCAT(
        'http://localhost:3000/',
        r.thumbnail_url
      ) AS thumbnail_url,

      r.duration,
      r.visibility,

      COALESCE(r.views_count,0)
      AS views_count,

      COALESCE(r.likes_count,0)
      AS likes_count,

      COALESCE(r.comments_count,0)
      AS comments_count,

      COALESCE(r.shares_count,0)
      AS shares_count,

      r.created_at,
      r.updated_at,

      u.id AS user_id,
      u.username,

      CONCAT(
        'http://localhost:3000/',
        u.profile_image
      ) AS profile_image,

      COALESCE(
        r.tagged_users,
        '[]'
      ) AS tagged_users,

      COALESCE(
        r.hashtags,
        '[]'
      ) AS hashtags,

      COALESCE(
      (
        SELECT json_build_object(
          'id', a.id,
          'audio_name', a.audio_name,
          'singer_name', a.singer_name,
          'audio_url', a.audio_url
        )
        FROM audio a
        WHERE a.id = r.audio_id
      ),
      '{}'
      ) AS audio

     FROM reels r

     LEFT JOIN users u
     ON r.user_id = u.id

     ORDER BY r.created_at DESC`
  );

  return result.rows;
};



// GET SINGLE REEL
exports.getReelById = async (id) => {

  const result = await pool.query(
    `SELECT
      r.id,
      r.caption,

      CONCAT(
        'http://localhost:3000/',
        r.video_url
      ) AS video_url,

      CONCAT(
        'http://localhost:3000/',
        r.thumbnail_url
      ) AS thumbnail_url,

      r.duration,
      r.visibility,

      COALESCE(r.views_count,0)
      AS views_count,

      COALESCE(r.likes_count,0)
      AS likes_count,

      COALESCE(r.comments_count,0)
      AS comments_count,

      COALESCE(r.shares_count,0)
      AS shares_count,

      r.created_at,
      r.updated_at,

      u.id AS user_id,
      u.username,

      CONCAT(
        'http://localhost:3000/',
        u.profile_image
      ) AS profile_image,

      COALESCE(
        r.tagged_users,
        '[]'
      ) AS tagged_users,

      COALESCE(
        r.hashtags,
        '[]'
      ) AS hashtags,

      COALESCE(
      (
        SELECT json_build_object(
          'id', a.id,
          'audio_name', a.audio_name,
          'singer_name', a.singer_name,
          'audio_url', a.audio_url
        )
        FROM audio a
        WHERE a.id = r.audio_id
      ),
      '{}'
      ) AS audio

     FROM reels r

     LEFT JOIN users u
     ON r.user_id = u.id

     WHERE r.id = $1`,
    [id]
  );

  return result.rows[0];
};



// UPDATE REEL
exports.updateReel = async (
  id,
  user_id,
  data
) => {

  const {
    caption,
    location_id,
    tagged_users,
    hashtags,
    audio_id,
    video_url,
    visibility,
  } = data;


  // GET TAGGED USERNAMES
  let taggedUserNames = [];

  if (
    Array.isArray(tagged_users) &&
    tagged_users.length > 0
  ) {

    const usersResult = await pool.query(
      `SELECT username
       FROM users
       WHERE id = ANY($1)`,
      [tagged_users]
    );

    taggedUserNames =
      usersResult.rows.map(
        user => user.username
      );
  }


  // GET HASHTAG NAMES
  let hashtagNames = [];

  if (
    Array.isArray(hashtags) &&
    hashtags.length > 0
  ) {

    const hashtagResult = await pool.query(
      `SELECT id, tag
       FROM hashtags
       WHERE id = ANY($1)`,
      [hashtags]
    );

    hashtagNames =
      hashtagResult.rows.map(
        tag => tag.tag
      );
  }


  // UPDATE REEL
  const result = await pool.query(
    `UPDATE reels
     SET
      caption = $1,
      location_id = $2,
      tagged_users = $3,
      hashtags = $4,
      audio_id = $5,
      video_url = COALESCE($6, video_url),
      visibility = $7,
      updated_at = NOW()
     WHERE id = $8
     AND user_id = $9
     RETURNING *`,
    [
      caption || null,
      location_id || null,

      JSON.stringify(taggedUserNames),

      JSON.stringify(hashtagNames),

      audio_id || null,
      video_url,
      visibility || "PUBLIC",
      id,
      user_id,
    ]
  );


  // DELETE OLD HASHTAGS
  await pool.query(
    `DELETE FROM reel_hashtags
     WHERE reel_id = $1`,
    [id]
  );


  // INSERT NEW HASHTAGS
  if (
    Array.isArray(hashtags) &&
    hashtags.length > 0
  ) {

    for (const hashtag_id of hashtags) {

      await pool.query(
        `INSERT INTO reel_hashtags
        (
          reel_id,
          hashtag_id
        )
        VALUES ($1,$2)`,
        [id, hashtag_id]
      );
    }
  }

  return await exports.getReelById(id);
};



// DELETE REEL
exports.deleteReel = async (
  id,
  user_id
) => {

  const result = await pool.query(
    `DELETE FROM reels
     WHERE id = $1
     AND user_id = $2
     RETURNING *`,
    [id, user_id]
  );

  return result.rows[0];
};



// LIKE REEL
exports.likeReel = async (
  user_id,
  reel_id
) => {

  await pool.query(
    `INSERT INTO reel_likes
    (
      user_id,
      reel_id
    )
    VALUES ($1,$2)
    ON CONFLICT DO NOTHING`,
    [user_id, reel_id]
  );

  await pool.query(
    `UPDATE reels
     SET likes_count =
     likes_count + 1
     WHERE id = $1`,
    [reel_id]
  );
};



// UNLIKE REEL
exports.unlikeReel = async (
  user_id,
  reel_id
) => {

  await pool.query(
    `DELETE FROM reel_likes
     WHERE user_id = $1
     AND reel_id = $2`,
    [user_id, reel_id]
  );

  await pool.query(
    `UPDATE reels
     SET likes_count =
     GREATEST(likes_count - 1,0)
     WHERE id = $1`,
    [reel_id]
  );
};



// ADD COMMENT
exports.addComment = async ({
  user_id,
  reel_id,
  comment_text,
}) => {

  const result = await pool.query(
    `INSERT INTO comments
    (
      user_id,
      reel_id,
      comment_text
    )
    VALUES ($1,$2,$3)
    RETURNING *`,
    [
      user_id,
      reel_id,
      comment_text
    ]
  );

  await pool.query(
    `UPDATE reels
     SET comments_count =
     comments_count + 1
     WHERE id = $1`,
    [reel_id]
  );

  return result.rows[0];
};



// SHARE REEL
exports.shareReel = async ({
  sender_id,
  receiver_id,
  reel_id
}) => {

  await pool.query(
    `INSERT INTO reel_shares
    (
      sender_id,
      receiver_id,
      reel_id
    )
    VALUES ($1,$2,$3)`,
    [
      sender_id,
      receiver_id,
      reel_id
    ]
  );

  await pool.query(
    `UPDATE reels
     SET shares_count =
     shares_count + 1
     WHERE id = $1`,
    [reel_id]
  );
};



// ADD VIEW
exports.addView = async (
  reel_id
) => {

  await pool.query(
    `UPDATE reels
     SET views_count =
     views_count + 1
     WHERE id = $1`,
    [reel_id]
  );
};



// GET REEL AUDIO
exports.getReelAudio = async (
  reel_id
) => {

  const result = await pool.query(
    `SELECT
      a.*
     FROM reels r
     LEFT JOIN audio a
     ON r.audio_id = a.id
     WHERE r.id = $1`,
    [reel_id]
  );

  return result.rows[0] || {};
};



// UPDATE COMMENT COUNT
exports.updateCommentCount = async (
  reel_id,
  type
) => {

  const operator =
    type === "inc" ? "+" : "-";

  await pool.query(
    `UPDATE reels
     SET comments_count =
     comments_count ${operator} 1
     WHERE id = $1`,
    [reel_id]
  );
};