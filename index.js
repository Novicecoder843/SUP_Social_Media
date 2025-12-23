const express = require("express");
// const Client = require("./db");
const con = require("./db");
const bodyParser = require("body-parser");
// const { result, Connection } = require("pg");
const app = express()
app.use(express.json())


// app.post("/Create_User", async (req, res) => {

//   try {
//     const { username,
//       email,
//       password_hash,
//       full_name,
//       phone_number,
//       gender,
//       date_of_birth,
//       bio,
//       profile_picture,
//     } = req.body
//     const insert_quary = `INSERT INTO user_schema.users (username,email,password_hash,full_name,phone_number,gender,date_of_birth,bio,profile_picture,) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`
//     const result = await connection.query(insert_quary, [username, email, password_hash, full_name, phone_number, gender, date_of_birth, bio, profile_picture]);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

// });

app.post("/createUser", async (req, res) => {
  try {
    const {
      username,
      email,
      password_hash,
      full_name,
      phone_number,
      gender,
      date_of_birth,
      bio,
      profile_picture
    } = req.body;

    const result = await con.query(
      `INSERT INTO user_schema.users
      (username, email, password_hash, full_name, phone_number, gender, date_of_birth, bio, profile_picture)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [username, email, password_hash, full_name, phone_number, gender, date_of_birth, bio, profile_picture]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/allUser", async (req, res) => {
  try {
    const result = await con.query(
      "SELECT * FROM user_schema.users "
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/fatchUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await con.query(
      "SELECT * FROM user_schema.users WHERE user_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "user not found"
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      erroe: err.message
    });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password_hash,
      full_name,
      phone_number,
      gender,
      date_of_birth,
      bio,
      profile_picture,
      is_active
    } = req.body;

    const result = await con.query(
      `UPDATE user_schema.users SET
      username = $1, 
      email =$2 , 
      password_hash = $3 , 
      full_name = $4 , 
      phone_number = $5, 
      gender = $6, 
      date_of_birth =$7, 
      bio = $8, 
      profile_picture = $9, 
      is_active = $10,
      updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $11
      RETURNING *`,
      [username, email, password_hash, full_name, phone_number, gender, date_of_birth, bio, profile_picture,is_active, id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await con.query(
      "DELETE FROM user_schema.users WHERE user_id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



port = 3000
app.listen(3000, () => {
  console.log('server is runnng... http/localhost:3000');
})