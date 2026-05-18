const { z } = require("zod");

// UPLOAD MEDIA
const uploadMediaSchema = z.object({

  post_id: z
    .string()
    .regex(/^\d+$/, "Invalid post id"),

  media_type: z
    .enum(["image", "video"], {
      message: "Media type must be image or video"
    })

});

// POST ID VALIDATION
const postIdSchema = z.object({

  postId: z
    .string()
    .regex(/^\d+$/, "Invalid post id")

});

// MEDIA ID VALIDATION
const mediaIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid media id")

});

module.exports = {
  uploadMediaSchema,
  postIdSchema,
  mediaIdSchema
};