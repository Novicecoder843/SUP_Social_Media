

const jwt = require("jsonwebtoken");
const chatModel = require("../models/chatModel");

const onlineUsers = {};   // { userId: [socketIds] }
const activeUsers = {};   // { userId: [socketIds] }

module.exports = (io) => {

  io.on("connection", async (socket) => {
    console.log("🔌 Connected:", socket.id);

    let userId;

    // 🔐 AUTH
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);

      userId = Number(user.id);
      socket.user = { id: userId };

      if (!onlineUsers[userId]) onlineUsers[userId] = [];
      onlineUsers[userId].push(socket.id);

      await chatModel.setOnline(userId);
      io.emit("user_online", userId);

    } catch (err) {
      console.log("❌ AUTH ERROR:", err.message);
      return socket.disconnect();
    }

    // 🟢 JOIN CHAT
    socket.on("join_chat", ({ userId }) => {
      if (!activeUsers[userId]) activeUsers[userId] = [];
      activeUsers[userId].push(socket.id);
    });

    // 🟣 JOIN GROUP (ADD THIS)
    socket.on("join_group", ({ group_id }) => {
      socket.join(`group_${group_id}`);

      console.log(`👥 User ${socket.user.id} joined group_${group_id}`);
    });

    // 📩 SEND UNDELIVERED
    try {
      const undelivered = await chatModel.getUndeliveredMessages(userId);

      undelivered.forEach(msg => {
        socket.emit("receive_message", msg);

        const senderSockets = onlineUsers[msg.sender_id];
        if (senderSockets) {
          senderSockets.forEach(id => {
            io.to(id).emit("message_delivered", {
              message_id: msg.id
            });
          });
        }
      });

      await chatModel.markAllDelivered(userId);

    } catch (err) {
      console.log("❌ UNDELIVERED ERROR:", err.message);
    }


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

    // 📤 SEND MESSAGE
    socket.on("send_message", async ({ receiver_id, message ,media_url}) => {
      if (!receiver_id ||  (!message && !media_url)) return;

      try {
        const sender_id = socket.user.id;

        const saved = await chatModel.createMessage(
          sender_id,
          receiver_id,
          message || "",
          media_url || null
        );

        // ✔ SENT
        socket.emit("message_sent", saved);

        const receiverSockets = onlineUsers[receiver_id];
        const activeSockets = activeUsers[receiver_id];

        if (receiverSockets && activeSockets) {
          receiverSockets.forEach(id => {
            if (id !== socket.id) { // ✅ avoid sending back to sender
              io.to(id).emit("receive_message", saved);
            }
          });

          // ✔✔ DELIVERED
          socket.emit("message_delivered", {
            message_id: saved.id
          });

          await chatModel.markDelivered(saved.id);
        }

      } catch (err) {
        console.log("❌ SEND ERROR:", err.message);
      }
    });


    socket.on("send_group_message", async ({ group_id, message ,media_url }) => {
      if (!group_id || !message) return;

      try {
        const sender_id = socket.user.id;

        // 💾 SAVE TO DB (create this function)
        const saved = await chatModel.createGroupMessage(
          group_id,
          sender_id,
          message,
          media_url
        );
        console.log("💾 GROUP SAVED:", saved);
        // 📤 SEND TO ALL IN GROUP
        io.to(`group_${group_id}`).emit("receive_group_message", saved);
        console.log("📤 EMITTED TO:", `group_${group_id}`);
      } catch (err) {
        console.log("❌ GROUP SEND ERROR:", err.message);
      }
    });



    socket.on("seen", async ({ message_id, sender_id }) => {
      try {
        console.log("👀 Seen event:", message_id, sender_id);

        if (!message_id || !sender_id) {
          console.log("❌ Invalid seen data");
          return;
        }

        await chatModel.markAsSeen(message_id);

        const senderSockets = onlineUsers[sender_id]; // ✅ FIX

        if (senderSockets) {
          senderSockets.forEach(id => {
            io.to(id).emit("message_seen", {
              message_id
            });
          });
        }

      } catch (err) {
        console.log("❌ SEEN ERROR:", err.message);
      }
    });

    socket.on("delete_message", async ({ message_id }) => {

      try {

        await chatModel.deleteMessage(message_id);

        io.emit("message_deleted", {
          message_id
        });

        console.log("🗑 Deleted:", message_id);

      } catch (err) {

        console.log("❌ DELETE ERROR:", err.message);
      }
    });

    socket.on("delete_for_everyone", async ({ message_id }) => {

    try {

        await chatModel.deleteForEveryone(message_id);

        io.emit("message_deleted_everyone", {
            message_id
        });

        console.log("🗑 Deleted for everyone:", message_id);

    } catch (err) {

        console.log(
            "❌ DELETE EVERYONE ERROR:",
            err.message
        );
    }
});
    // 🔴 DISCONNECT
    socket.on("disconnect", async () => {
      if (!userId) return;

      onlineUsers[userId] = (onlineUsers[userId] || []).filter(
        id => id !== socket.id
      );

      if (onlineUsers[userId].length === 0) {
        delete onlineUsers[userId];

        await chatModel.setOffline(userId);
        io.emit("user_offline", {
          userId,
          last_seen: new Date()
        });
      }

      activeUsers[userId] = (activeUsers[userId] || []).filter(
        id => id !== socket.id
      );

      if (activeUsers[userId].length === 0) {
        delete activeUsers[userId];
      }

      console.log("🔴 Disconnected:", userId);
    });

  });

};