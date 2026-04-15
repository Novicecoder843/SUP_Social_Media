// const pool = require("../config/db");


// const chatService = require("../models/chatModel");

// exports.sendMessage = async (req, res) => {
//   try {
//     const sender_id = req.user.id;
//     const { receiver_id, message, parent_message_id } = req.body;

//     const newMessage = await chatService.createMessage({
//       sender_id,
//       receiver_id,
//       message,
//       parent_message_id,
//     });

//     res.json({ success: true, data: newMessage });

//   } catch (err) {
//     res.status(500).json({ error: "Send failed" });
//   }
// };


// exports.getConversation = async (req, res) => {
//   try {
//     const user1 = req.user.id;
//     const user2 = req.params.user2;

//     const chats = await chatService.getConversation(user1, user2);

//     res.json({ success: true, data: chats });

//   } catch (err) {
//     res.status(500).json({ error: "Fetch failed" });
//   }
// };


// exports.markSeen = async (req, res) => {
//   try {
//     const receiver_id = req.user.id;
//     const sender_id = req.params.senderId;

//     await chatService.markSeen(sender_id, receiver_id);

//     res.json({ success: true, message: "Seen updated" });

//   } catch (err) {
//     res.status(500).json({ error: "Seen failed" });
//   }
// };


const chatModel = require("../models/chatModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




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

// exports.markAsSeen = async (req, res) => {
//   try {
//     const receiver = req.user.id;
//     const sender = req.params.senderId;

//     const updated = await chatModel.markAsSeen(sender, receiver);

//     res.json({
//       success: true,
//       message:"Messages marked as seen",
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };