

const chatModel = require("../models/chatModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db")



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
    const receiver_id = req.params.receiver_id;

    const chats = await chatModel.getConversation(user1, receiver_id);

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.createGroup = async (req, res) => {
  try {
    const { name, members = [] } = req.body; // ✅ FIX
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO user_schema.groups (name, created_by)
       VALUES ($1, $2)
       RETURNING *`,
      [name, userId]
    );

    const group = result.rows[0];

    // ✅ add creator
    await db.query(
      `INSERT INTO user_schema.group_members (group_id, user_id)
       VALUES ($1, $2)`,
      [group.id, userId]
    );

    // ✅ add members (safe now)
    for (const m of members) {
      await db.query(
        `INSERT INTO user_schema.group_members (group_id, user_id)
         VALUES ($1, $2)`,
        [group.id, m]
      );
    }

    res.json(group);

  } catch (err) {
    console.log("❌ CREATE GROUP ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// exports.getGroupMessages = async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     const messages = await chatModel.getGroupMessages(groupId);

//     res.json(messages);

//   } catch (err) {
//     console.log("❌ GROUP FETCH ERROR:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// 📜 GET GROUP MESSAGES
exports.getGroupMessages = async (req, res) => {
  const groupId = Number(req.params.groupId);

  if (!groupId) {
    return res.status(400).json({
      success: false,
      message: "Invalid group ID"
    });
  }

  try {
    const messages = await chatModel.getGroupMessages(groupId);

    console.log("📦 GROUP MESSAGES:", messages); // DEBUG

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages   // 🔥 IMPORTANT (frontend expects this)
    });

  } catch (error) {
    console.error("❌ ERROR FETCHING GROUP MESSAGES:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};