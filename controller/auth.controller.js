const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

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


