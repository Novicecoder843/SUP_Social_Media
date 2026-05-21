const { z } = require("zod");

// POST ID VALIDATION
const sharePostSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

module.exports = {
  sharePostSchema
};