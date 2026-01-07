const UserModel = require("../models/userModels");

// CREATE SINGLE USER
exports.createUsers = async (req, res) => {
  try {
    const user = await UserModel.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE MULTIPLE USERS
exports.createMultipleUsers = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array"
      });
    }

    const users = await UserModel.createMultipleUsers(req.body);
    res.status(201).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// FETCH ALL USERS
exports.fatchAllUser = async (req, res) => {
  const users = await UserModel.fetchAllUser();
  res.json({
    success: true,
    count: users.length,
    data: users
  });
};

// FETCH USER BY ID
exports.fatchUserById = async (req, res) => {
  const user = await UserModel.fetchUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, data: user });
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  const user = await UserModel.updateUser(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, message: "User updated", data: user });
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const user = await UserModel.deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, message: "User deleted successfully" });
};
