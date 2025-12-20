require("dotenv").config();
 const pool=require('./config/db');

 const express=require('express');
    const app=express();
    app.use(express.json());  
    
 app.post("/createuser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, password]
    );

    console.log("User Created:");
    console.table(result.rows);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create User Error", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});
app.put("/updateuser/:id", async (req, res) => {
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

    console.table(result.rows);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update User Error", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.delete("/deleteuser/:id", async (req, res) => {
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
    console.error("Delete User Error", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
})

app.get("/getalluser", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id"
    );

    console.table(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Get All Users Error", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/getsingleuser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.table(result.rows);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get User Error ", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

port=3000

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
