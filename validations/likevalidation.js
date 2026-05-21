const { z } = require("zod");

// POST ID VALIDATION
const postIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

// LIKE COUNT POST ID
const likesCountSchema = z.object({

  postId: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

module.exports = {
  postIdSchema,
  likesCountSchema
};