const User = require("../models/userModels");

/* CREATE USER */
exports.createUsers = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* FETCH ALL USERS */
exports.fatchAllUser = async (req, res) => {
  try {
    const result = await User.findAll();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* FETCH USER BY ID */
exports.fatchUserById = async (req, res) => {
  try {
    const result = await User.findById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE USER */
exports.updateUser = async (req, res) => {
  try {
    const result = await User.updateById(req.params.id, req.body);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  try {
    await User.deleteById(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};