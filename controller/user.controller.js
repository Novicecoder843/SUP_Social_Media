const pool = require("../config/db");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, password]
  );

  res.status(201).json(result.rows[0]);
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND deleted_at IS NULL
       RETURNING *`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Updated:");
    console.table(result.rows);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update User Error:", error);
     res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Deleted:");
    console.table(result.rows);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id"
    );

    console.log("All Users:");
    console.table(result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Single User:");
    console.table(result.rows);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};