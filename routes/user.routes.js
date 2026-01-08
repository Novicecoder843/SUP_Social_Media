const express = require("express");
const router = express.Router();
const {
	createUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getSingleUser,
} = require("../controller/user.controller");

router.post("/createuser", createUser);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/getalluser", getAllUsers);
router.get("/getsingleuser/:id", getSingleUser);

module.exports = router;