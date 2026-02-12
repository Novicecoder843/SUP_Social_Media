const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

// CREATE USER
router.post("/", createUser);

// GET ALL USERS
router.get("/", getAllUsers);

// GET USER BY ID
router.get("/:id", getUserById);

// UPDATE USER
router.put("/updateuser/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

module.exports = router;
