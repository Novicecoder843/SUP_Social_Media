// router.post("/createUsers", controller.createUsers);
// router.get("/fatchAllUser", controller.fatchAllUser);
// router.get("/fatchUser/:id", controller.fatchUserById);
// router.put("/updateUser/:id", controller.updateUser);
// router.delete("/deleteUser/:id", controller.deleteUser);

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const userController = require("../controller/userController");

router.post("/register", userController.registerUser);
router.get("/users", userController.getAllUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
module.exports = router;