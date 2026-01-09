
const UserModel = require("../model/user.model");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const userResult = await UserModel.createUser({
      name,
      email,
      password,
      mobile
    });

    res.status(201).json({
      data: userResult,
      success: true,
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const userResult = await UserModel.updateUser(id, { name, email });

    res.status(200).json({
      data: userResult,
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await UserModel.deleteUser(id);

    res.status(200).json({
      data: userResult,
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();

    res.status(200).json({
      data: users,
      success: true,
      message: "Users fetched successfully"
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.getSingleUser(id);

    res.status(200).json({
      data: user,
      success: true,
      message: "User fetched successfully"
    });
  } catch (error) {
    console.error("Get Single User Error:", error);
    res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};
