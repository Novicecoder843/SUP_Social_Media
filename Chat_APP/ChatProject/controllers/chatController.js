const chatModel = require("../models/chatModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.userRegister = async (req, res) => {
  try {
    const { full_name, email, password_hash } = req.body;

    // 1️⃣ Check existing user
    const existing = await chatModel.findByEmail(email);
    if (existing) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    // 2️⃣ Hash password
    const saltRounds = 10;
    const password = await bcrypt.hash(password_hash, saltRounds);

    const userdata = await chatModel.userRegister(
      full_name,
      email,
      password
    );
    res.json({ success: true, data: userdata })
  } catch (err) {
    res.status(500).json({ error: err.message });

  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    // cheak user is exist 

    const user = await chatModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found ",
      });
    }

    // cheak status 

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is in active"
      });
    };
    // 🔍 Compare password
    const isMatch = await bcrypt.compare(password_hash, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5️⃣ Response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    });



  } catch (err) {
    res.status(500).json({ error: err.message });

  }
}



exports.sendMessage = async (req, res) => {
  const onlineUsers = req.app.get("onlineUsers");

  try {
    
    const sender_id = req.user.id;

    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: "receiver_id and message are required",
      });
    }

    const chat = await chatModel.createMessage(
      sender_id,
      receiver_id,
      message
    );

    // Emit via socket
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocket = onlineUsers[receiver_id];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message");
    }

    res.json({
      success: true,
      message: "Message sent",
      data: chat,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = req.params.user2;

    const chats = await chatModel.getConversation(user1, user2);

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const receiver = req.user.id;
    const sender = req.params.senderId;

    const updated = await chatModel.markAsSeen(sender, receiver);

    res.json({
      success: true,
      message:"Messages marked as seen",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};