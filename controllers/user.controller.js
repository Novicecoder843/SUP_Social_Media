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