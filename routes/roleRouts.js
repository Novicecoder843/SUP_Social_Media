const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const auth = require("../middleware/authMiddleware");



router.post("/roles",auth, roleController.createRole);
router.get("/AllRoles",auth, roleController.getAllRoles);
// router.get("/roles/:id",auth, roleController.getAllRoles);
router.put("/updateRole/:id",auth, roleController.updateRole);
router.delete("/deleteRole/:id",auth, roleController.deleteRole);

module.exports = router;