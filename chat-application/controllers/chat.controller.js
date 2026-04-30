const Chat = require("../models/chat.model");

// 💬 Send
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        error: "receiverId and message required"
      });
    }

    const data = await Chat.send(req.user.id, receiverId, message);

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Reply
exports.replyMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const data = await Chat.reply(
      req.user.id,
      message,
      req.params.messageId
    );

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete

// exports.deleteMessage = async (req, res) => {
//   try {
//     const deleted = await Chat.delete(
//       req.params.messageId,
//       req.user.id
//     );

//     if (!deleted) {
//       return res.status(404).json({
//         error: "Message not found or not authorized"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Message deleted",
//       deletedMessageId: req.params.messageId
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.deleteMessage = async (req, res) => {
  try {
    await Chat.delete(req.params.messageId, req.user.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📩 Get chat
exports.getChat = async (req, res) => {
  try {
    const data = await Chat.getChat(
      req.user.id,
      req.params.userId
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ DELIVERED
exports.markDelivered = async (req, res) => {
  const data = await Chat.markDelivered(
    req.params.senderId,
    req.user.id
  );

  res.json({
    success: true,
    deliveredCount: data.length
  });
};

// 👀 SEEN
exports.markSeen = async (req, res) => {
  const data = await Chat.markSeen(
    req.params.senderId,
    req.user.id
  );

  res.json({
    success: true,
    seenCount: data.length
  });
};



// Get conversation
exports.getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const data = await Chat.getConversation(user1, user2);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

