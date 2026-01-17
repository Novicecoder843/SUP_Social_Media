const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const User = require("../models/userModel");
const roleModel = require("../models/roleModel");
const jwtConfig = require("../config/jwt");
const { sendLoginEmail , sendLoginOtpEmail} = require("../utlis/emailSend");



exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role_id } = req.body;

        // 1️⃣ Validate input
        if (!full_name || !email || !password || !role_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2️⃣ Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3️⃣ Check role exists
        const role = await User.findRoleById(role_id);
        if (role.rows.length === 0) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // 4️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5️⃣ Create user
        await User.createUser({
            full_name,
            email,
            password_hash: hashedPassword,
            role_id,
        });

        // 6️⃣ Response (NO token)
        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getUserById(id);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, role_id } = req.body;

        const user = await User.getUserById(id);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.updateUser(id, full_name, role_id);

        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getUserById(id);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.softDeleteUser(id);

        res.status(200).json({ message: "User deactivated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};






exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        // 1️⃣ Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 2️⃣ Check user exists
        const result = await User.findByEmail(email);
        if (result.rows.length === 0)
            return res.status(401).json({ message: "Incorrect Email or password " });


        const user = result.rows[0];

        // 3️⃣ Check user status
        if (!user.status) {
            return res.status(403).json({ message: "invalid users plise Register first" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(401).json({ message: "Invalid candidate plise re Enter user name and password" });



        // 🔢 Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        // Save OTP
        await User.saveLoginOtp(user.id, otp, expiresAt);

        // Send OTP email
        await sendLoginOtpEmail(user.email, user.full_name, otp);

        return res.status(200).json({
            message: "OTP sent to your email. Please verify to continue."
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ======== VERYFY OTP AND LOGIN USER ============//

exports.verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await User.findByEmail(email);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Candidate" });
        }

        const user = result.rows[0];

        // ❌ OTP invalid or expired
        if (
            user.login_otp !== otp ||
            new Date(user.login_otp_expires) < new Date()
        ) {
            return res.status(400).json({ message: "Invalid OTP  Plise Try Again" });
        }

        // Clear OTP + mark verified
        await User.clearLoginOtp(user.id);

        // ✅ Generate JWT
            const token = jwt.sign(
                { id: user.id, role_id: user.role_id },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );


        // 📧 SEND EMAIL TO LOGGED-IN USER
        sendLoginEmail(user.email, user.full_name)
            .catch(err => console.error("Login email failed:", err.message));


        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
            }, message: "Login success",
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};









exports.logout = async (req, res) => {
    try {
        // Frontend/Postman should remove token
        res.json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//------------------ FORGOT PASSWORD ------------//

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

        // 🔐 Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await pool.query(
            `INSERT INTO user_schema.password_reset_tokens 
       (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, resetToken, expiresAt]
        );

        // 📧 Email sending skipped (Postman testing)
        res.json({
            message: "Password reset token generated",
            resetToken   // ⚠️ Only return in development
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




//============ Reset password =============//


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

        // 🔥 Remove token after use
        await pool.query(
            `DELETE FROM user_schema.password_reset_tokens WHERE token = $1`,
            [token]
        );

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


