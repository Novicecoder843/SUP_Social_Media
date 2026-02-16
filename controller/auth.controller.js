const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/auth.model");

/* ================= REGISTER ================= */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= LOGIN ================= */
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

    res.json({
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
  res.json({
    success: true,
    message: "Email verified successfully (Dummy Implementation)",
  });
}

/* ================= FORGOT PASSWORD ================= */
async function forgotPassword(req, res) {
  res.json({
    success: true,
    message: "Password reset link sent (Dummy Implementation)",
  });
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
