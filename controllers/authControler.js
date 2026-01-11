const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const roleModel = require("../models/roleModel");
const jwtConfig = require("../config/jwt");

exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role_id } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.createUser({
            full_name,
            email,
            password_hash: hashedPassword,
            role_id,
        });

        // 🔥 JWT CREATED AT REGISTER TIME
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "User registered", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await User.findByEmail(email);
        if (result.rows.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.json({ message: "Login success", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// exports.register = async (req, res) => {
//     const { name, email, password, role_id } = req.body;

//     // validate input //

//     if (!name || !email || !password || !role_id) {
//         return res.status(400).json({ message: "All Fields require" });
//     }

//     // valid input
//     const existiongUser = await userModel.findRoleById(email);
//     if (existiongUser.row.length > 0) {
//         return res.status(400).json({ message: "Email already exists" });
//     }

//     // Check role exists
//     const role = await roleModel.findRoleById(role_id);
//     if (role.rows.length === 0) {
//         return res.status(400).json({ message: "Invalid role" });
//     }

//     // Hash password
//     const password_hash = await bcrypt.hash(password, 10);

//     await userModel.createUser({
//         name,
//         email,
//         password_hash,
//         role_id,
//     });

//     res.status(201).json({ message: "User registered successfully" });
// };



// //------------------login Api ------------//


// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     // 1️⃣ Validate
//     if (!email || !password) {
//         return res.status(400).json({ message: "Email and password required" });
//     }

//     // 2️⃣ Check user exists
//     const result = await userModel.findByEmail(email);
//     if (result.rows.length === 0) {
//         return res.status(401).json({ message: "Email or password incorrect" });
//     }

//     const user = result.rows[0];

//     // 3️⃣ Check user status
//     if (!user.status) {
//         return res.status(403).json({ message: "User is inactive" });
//     }

//     // 4️⃣ Compare password
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 5️⃣ Generate JWT
//     const token = jwt.sign(
//         {
//             iss: "auth-system",
//             sub: user.id,
//             role: user.role_id,
//         },
//         JWT.SECRET,
//         { expiresIn: JWT.EXPIRES_IN }
//     );

//     res.json({
//         token,
//         user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role_id: user.role_id,
//         },
//     });



// };