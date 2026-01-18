const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const pool = require('../config/db');

// /* ================= REGISTER ================= */
// exports.register = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Placeholder validation
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'All fields required' });
//   }

//   // Placeholder response (NO DB INSERT yet)
//   return res.status(201).json({
//     message: 'User registered successfully (placeholder)',
//     user: {
//       name,
//       email,
//       role: role || 'user'
//     }
//   });
// };

// /* ================= LOGIN ================= */
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email & password required' });
//   }

//   // Placeholder JWT
//   const token = jwt.sign(
//     { id: 1, role: 'user' },
//     'dummy_secret',
//     { expiresIn: '15m' }
//   );

//   return res.json({
//     message: 'Login successful (placeholder)',
//     token,
//     user: {
//       id: 1,
//       email,
//       role: 'user'
//     }
//   });
// };

// /* ================= LOGOUT ================= */
// exports.logout = async (req, res) => {
//   return res.json({
//     message: 'Logout successful (placeholder)'
//   });
// };

// /* ================= REFRESH TOKEN ================= */
// exports.refreshToken = async (req, res) => {
//   return res.json({
//     message: 'Token refreshed (placeholder)',
//     token: 'new-dummy-access-token'
//   });
// };


/* ================= REGISTER ================= */


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailToken = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `INSERT INTO auth.user
       (name, email, password, email_verify_token, email_verify_expires)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '24 hours')`,
      [name, email, hashedPassword, emailToken]
    );

    // 📧 SEND EMAIL
    await sendEmail({
      to: email,
      subject: 'Welcome! Verify your email',
      html: `
        <h2>Hello ${name} 👋</h2>
        <p>Your account was created successfully.</p>
        <p><b>Email verification token:</b></p>
        <p>${emailToken}</p>
        <p>Valid for 24 hours.</p>
      `
    });

    res.status(201).json({
      message: 'Registration successful. Email sent.'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ message: 'All fields required' });

//     const exists = await pool.query(
//       'SELECT id FROM auth.user WHERE email = $1',
//       [email]
//     );

//     if (exists.rowCount > 0)
//       return res.status(409).json({ message: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);

//     const emailToken = crypto.randomBytes(32).toString('hex');

//     await pool.query(
//       `INSERT INTO auth.user
//        (name, email, password, role, email_verify_token, email_verify_expires)
//        VALUES ($1,$2,$3,$4,$5, NOW() + INTERVAL '24 hours')`,
//       [name, email, hashed, role || 'user', emailToken]
//     );

//     console.log('VERIFY EMAIL TOKEN:', emailToken); // Postman testing

//     res.status(201).json({ message: 'Registered successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await pool.query(
      'SELECT * FROM auth.user WHERE email = $1',
      [email]
    );

    if (userRes.rowCount === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = userRes.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');

    await pool.query(
      `INSERT INTO auth.refresh_tokens (user_id, token, expires_at)
       VALUES ($1,$2, NOW() + INTERVAL '7 days')`,
      [user.id, refreshToken]
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= REFRESH TOKEN ================= */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const tokenRes = await pool.query(
      `SELECT rt.*, u.role FROM auth.refresh_tokens rt
       JOIN auth.user u ON u.id = rt.user_id
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [refreshToken]
    );

    if (tokenRes.rowCount === 0)
      return res.status(401).json({ message: 'Invalid refresh token' });

    const data = tokenRes.rows[0];

    const newAccessToken = jwt.sign(
      { id: data.user_id, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
  await pool.query(
    'DELETE FROM auth.refresh_tokens WHERE token = $1',
    [req.body.refreshToken]
  );
  res.json({ message: 'Logged out' });
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  const result = await pool.query(
    `SELECT id FROM auth.user
     WHERE email_verify_token=$1 AND email_verify_expires > NOW()`,
    [token]
  );

  if (result.rowCount === 0)
    return res.status(400).json({ message: 'Invalid token' });

  await pool.query(
    `UPDATE auth.user
     SET is_email_verified=true,
         email_verify_token=NULL,
         email_verify_expires=NULL
     WHERE id=$1`,
    [result.rows[0].id]
  );

  res.json({ message: 'Email verified' });
};


/* ================= FORGOT PASSWORD ================= */


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      'SELECT id FROM auth.user WHERE email = $1',
      [email]
    );

    if (user.rowCount === 0)
      return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `UPDATE auth.user
       SET reset_password_token = $1,
           reset_password_expires = NOW() + INTERVAL '15 minutes'
       WHERE email = $2`,
      [token, email]
    );

    // Email sending later
    console.log('RESET PASSWORD TOKEN:', token);

    res.json({ message: 'Password reset token sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await pool.query(
      `SELECT id FROM auth.user
       WHERE reset_password_token = $1
       AND reset_password_expires > NOW()`,
      [token]
    );

    if (user.rowCount === 0)
      return res.status(400).json({ message: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE auth.user
       SET password = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2`,
      [hashed, user.rows[0].id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
