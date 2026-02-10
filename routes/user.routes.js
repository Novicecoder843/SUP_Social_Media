const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

// CREATE
router.post("/users", createUser);

// READ
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

// UPDATE
router.put("/users/:id", updateUser);

// DELETE
router.delete("/users/:id", deleteUser);

module.exports = router;
