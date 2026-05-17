

// const Chat = require("../models/chat.model");

// /////////////////////////////////////////////////////
// // 💬 SEND
// /////////////////////////////////////////////////////
// exports.sendMessage = async (req, res) => {
//   try {
//     const senderId = req.user.id;
//     const { receiver_id, message } = req.body;

//     if (!receiver_id || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "receiver_id and message required"
//       });
//     }

//     const data = await Chat.sendMessage(senderId, receiver_id, message);

//     res.status(201).json({
//       success: true,
//       message: "Message sent",
//       data
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // 🔁 REPLY
// /////////////////////////////////////////////////////
// exports.replyMessage = async (req, res) => {
//   try {
//     const senderId = req.user.id;
//     const parentId = req.params.messageId;
//     const { receiver_id, message } = req.body;

//     const data = await Chat.replyMessage(
//       senderId,
//       receiver_id,
//       message,
//       parentId
//     );

//     res.status(201).json({
//       success: true,
//       message: "Reply sent",
//       data
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // ❌ DELETE
// /////////////////////////////////////////////////////
// exports.deleteMessage = async (req, res) => {
//   try {
//     await Chat.deleteMessage(req.params.messageId, req.user.id);

//     res.json({
//       success: true,
//       message: "Message deleted"
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // 📩 GET CHAT
// /////////////////////////////////////////////////////
// exports.getChat = async (req, res) => {
//   try {
//     const messages = await Chat.getChat(
//       req.user.id,
//       req.params.userId
//     );

//     res.json({
//       success: true,
//       count: messages.length,
//       messages
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // 📩 CONVERSATION (PAGINATION)
// /////////////////////////////////////////////////////
// exports.getConversation = async (req, res) => {
//   try {
//     const user1 = req.user.id; // logged in user
//     const user2 = Number(req.params.user2);

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

//     const result = await Chat.getConversation(
//       user1,
//       user2,
//       limit,
//       offset
//     );

//     res.json({
//       success: true,
//       page,
//       limit,
//       count: result.rowCount,
//       messages: result.rows.reverse()
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
// /////////////////////////////////////////////////////
// // ✔✔ DELIVERED
// /////////////////////////////////////////////////////
// exports.markDelivered = async (req, res) => {
//   try {
//     const receiverId = req.user.id;
//     const senderId = req.params.senderId;

//     const result = await Chat.markDelivered(senderId, receiverId);

//     res.json({
//       success: true,
//       deliveredCount: result.count
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // 👀 SEEN
// /////////////////////////////////////////////////////
// exports.markSeen = async (req, res) => {
//   try {
//     const receiverId = req.user.id;
//     const senderId = req.params.senderId;

//     const result = await Chat.markSeen(senderId, receiverId);

//     res.json({
//       success: true,
//       seenCount: result.count
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /////////////////////////////////////////////////////
// // 📩 UNDELIVERED (DEBUG)
// /////////////////////////////////////////////////////
// exports.getUndelivered = async (req, res) => {
//   try {
//     const messages = await Chat.getUndeliveredMessages(req.user.id);

//     res.json({
//       success: true,
//       count: messages.length,
//       messages
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



const db = require("../config/db");
const Chat = require("../models/chat.model");

