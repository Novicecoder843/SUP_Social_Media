const { z } = require("zod");

// SAFE JSON PARSE helper
const safeJsonParse = (val, fallback = []) => {
  if (!val) return fallback;

  try {
    return JSON.parse(val);
  } catch (err) {
    return fallback;
  }
};

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long")
    .trim(),

  visibility: z.enum(["public", "private", "friends"]).optional(),

  allow_comments: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  allow_share: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  location_id: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),

  hashtags: z
    .string()
    .optional()
    .transform((val) => safeJsonParse(val, [])),

  tagged_users: z
    .string()
    .optional()
    .transform((val) => safeJsonParse(val, []))
});

const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long")
    .trim()
    .optional(),

  visibility: z
    .enum(["public", "private", "friends"])
    .optional(),

  allow_comments: z
    .string()
    .optional()
    .transform((val) => (val === "true")),

  allow_share: z
    .string()
    .optional()
    .transform((val) => (val === "true")),

  location_id: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),

  hashtags: z
    .string()
    .optional()
    .transform((val) => safeJsonParse(val, [])),

  tagged_users: z
    .string()
    .optional()
    .transform((val) => safeJsonParse(val, []))
});

const postIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Invalid post id")
    .transform((val) => Number(val))
});
const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Invalid user id")
    .transform((val) => Number(val))
});

module.exports = {
  createPostSchema,
  updatePostSchema,
postIdSchema,
userIdSchema
};