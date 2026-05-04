
const Chat = require("../models/chat.model");

/////////////////////////////////////////////////////
// 💬 SEND
/////////////////////////////////////////////////////
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: "receiver_id and message required"
      });
    }

    const data = await Chat.sendMessage(senderId, receiver_id, message);

    res.status(201).json({
      success: true,
      message: "Message sent",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 🔁 REPLY
/////////////////////////////////////////////////////
exports.replyMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const parentId = req.params.messageId;
    const { receiver_id, message } = req.body;

    const data = await Chat.replyMessage(
      senderId,
      receiver_id,
      message,
      parentId
    );

    res.status(201).json({
      success: true,
      message: "Reply sent",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// ❌ DELETE
/////////////////////////////////////////////////////
exports.deleteMessage = async (req, res) => {
  try {
    await Chat.deleteMessage(req.params.messageId, req.user.id);

    res.json({
      success: true,
      message: "Message deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 GET CHAT
/////////////////////////////////////////////////////
exports.getChat = async (req, res) => {
  try {
    const messages = await Chat.getChat(
      req.user.id,
      req.params.userId
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 CONVERSATION (PAGINATION)
/////////////////////////////////////////////////////
exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id; // logged in user
    const user2 = Number(req.params.user2);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await Chat.getConversation(
      user1,
      user2,
      limit,
      offset
    );

    res.json({
      success: true,
      page,
      limit,
      count: result.rowCount,
      messages: result.rows.reverse()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
/////////////////////////////////////////////////////
// ✔✔ DELIVERED
/////////////////////////////////////////////////////
exports.markDelivered = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;

    const result = await Chat.markDelivered(senderId, receiverId);

    res.json({
      success: true,
      deliveredCount: result.count
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 👀 SEEN
/////////////////////////////////////////////////////
exports.markSeen = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;

    const result = await Chat.markSeen(senderId, receiverId);

    res.json({
      success: true,
      seenCount: result.count
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 UNDELIVERED (DEBUG)
/////////////////////////////////////////////////////
exports.getUndelivered = async (req, res) => {
  try {
    const messages = await Chat.getUndeliveredMessages(req.user.id);

    res.json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};