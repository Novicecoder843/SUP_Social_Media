const db = require("../config/db");

/////////////////////////////////////////////////////
// CREATE STORY
/////////////////////////////////////////////////////
exports.createStory = async (
  user_id,
  media_url,
  media_type,
  caption
) => {

  console.log("INSERT VALUES =>", {
    user_id,
    media_url,
    media_type,
    caption
  });

  const result = await db.query(
    `
    INSERT INTO stories
    (
      user_id,
      media_url,
      media_type,
      caption,
      expires_at
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      NOW() + INTERVAL '24 HOURS'
    )
    RETURNING *
    `,
    [
      user_id,
      media_url,
      media_type,
      caption
    ]
  );

  console.log("DB RESULT =>", result.rows);

  return result.rows[0];
};
/////////////////////////////////////////////////////
// GET ALL ACTIVE STORIES
/////////////////////////////////////////////////////
exports.getAllStories = async () => {

  const result = await db.query(
    `
    SELECT
      s.*,
      u.name
    FROM stories s
    JOIN users u
      ON u.id = s.user_id

    WHERE s.expires_at > NOW()

    ORDER BY s.created_at DESC
    `
  );

  return result.rows;
};

/////////////////////////////////////////////////////
// VIEW STORY
/////////////////////////////////////////////////////
exports.addView = async (
  story_id,
  viewer_id
) => {

  await db.query(
    `
    INSERT INTO story_views
    (
      story_id,
      viewer_id
    )
    VALUES ($1,$2)

    ON CONFLICT
    (
      story_id,
      viewer_id
    )
    DO NOTHING
    `,
    [story_id, viewer_id]
  );
};

/////////////////////////////////////////////////////
// LIKE STORY
/////////////////////////////////////////////////////
exports.likeStory = async (
  story_id,
  user_id
) => {

  await db.query(
    `
    INSERT INTO story_likes
    (
      story_id,
      user_id
    )
    VALUES ($1,$2)

    ON CONFLICT
    (
      story_id,
      user_id
    )
    DO NOTHING
    `,
    [story_id, user_id]
  );
};

/////////////////////////////////////////////////////
// REPLY STORY
/////////////////////////////////////////////////////
exports.replyStory = async (
  story_id,
  sender_id,
  message
) => {

  const result = await db.query(
    `
    INSERT INTO story_replies
    (
      story_id,
      sender_id,
      message
    )
    VALUES ($1,$2,$3)

    RETURNING *
    `,
    [
      story_id,
      sender_id,
      message
    ]
  );

  return result.rows[0];
};

/////////////////////////////////////////////////////
// GET STORY VIEWERS
/////////////////////////////////////////////////////
exports.getStoryViewers = async (
  story_id
) => {

  const result = await db.query(
    `
    SELECT
      u.id,
      u.name,
      sv.viewed_at

    FROM story_views sv

    JOIN users u
      ON u.id = sv.viewer_id

    WHERE sv.story_id = $1

    ORDER BY sv.viewed_at DESC
    `,
    [story_id]
  );

  return result.rows;
};

/////////////////////////////////////////////////////
// DELETE STORY
/////////////////////////////////////////////////////
exports.deleteStory = async (
  story_id,
  user_id
) => {

  const result = await db.query(
    `
    DELETE FROM stories

    WHERE id = $1
    AND user_id = $2

    RETURNING *
    `,
    [story_id, user_id]
  );

  return result.rows[0];
};

/////////////////////////////////////////////////////
// GET USER STORIES
/////////////////////////////////////////////////////
exports.getUserStories = async (
  user_id
) => {

  const result = await db.query(
    `
    SELECT *
    FROM stories

    WHERE user_id = $1
    AND expires_at > NOW()

    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return result.rows;
};

