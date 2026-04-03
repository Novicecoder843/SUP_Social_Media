

const jwt = require("jsonwebtoken");
const chatModel = require("../models/chatModel");



const onlineUsers = {};
console.log(onlineUsers);
module.exports = (io) => {


  io.on("connection", async (socket) => {

    console.log("socket connected", socket.id)
    console.log("User Connected:", socket.id);
 
    console.log("🧠 socket instance:", socket);

    // 🔐 AUTH
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = user;
      onlineUsers[user.id] = socket.id;

      await chatModel.setOnline(user.id);

      io.emit("user_online", user.id);

    } catch {
      return socket.disconnect();
    }

    // 🧪 DEBUG ALL EVENTS
    socket.onAny((event, ...args) => {
      console.log("📡 EVENT:", event, args);
    });


    // 🟢 TYPING
    socket.on("typing", ({ receiver_id }) => {
      const receiverSocket = onlineUsers[receiver_id];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", socket.user.id);
      }
    });

    socket.on("stop_typing", ({ receiver_id }) => {
      const receiverSocket = onlineUsers[receiver_id];
      if (receiverSocket) {
        io.to(receiverSocket).emit("stop_typing", socket.user.id);
      }
    });


    socket.on("send_message", async (data) => {
      console.log("🔥 EVENT HIT", data);

      const { receiver_id, message } = data || {};

      if (!receiver_id || !message) {
        return socket.emit("error_message", {
          message: "Invalid data"
        });
      }

      try {
        const sender_id = socket.user.id;

        const saved = await chatModel.createMessage(
          sender_id,
          receiver_id,
          message
        );

        console.log("✅ SAVED:", saved);

        socket.emit("message_sent", saved);

      } catch (err) {
        console.error("❌ ERROR:", err);
      }
    });




    // 👁️ SEEN
    socket.on("seen", async ({ sender_id }) => {
      const receiver_id = socket.user.id;

      await chatModel.Seen(sender_id, receiver_id);

      const senderSocket = onlineUsers[sender_id];

      if (senderSocket) {
        io.to(senderSocket).emit("message_seen", sender_id);
      }
    });

    // 🔴 DISCONNECT
    socket.on("disconnect", async () => {
      const userId = socket.user?.id;

      if (userId) {
        delete onlineUsers[userId];

        await chatModel.setOffline(userId);

        io.emit("user_offline", {
          userId,
          last_seen: new Date()
        });
      }
    });

  });

  return onlineUsers;
};

