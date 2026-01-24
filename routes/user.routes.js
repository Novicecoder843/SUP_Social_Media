const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controller/user.controller");
const {
	createUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getSingleUser,
} = controller;

router.post("/createuser", createUser);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/getalluser", getAllUsers);
router.get("/getsingleuser/:id", getSingleUser);

router.get("/me", auth, controller.getMe);
router.put("/me", auth, controller.updateMe);
router.get("/:id", controller.getUserById);

router.post("/follow/:id", auth, controller.followUser);
router.post("/unfollow/:id", auth, controller.unfollowUser);
router.post("/block/:id", auth, controller.blockUser);

module.exports = router;