const Chat = require("../models/chatModel");

// 💬 Send Message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({ message: "Receiver and message required" });
    }

    const result = await Chat.sendMessage(senderId, receiver_id, message);

    res.status(201).json({
      message: "Message sent",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Reply Message
exports.replyMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const parentId = req.params.messageId;
    const { receiver_id, message } = req.body;

    const result = await Chat.replyMessage(
      senderId,
      receiver_id,
      message,
      parentId
    );

    res.status(201).json({
      message: "Reply sent",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.messageId;

    await Chat.deleteMessage(messageId, userId);

    res.json({ message: "Message deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📩 Get Chat
exports.getChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const result = await Chat.getChat(userId, otherUserId);

    res.json({
      count: result.rows.length,
      messages: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};