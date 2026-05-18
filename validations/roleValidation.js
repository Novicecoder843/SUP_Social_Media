const { z } = require("zod");

// CREATE ROLE
const createRoleSchema = z.object({

  name: z
    .string()
    .min(2, "Role name is required")
    .max(50, "Role name too long")

});

// UPDATE ROLE
const updateRoleSchema = z.object({

  name: z
    .string()
    .min(2, "Role name is required")
    .max(50, "Role name too long")

});

// ROLE ID VALIDATION
const roleIdSchema = z.object({

  id: z
    .string()
    .regex(/^\d+$/, "Invalid role id")

});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  roleIdSchema
};