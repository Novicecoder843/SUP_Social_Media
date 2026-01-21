// const User = require("../models/userModels");

// /* CREATE USER */
// exports.createUsers = async (req, res) => {
//   try {
//     const result = await User.create(req.body);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* FETCH ALL USERS */
// exports.fatchAllUser = async (req, res) => {
//   try {
//     const result = await User.findAll();
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* FETCH USER BY ID */
// exports.fatchUserById = async (req, res) => {
//   try {
//     const result = await User.findById(req.params.id);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* UPDATE USER */
// exports.updateUser = async (req, res) => {
//   try {
//     const result = await User.updateById(req.params.id, req.body);
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* DELETE USER */
// exports.deleteUser = async (req, res) => {
//   try {
//     await User.deleteById(req.params.id);
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const UserModel = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const user = await UserModel.createUser(name, email, password, role_id);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id } = req.body;
    const user = await UserModel.updateUser(id, name, email, role_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.deleteUser(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};