/////////////////////////////////////////////////////
// 💬 SEND MESSAGE (API + SOCKET)
/////////////////////////////////////////////////////
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message, parent_id } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: "receiver_id and message required",
      });
    }

    const newMessage = await Chat.createMessage({
      sender_id: senderId,
      receiver_id,
      message,
      parent_id,
    });

    // 📡 SOCKET EMIT
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers") || {};

    const receiverSockets = onlineUsers[receiver_id];

    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("receive_message", newMessage);
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });

  } catch (err) {
    console.error("SEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 🔁 REPLY MESSAGE
/////////////////////////////////////////////////////
exports.replyMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const parentId = req.params.messageId;
    const { receiver_id, message } = req.body;

    const newMessage = await Chat.replyMessage(
      senderId,
      receiver_id,
      message,
      parentId
    );

    res.status(201).json({
      success: true,
      message: "Reply sent",
      data: newMessage,
    });

  } catch (err) {
    console.error("REPLY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// ❌ DELETE MESSAGE
/////////////////////////////////////////////////////
exports.deleteMessage = async (req, res) => {
  try {
    await Chat.deleteMessage(req.params.messageId, req.user.id);

    res.json({
      success: true,
      message: "Message deleted",
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 GET CHAT (NO PAGINATION)
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
      messages,
    });

  } catch (err) {
    console.error("GET CHAT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 GET CONVERSATION (PAGINATION)
/////////////////////////////////////////////////////
exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id;
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
      messages: result.rows.reverse(),
    });

  } catch (err) {
    console.error("CONVERSATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// ✔✔ MARK DELIVERED
/////////////////////////////////////////////////////
exports.markDelivered = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;

    const result = await Chat.markDelivered(senderId, receiverId);

    // 📡 Notify sender via socket
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers") || {};

    const senderSockets = onlineUsers[senderId];

    if (senderSockets) {
      senderSockets.forEach((socketId) => {
        io.to(socketId).emit("messages_delivered", {
          receiver_id: receiverId,
        });
      });
    }

    res.json({
      success: true,
      deliveredCount: result.count,
    });

  } catch (err) {
    console.error("DELIVERED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 👀 MARK SEEN
/////////////////////////////////////////////////////
exports.markSeen = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;

    const result = await Chat.markSeen(senderId, receiverId);

    // 📡 Notify sender
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers") || {};

    const senderSockets = onlineUsers[senderId];

    if (senderSockets) {
      senderSockets.forEach((socketId) => {
        io.to(socketId).emit("messages_seen", {
          receiver_id: receiverId,
        });
      });
    }

    res.json({
      success: true,
      seenCount: result.count,
    });

  } catch (err) {
    console.error("SEEN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/////////////////////////////////////////////////////
// 📩 GET UNDELIVERED (DEBUG)
/////////////////////////////////////////////////////
exports.getUndelivered = async (req, res) => {
  try {
    const messages = await Chat.getUndeliveredMessages(req.user.id);

    res.json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (err) {
    console.error("UNDELIVERED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};




exports.getChatList = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const result = await db.query(`
      SELECT 
        u.id AS user_id,
        u.email,
        false AS status,

        (
          SELECT m.message
          FROM messages m
          WHERE 
            (m.sender_id = u.id AND m.receiver_id = $1)
            OR 
            (m.sender_id = $1 AND m.receiver_id = u.id)
          ORDER BY m.id DESC
          LIMIT 1
        ) AS last_message,

        (
          SELECT COUNT(*)
          FROM messages m
          WHERE 
            m.sender_id = u.id 
            AND m.receiver_id = $1
            AND m.is_seen = false
        ) AS unread

      FROM users u
      WHERE u.id != $1
    `, [userId]);

    res.json({ users: result.rows });

  } catch (err) {
    console.log("❌ CHAT LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, email FROM users WHERE id != $1`,
      [userId]
    );

    res.json({ users: result.rows });

  } catch (err) {
    console.log("❌ USERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};







// const Chat = require("../models/chat.model");

/////////////////////////////////////////////////////
// ✅ CREATE GROUP
/////////////////////////////////////////////////////
exports.createGroup = async (req, res) => {

  try {

    const { name, members } = req.body;

    const createdBy = req.user.id;

    const group = await Chat.createGroup(
      name,
      createdBy,
      members
    );

    res.json({
      success: true,
      group
    });

  } catch (err) {

    console.log(
      "CREATE GROUP ERROR:",
      err
    );

    res.status(500).json({
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// ✅ GET MY GROUPS
/////////////////////////////////////////////////////
exports.getMyGroups = async (
  req,
  res
) => {

  try {

    const groups =
      await Chat.getMyGroups(
        req.user.id
      );

    res.json({
      success: true,
      groups
    });

  } catch (err) {

    console.log(
      "GET GROUPS ERROR:",
      err
    );

    res.status(500).json({
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// ✅ SEND GROUP MESSAGE
/////////////////////////////////////////////////////
exports.sendGroupMessage =
  async (req, res) => {

    try {

      const { group_id, message } =
        req.body;

      const sender_id =
        req.user.id;

      const msg =
        await Chat.createGroupMessage(
          group_id,
          sender_id,
          message
        );

      res.json({
        success: true,
        message: msg
      });

    } catch (err) {

      console.log(
        "GROUP MESSAGE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  };

/////////////////////////////////////////////////////
// ✅ GET GROUP MESSAGES
/////////////////////////////////////////////////////
exports.getGroupMessages =
  async (req, res) => {

    try {

      const { groupId } =
        req.params;

      const messages =
        await Chat.getGroupMessages(
          groupId
        );

      res.json({
        success: true,
        messages
      });

    } catch (err) {

      console.log(
        "GROUP FETCH ERROR:",
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  };