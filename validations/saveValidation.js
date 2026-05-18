const { z } = require("zod");

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
  postIdSchema,
  userIdSchema
};