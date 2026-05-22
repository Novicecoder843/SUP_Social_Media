const { z } = require("zod");
// ==========STORY==========================
const createStorySchema = z.object({
  caption: z.string().optional(),

  visibility: z
    .enum(["public", "followers", "close_friends"])
    .optional(),
});

// Feed stories
const feedStoriesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

// User stories
const userStoriesSchema = z.object({
  userId: z.string(),
});

// Single story
const storyIdSchema = z.object({
//   storyId: z.string(),
});
// ================= STORY REACTION =================
// ADD REACTION
const addReactionSchema = z.object({
  storyId: z.string(),

  reaction: z.enum([
    "like",
    "love",
    "haha",
    "wow",
    "sad",
    "fire",
    "heart",
  ]),
});

// GET REACTIONS
const getReactionSchema = z.object({
  storyId: z.string(),
});
// ================= STORY REPLIES =================
// ADD REPLY
const addReplySchema = z.object({
  storyId: z.string(),

  message: z
    .string()
    .min(1, "Reply message is required")
    .max(500, "Message too long"),
});

// GET REPLIES
const getRepliesSchema = z.object({
  storyId: z.string(),
});
// =============STORY HIGHLIGHT=============
// CREATE HIGHLIGHT
const createHighlightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cover_url: z.string().url().optional(),
});

// GET USER HIGHLIGHTS
const userIdSchema = z.object({
  userId: z.string(),
});

// ADD STORY TO HIGHLIGHT
const addStoryToHighlightSchema = z.object({
  highlightId: z.string(),
  // storyId: z.string(),
    storyId: z.coerce.number(),
});

// REMOVE STORY FROM HIGHLIGHT
const removeStoryFromHighlightSchema = z.object({
  highlightId: z.string(),
  storyId: z.string(),
});

// DELETE HIGHLIGHT
const highlightIdSchema = z.object({
  highlightId: z.string(),
});
// ADD / REMOVE CLOSE FRIEND
const friendIdSchema = z.object({
  friendId: z.coerce.number(),
});

module.exports = {
  createStorySchema,
 feedStoriesSchema,
  userStoriesSchema,
 storyIdSchema,
 addReactionSchema,
  getReactionSchema,
  addReplySchema,
  getRepliesSchema,
  createHighlightSchema,
  userIdSchema,
  addStoryToHighlightSchema,
  removeStoryFromHighlightSchema,
  highlightIdSchema,
  friendIdSchema,
};