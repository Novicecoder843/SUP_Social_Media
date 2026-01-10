const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");

router.post("/createUsers", controller.createUsers);
router.get("/fatchAllUser", controller.fatchAllUser);
router.get("/fatchUser/:id", controller.fatchUserById);
router.put("/updateUser/:id", controller.updateUser);
router.delete("/deleteUser/:id", controller.deleteUser);

module.exports = router;