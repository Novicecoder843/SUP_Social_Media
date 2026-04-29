const pool = require("../config/db");

exports.getFeed = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feed" });
  }
};