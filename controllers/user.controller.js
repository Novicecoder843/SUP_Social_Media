const pool = require("../config/db");
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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imagePath = req.file.key;
   await pool.query(
  `INSERT INTO user_profiles(user_id, profile_image)
   VALUES($1,$2)
   ON CONFLICT (user_id)
   DO UPDATE SET profile_image=$2`,
  [req.user.id, imagePath]
);
const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imagePath}`;
    res.json({
      message: "Profile image updated",
      image: imageUrl,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
