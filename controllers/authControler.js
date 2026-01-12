const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const roleModel = require("../models/roleModel");
const jwtConfig = require("../config/jwt");



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
        if (role.rows.length > 0) {
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
        // 3️⃣ Check user status
        if (!user.status) {
            return res.status(403).json({ message: "User is inactive" });
        }


        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );
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
