const { z } = require("zod");

// ADD HASHTAGS
const addHashtagSchema = z.object({

  hashtags: z
    .array(z.string())
    .min(1, "At least one hashtag is required")

});

// POST ID PARAM VALIDATION
const postIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

// HASHTAG PARAM VALIDATION
const tagSchema = z.object({

  tag: z
    .string()
    .min(1, "Hashtag is required")

});

module.exports = {
  addHashtagSchema,
  postIdSchema,
  tagSchema
};