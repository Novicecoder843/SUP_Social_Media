const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const authMiddleware = require("../middleware/authMiddleware");
const Validation = require("../middleware/validate");

const {
    createRoleSchema,
    updateRoleSchema,
    roleIdSchema
} = require("../validations/roleValidation");

// router.post("/", authMiddleware, roleController.createRole);
// router.get("/", authMiddleware, roleController.getRoles);

router.post("/", Validation(createRoleSchema), roleController.createRole);
router.get("/getallrole", roleController.getAllRoles);
router.put("/updateRole/:id", Validation(updateRoleSchema), roleController.updateRole);
router.delete("/deleteRole/:id",Validation(roleIdSchema), roleController.deleteRole);

 module.exports = router;