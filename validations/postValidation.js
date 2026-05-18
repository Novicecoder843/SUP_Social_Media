const { z } = require("zod");

const createPostSchema = z.object({

  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long"),

  visibility: z
    .enum(["public", "private", "friends"])
    .optional(),

  allow_comments: z
    .string()
    .optional()
    .transform(val => val === "true"),

  location_id: z
    .string()
    .optional()
    .transform(val => Number(val)),

  hashtags: z
    .string()
    .optional()
    .transform(val => JSON.parse(val)),

  tagged_users: z
    .string()
    .optional()
    .transform(val => JSON.parse(val))

});

module.exports = {
  createPostSchema
};

// UPDATE POST
const updatePostSchema = z.object({

  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long")
    .optional(),

  visibility: z
    .enum(["public", "private", "friends"])
    .optional(),

  allow_comments: z
    .string()
    .optional()
    .transform(val => val === "true"),

  location_id: z
    .string()
    .optional()
    .transform(val => Number(val)),

  hashtags: z
    .string()
    .optional()
    .transform(val => JSON.parse(val)),

  tagged_users: z
    .string()
    .optional()
    .transform(val => JSON.parse(val))

});

// POST ID VALIDATION
const postIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

// USER ID VALIDATION
const userIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid user id")

});
module.exports = {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  userIdSchema
};