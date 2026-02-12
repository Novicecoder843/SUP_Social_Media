const bcrypt = require("bcrypt");
const User = require("../model/user.model");

/* ================= CREATE USER ================= */
async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= GET ALL USERS ================= */
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


/* ================= GET USER BY ID ================= */
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


let subarat = [  1,2,3]
/* ================= UPDATE USER ================= */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    console.log(username, email, role )
    const user = await User.updateUser(id, {username,email,role});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= DELETE USER ================= */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const deleted = await User.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
