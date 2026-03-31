const pool = require("../config/db");
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id,email,role_id FROM users WHERE id=$1",
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const userService = require("../services/user.service");

exports.getMe = async (req, res) => {
  try {
    const data = await userService.getMe(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const data = await userService.updateMe(req.user.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const data = await userService.getUserById(
      req.user?.id || 0,
      req.params.id
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const data = await userService.follow(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const data = await userService.unfollow(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.block = async (req, res) => {
  try {
    const data = await userService.block(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateProfileImage = async (req, res) => {
  try {

    console.log("FILE:", req.file);

   if(!req.file){
    return res.status(400).json({ error: "No file uploaded" });
   }
   const imageUrl = req.file.location;

    res.json({
      message: "Profile image updated",
      image: imageUrl,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
