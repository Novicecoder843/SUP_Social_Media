const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const authMiddleware = require("../middleware/authMiddleware");

// router.post("/", authMiddleware, roleController.createRole);
// router.get("/", authMiddleware, roleController.getRoles);

router.post("/roles", roleController.createRole);
router.get("/AllRoles", roleController.getAllRoles);
router.put("/updateRole/:id", roleController.updateRole);
router.delete("/deleteRole/:id", roleController.deleteRole);

 module.exports = router;


