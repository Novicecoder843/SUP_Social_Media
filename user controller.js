const UserModel = require('../model/userModel');

/* =========================
   GET USERS
========================= */
exports.getUser = async (req, res) => {
  try {
    const userResult = await UserModel.getUserData();

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({
        data: [],
        success: false,
        message: "Users not found"
      });
    }

    return res.status(200).json({
      data: userResult,
      success: true,
      message: "Users fetched successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   CREATE USER
========================= */
exports.createUser = async (req, res) => {
  try {
    const { email, password, mobile, name, first_name, last_name, city } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: [],
        success: false,
        message: "Email and password are required"
      });
    }

    const userResult = await UserModel.createUser({
      email,
      password,
      mobile,
      name,
      first_name,
      last_name,
      city
    });

    return res.status(201).json({
      data: userResult,
      success: true,
      message: "User created successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: [],
      success: false,
      message: "Internal server error"
    });
  }
};
