const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/auth.model");
const pool = require("../config/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ================= REGISTER ================= */

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 5️⃣ Create user (email not verified)
    await User.createUser({
      username,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    // 6️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
      },
    });

    // 7️⃣ Verify transporter connection
    await transporter.verify();
    console.log("SMTP Server is ready to send emails");

    // 8️⃣ Verification link
    const verifyLink = `http://localhost:5000/api/auth/verify-email`;

    // 9️⃣ Send email
    const info = await transporter.sendMail({
      from: `"Social App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome ${username}</h2>
        <p>Please click below to verify your email:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `,
    });

    // 🔎 Debug logs
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { register };


///* ================= LOGIN ================= */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
/* ================= PROFILE ================= */
async function profile(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= LOGOUT ================= */
async function logout(req, res) {
  res.json({
    success: true,
    message: "User logged out successfully",
  });
}

/* ================= REFRESH TOKEN ================= */
async function refreshToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
}

/* ================= VERIFY EMAIL ================= */

async function verifyEmail(req, res) {
  try {
    const { email } = req.body;

    // 1️⃣ Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2️⃣ Check if user exists
    const userResult = await pool.query(
      "SELECT id, is_email_verified FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found, please register first.",
      });
    }

    const user = userResult.rows[0];

    // 3️⃣ Check if already verified
    if (user.is_email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    // 4️⃣ Update email verification status
    await pool.query(
      "UPDATE users SET is_email_verified = true WHERE email = $1",
      [email]
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { verifyEmail };


/* ================= FORGOT PASSWORD ================= */
async function forgotPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // 1️⃣ Validate inputs
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, newPassword and confirmPassword are required",
      });
    }

    // 2️⃣ Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 3️⃣ Optional: password length validation
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 4️⃣ Check if user exists
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 6️⃣ Update password in DB
    await User.updatePassword(user.id, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= RESET PASSWORD ================= */
async function resetPassword(req, res) {
  res.json({
    success: true,
    message: "Password reset successfully (Dummy Implementation)",
  });
}
/* ================= EXPORT ================= */
module.exports = {
  register,
  login,
  profile,          // ✅ added here
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
};