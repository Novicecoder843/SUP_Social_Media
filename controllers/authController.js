const userModel = require("../service/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../utils/emailService");

const SECRET = process.env.JWT_SECRET;

// REGISTER
const register = async (req, res) => {
  const email = req.body.email.toLowerCase();   // ✅ FIXED
  const { name, age, password, role_id } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(
      name,
      email,   // ✅ lowercase email
      age,
      hashedPassword,
      role_id
    );

    return res.json({ message: "User registered", user });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
};

//  LOGIN → SEND OTP
const login = async (req, res) => {
  const email = req.body.email.toLowerCase();  
  const { password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).send("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false
    });

    console.log("Generated OTP:", otp); 

    await userModel.saveOTP(email, otp);

    await sendEmail(email, "Login OTP", `Your OTP is: ${otp}`);

    return res.send("OTP sent to email");

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
};

// VERIFY OTP → TOKEN WITH ROLE
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user || user.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    await userModel.clearOTP(email);

    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id
      },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login success", token });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
};

// VERIFY EMAIL 
const verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
};

// LOGOUT
const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).send("Token required");

  try {
    const decoded = jwt.verify(token, SECRET);

    const newToken = jwt.sign(
      { id: decoded.id, role_id: decoded.role_id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(403).send("Invalid token");
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) return res.status(400).send("Email not registered");

    const token = jwt.sign(
      { id: user.id },
      SECRET,
      { expiresIn: "5m" }
    );

    const link = `http://localhost:5000/reset-password/${token}`;

    await sendEmail(email, "Reset Password", link);

    res.send("Reset link sent");

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);

    const hashed = await bcrypt.hash(newPassword, 10);

    await userModel.updatePasswordById(decoded.id, hashed);

    res.send("Password updated");

  } catch (error) {
    console.error("ERROR:", error);
   return res.status(400).send("Invalid or expired token");
  }
};

// EXPORT ALL FUNCTIONS 
module.exports = {
  register,
  login,
  verifyOTP,
  verifyEmail,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};