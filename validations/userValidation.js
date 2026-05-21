const { z } = require("zod");

// REGISTER USER
const registerUserSchema = z.object({

  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")

});

// UPDATE USER
const updateUserSchema = z.object({

  username: z
    .string()
    .min(3)
    .optional(),

  bio: z
    .string()
    .max(300)
    .optional(),

  website: z
    .string()
    .optional(),

  gender: z
    .enum(["male", "female", "other"])
    .optional()

});

// USER ID PARAMS
const userIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid user id")

});

// USERNAME PARAMS
const usernameSchema = z.object({

  username: z
    .string()
    .min(3, "Invalid username")

});

module.exports = {
  registerUserSchema,
  updateUserSchema,
  userIdSchema,
  usernameSchema
};