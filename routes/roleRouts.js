const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const auth = require("../middleware/authMiddleware");



router.post("/roles", roleController.createRole);
router.get("/AllRoles", roleController.getAllRoles);
router.put("/updateRole/:id", roleController.updateRole);
router.delete("/deleteRole/:id", roleController.deleteRole);

module.exports = router;