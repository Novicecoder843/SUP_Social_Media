const pool = require("../config/db");
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


exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = Number(req.params.user2);

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await Chat.getConversation(
      user1,
      user2,
      limit,
      offset
    );

    res.json({
      page: Number(page),
      count: result.rows.length,
      messages: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.markAsSeen = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { senderId } = req.params;

    // Step 1: Check total messages
    const checkQuery = `
            SELECT COUNT(*) 
            FROM user_schema.chats
            WHERE sender_id = $1 AND receiver_id = $2;
        `;
    const totalResult = await pool.query(checkQuery, [senderId, receiverId]);
    const totalMessages = parseInt(totalResult.rows[0].count);

    // ❌ No messages exist
    if (totalMessages === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found"
      });
    }

    // Step 2: Check unseen messages
    const unseenQuery = `
            SELECT COUNT(*) 
            FROM user_schema.chats
            WHERE sender_id = $1 
            AND receiver_id = $2 
            AND is_seen = false;
        `;
    const unseenResult = await pool.query(unseenQuery, [senderId, receiverId]);
    const unseenCount = parseInt(unseenResult.rows[0].count);

    // ✅ Already seen
    if (unseenCount === 0) {
      return res.json({
        success: true,
        message: "Messages already seen"
      });
    }

     // Step 3: Mark as seen
        const result = await Chat.markAsSeen(senderId, receiverId);

        res.json({
            success: true,
            message: "Messages marked as seen",
            updatedCount: result.count
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};