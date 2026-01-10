const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post("/roles", roleController.createRole);
router.get("/AllRoles", roleController.getAllRoles);
router.get("/roles/:id", roleController.getRoleById);
router.put("/updateRole/:id", roleController.updateRole);
router.delete("/deleteRole/:id", roleController.deleteRole);

module.exports = router;