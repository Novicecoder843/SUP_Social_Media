const { z } = require("zod");

// ADD COMMENT
const addCommentSchema = z.object({

  content: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment too long")

});

// ADD REPLY
const addReplySchema = z.object({

  comment_id: z
    .number({
      invalid_type_error: "Comment id must be number"
    }),

  content: z
    .string()
    .min(1, "Reply is required")
    .max(500, "Reply too long")

});

// UPDATE COMMENT
const updateCommentSchema = z.object({

  content: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment too long")

});

// POST ID VALIDATION
const postIdSchema = z.object({

  postId: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

// COMMENT ID VALIDATION
const commentIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid comment id")

});

// UPDATE COMMENT ID
const updateCommentIdSchema = z.object({

  commentId: z
    .string()
    .regex(/^\d+$/, "Invalid comment id")

});

module.exports = {
  addCommentSchema,
  addReplySchema,
  updateCommentSchema,
  postIdSchema,
  commentIdSchema,
  updateCommentIdSchema
};