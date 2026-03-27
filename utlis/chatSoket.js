const chatService = require("../models/chatModel");

const onlineUsers = new Map();

module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // JOIN
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await chatService.createMessage(data);

        const receiverSocket = onlineUsers.get(data.receiver_id);

        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", newMessage);
        }

        socket.emit("messageSent", newMessage);

      } catch (err) {
        console.error(err);
      }
    });

    // TYPING
    socket.on("typing", ({ sender_id, receiver_id }) => {
      const receiverSocket = onlineUsers.get(receiver_id);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { sender_id });
      }
    });

    // STOP TYPING
    socket.on("stopTyping", ({ sender_id, receiver_id }) => {
      const receiverSocket = onlineUsers.get(receiver_id);
      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping", { sender_id });
      }
    });

    // SEEN
    socket.on("seen", async ({ sender_id, receiver_id }) => {
      await chatService.markSeen(sender_id, receiver_id);

      const senderSocket = onlineUsers.get(sender_id);

      if (senderSocket) {
        io.to(senderSocket).emit("seenUpdate", { receiver_id });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

  });

};