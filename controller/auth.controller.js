const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");
const crypto = require("crypto");


exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role_id} = req.body;

    if (!email || !password || !first_name) {
      return res.status(400).json({ success: false, message: "All fields required (first_name, email, password)" });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // If a role_id was provided, ensure it exists
    if (role_id) {
      const roleExists = await UserModel.roleExists(role_id);
      if (!roleExists) {
        return res.status(400).json({ success: false, message: "Invalid role_id" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role_id: role_id || null
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmailWithRole(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Email or password incorrect" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "User is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email or password incorrect" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
      res.cookie("token", token, {
      httpOnly: true,      // JS cannot access
      secure: false,       // true in production (HTTPS)
      sameSite: "strict",  // CSRF protection
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role_name
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.logout = async (req, res) => {
  try {
      res.clearCookie("token", {
      httpOnly: true,
      secure: false,      // true in production
      sameSite: "strict"
    });

      
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const result = await pool.query(
            `SELECT id FROM user_schema.userstable WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = result.rows[0].id;

        //  Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await pool.query(
            `INSERT INTO user_schema.password_reset_tokens 
       (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, resetToken, expiresAt]
        );

        res.json({
            message: "Password reset token generated",
            resetToken   // Only return in development
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and password required" });
        }

        const result = await pool.query(
            `SELECT user_id FROM user_schema.password_reset_tokens
       WHERE token = $1 AND expires_at > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const userId = result.rows[0].user_id;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE user_schema.userstable
       SET password_hash = $1
       WHERE id = $2`,
            [hashedPassword, userId]
        );

        // Remove token
        await pool.query(
            `DELETE FROM user_schema.password_reset_tokens WHERE token = $1`,
            [token]
        );

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};







