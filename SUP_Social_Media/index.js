require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());


async function printUsers() {
  try {
    const result = await pool.query(
      'SELECT * FROM user_schema.users'
    );
    console.log('Users from database:');
    console.table(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
}

printUsers();

// 🔹 API to get users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_schema.users'
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ======================================================
// CREATE User
// ======================================================

app.post('/Createuser', async (req, res) => {
  try {
    const { email, password, mobile, name, first_name, last_name, city } = req.body;

    const result = await pool.query(
      `INSERT INTO user_schema.users
      (email, password, mobile, name, first_name, last_name, city)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [email, password, mobile, name, first_name, last_name, city]
    );

    res.status(201).json({
      success: true,
      message: 'User created',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===========================================
// UPDATE User
// ===========================================
app.put('/Updateuser', async (req, res) => {
  try {
    const {
      uid,
      name,
      first_name,
      last_name,
      city,
      status
    } = req.body;


    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'uid is required'
      });
    }

    const result = await pool.query(
      `UPDATE user_schema.users
       SET name = $1,
           first_name = $2,
           last_name = $3,
           city = $4,
           status = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE uid = $6 AND deleted_at IS NULL
       RETURNING *`,
      [name, first_name, last_name, city, status, uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ======================================================
// GET ALL USER
// ======================================================

app.get('/getalluser', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM user_schema.users
       WHERE deleted_at IS NULL
       ORDER BY uid ASC`
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =====================================================
// GET SINGLE USER BY ID
// =====================================================

app.get('/getsingleuserbyid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await pool.query(
      `SELECT * FROM user_schema.users
       WHERE uid = $1 AND deleted_at IS NULL`,
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =======================================
// DELETE USER 
// =======================================

app.delete('/deleteuser/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await pool.query(
      `UPDATE user_schema.users
       SET deleted_at=CURRENT_TIMESTAMP
       WHERE uid=$1 AND deleted_at IS NULL
       RETURNING uid`,
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already deleted'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
