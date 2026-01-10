const User = require('../models/user.model');

// CREATE
// ============================================
exports.createUser = async (req, res) => {
  try {
    const result = await User.createUser(req.body);
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL
// =================================================
exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.getAllUsers();
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE
// ===========================================
exports.getUserById = async (req, res) => {
  try {
    const result = await User.getUserById(req.params.id);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
// ============================================
exports.updateUser = async (req, res) => {
  try {
    const result = await User.updateUser(req.params.id, req.body);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
// ===========================================
exports.deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
