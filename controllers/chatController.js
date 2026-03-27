const pool = require("../config/db");


const chatService = require("../models/chatModel");

exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, message, parent_message_id } = req.body;

    const newMessage = await chatService.createMessage({
      sender_id,
      receiver_id,
      message,
      parent_message_id,
    });

    res.json({ success: true, data: newMessage });

  } catch (err) {
    res.status(500).json({ error: "Send failed" });
  }
};


exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = req.params.user2;

    const chats = await chatService.getConversation(user1, user2);

    res.json({ success: true, data: chats });

  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};


exports.markSeen = async (req, res) => {
  try {
    const receiver_id = req.user.id;
    const sender_id = req.params.senderId;

    await chatService.markSeen(sender_id, receiver_id);

    res.json({ success: true, message: "Seen updated" });

  } catch (err) {
    res.status(500).json({ error: "Seen failed" });
  }
};