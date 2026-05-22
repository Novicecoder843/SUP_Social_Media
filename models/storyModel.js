const pool = require("../config/db");

const createStory = async ({
  user_id,
  media_url,
  media_type,
  caption,
  visibility,
}) => {
  const query = `
    INSERT INTO stories
    (user_id, media_url, media_type, caption, visibility)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    user_id,
    media_url,
    media_type,
    caption,
    visibility,
  ];
  console.log(values, "values");

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getFeedStories = async (userId) => {
  const query = `
    SELECT s.*, u.username
    FROM stories s
    JOIN users u ON s.user_id = u.id
    WHERE s.expires_at > NOW()
    ORDER BY s.created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getUserStories = async (userId) => {
  const query = `
    SELECT *
    FROM stories
    WHERE user_id = $1
    AND expires_at > NOW()
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const getStoryById = async (storyId) => {
  const query = `
    SELECT *
    FROM stories
    WHERE id = $1;
  `;

  const result = await pool.query(query, [storyId]);

  return result.rows[0];
};

const addStoryView = async (storyId, viewerId) => {
  const query = `
    INSERT INTO story_views (story_id, viewer_id)
    VALUES ($1, $2)
    ON CONFLICT (story_id, viewer_id)
    DO NOTHING;
  `;

  await pool.query(query, [storyId, viewerId]);
};

const getStoryViews = async (storyId) => {
  const query = `
    SELECT sv.*, u.username
    FROM story_views sv
    JOIN users u ON sv.viewer_id = u.id
    WHERE sv.story_id = $1
    ORDER BY sv.viewed_at DESC;
  `;

  const result = await pool.query(query, [storyId]);

  return result.rows;
};

const deleteStory = async (storyId, userId) => {
  const query = `
    DELETE FROM stories
    WHERE id = $1
    AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [storyId, userId]);

  return result.rows[0];
};

// ADD REACTION
const addReaction = async ({
  story_id,
  user_id,
  reaction,
}) => {

  // CHECK EXISTING REACTION
  const existingQuery = `
    SELECT *
    FROM story_reactions
    WHERE story_id = $1
    AND user_id = $2;
  `;

  const existingResult = await pool.query(
    existingQuery,
    [story_id, user_id]
  );

  // UPDATE EXISTING REACTION
  if (existingResult.rows.length > 0) {

    const updateQuery = `
      UPDATE story_reactions
      SET reaction = $1
      WHERE story_id = $2
      AND user_id = $3
      RETURNING *;
    `;

    const updateResult = await pool.query(
      updateQuery,
      [reaction, story_id, user_id]
    );

    return updateResult.rows[0];
  }

  // INSERT NEW REACTION
  const query = `
    INSERT INTO story_reactions
    (story_id, user_id, reaction)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    story_id,
    user_id,
    reaction,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// GET STORY REACTIONS
const getStoryReactions = async (storyId) => {

  const query = `
    SELECT
      sr.*,
      u.username
    FROM story_reactions sr
    JOIN users u
    ON sr.user_id = u.id
    WHERE sr.story_id = $1
    ORDER BY sr.created_at DESC;
  `;

  const result = await pool.query(query, [storyId]);

  return result.rows;
};
// DELETE REACTION
const deleteReaction = async (
  storyId,
  userId
) => {

  const query = `
    DELETE FROM story_reactions
    WHERE story_id = $1
    AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(
    query,
    [storyId, userId]
  );

  return result.rows[0];
};

// ADD REPLY
const addReply = async ({
  story_id,
  sender_id,
  message,
}) => {

  const query = `
    INSERT INTO story_replies
    (story_id, sender_id, message)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    story_id,
    sender_id,
    message,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// GET STORY REPLIES
const getStoryReplies = async (storyId) => {

  const query = `
    SELECT
      sr.*,
      u.username
    FROM story_replies sr
    JOIN users u
    ON sr.sender_id = u.id
    WHERE sr.story_id = $1
    ORDER BY sr.created_at DESC;
  `;

  const result = await pool.query(query, [storyId]);

  return result.rows;
};
// DELETE REPLY
const deleteReply = async (
  replyId,
  userId
) => {

  const query = `
    DELETE FROM story_replies
    WHERE id = $1
    AND sender_id = $2
    RETURNING *;
  `;

  const result = await pool.query(
    query,
    [replyId, userId]
  );

  return result.rows[0];
};

// CREATE HIGHLIGHT
const createHighlight = async ({ user_id, title, cover_url }) => {
  const query = `
    INSERT INTO story_highlights (user_id, title, cover_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [user_id, title, cover_url];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// GET USER HIGHLIGHTS
const getUserHighlights = async (userId) => {
  const query = `
    SELECT *
    FROM story_highlights
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

// GET SINGLE HIGHLIGHT WITH STORIES
const getHighlightById = async (highlightId) => {
  const query = `
    SELECT 
      h.*,
      json_agg(
        json_build_object(
          'story_id', s.id,
          'media_url', s.media_url,
          'media_type', s.media_type
        )
      ) AS stories
    FROM story_highlights h
    LEFT JOIN story_highlight_items hi
      ON h.id = hi.highlight_id
    LEFT JOIN stories s
      ON hi.story_id = s.id
    WHERE h.id = $1
    GROUP BY h.id;
  `;

  const result = await pool.query(query, [highlightId]);
  return result.rows[0];
};

// ADD STORY TO HIGHLIGHT
const addStoryToHighlight = async ({ highlight_id, story_id }) => {
  const query = `
    INSERT INTO story_highlight_items (highlight_id, story_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [highlight_id, story_id]);
  return result.rows[0];
};

// REMOVE STORY FROM HIGHLIGHT
const removeStoryFromHighlight = async ({ highlightId, storyId }) => {
  const query = `
    DELETE FROM story_highlight_items
    WHERE highlight_id = $1 AND story_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [highlightId, storyId]);
  return result.rows[0];
};

// DELETE HIGHLIGHT
const deleteHighlight = async (highlightId) => {
  const query = `
    DELETE FROM story_highlights
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [highlightId]);
  return result.rows[0];
};
// ADD CLOSE FRIEND
const addCloseFriend = async (userId, friendId) => {
  const query = `
    INSERT INTO close_friends (user_id, friend_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, friend_id) DO NOTHING
    RETURNING *;
  `;

  const result = await pool.query(query, [userId, friendId]);
  return result.rows[0];
};

// REMOVE CLOSE FRIEND
const removeCloseFriend = async (userId, friendId) => {
  const query = `
    DELETE FROM close_friends
    WHERE user_id = $1 AND friend_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [userId, friendId]);
  return result.rows[0];
};

// GET CLOSE FRIENDS LIST
const getCloseFriends = async (userId) => {
  const query = `
    SELECT cf.friend_id, u.username, u.email
    FROM close_friends cf
    JOIN users u ON cf.friend_id = u.id
    WHERE cf.user_id = $1
    ORDER BY cf.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createStory,
  getFeedStories,
  getUserStories,
  getStoryById,
  addStoryView,
  getStoryViews,
  deleteStory,
  addReaction,
  getStoryReactions,
  deleteReaction,
   addReply,
  getStoryReplies,
  deleteReply,
  createHighlight,
  getUserHighlights,
  getHighlightById,
  addStoryToHighlight,
  removeStoryFromHighlight,
  deleteHighlight,
  addCloseFriend,
  removeCloseFriend,
  getCloseFriends,
};