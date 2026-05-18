const { z } = require("zod");

// REGISTER
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

// LOGIN
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password required"),
});

// FORGOT PASSWORD
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),
});

// RESET PASSWORD
const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Token required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};