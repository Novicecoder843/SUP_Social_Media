const Chat = require("../models/chat.model");

const onlineUsers = new Map();

module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    /////////////////////////////////////////////////////
    // JOIN
    /////////////////////////////////////////////////////
    socket.on("join_chat", async ({ userId }) => {
      onlineUsers.set(String(userId), socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      // send undelivered
      const messages = await Chat.getUndelivered(userId);

      messages.forEach(msg => {
        socket.emit("receive_message", msg);
      });
    });

    /////////////////////////////////////////////////////
    // SEND
    /////////////////////////////////////////////////////
    socket.on("send_message", async (data) => {
      const newMsg = await Chat.createMessage(data);

      const receiverSocket = onlineUsers.get(
        String(data.receiver_id)
      );

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", newMsg);
      }

      socket.emit("message_sent", newMsg);
    });

    /////////////////////////////////////////////////////
    // TYPING
    /////////////////////////////////////////////////////
    socket.on("typing", ({ sender_id, receiver_id }) => {
      const sock = onlineUsers.get(String(receiver_id));
      if (sock) io.to(sock).emit("typing");
    });

    socket.on("stop_typing", ({ receiver_id }) => {
      const sock = onlineUsers.get(String(receiver_id));
      if (sock) io.to(sock).emit("stop_typing");
    });

    /////////////////////////////////////////////////////
    // SEEN
    /////////////////////////////////////////////////////
    socket.on("seen", async ({ sender_id, receiver_id }) => {
      const result = await Chat.markSeen(sender_id, receiver_id);

      const senderSocket = onlineUsers.get(String(sender_id));

      if (senderSocket) {
        result.ids.forEach(id => {
          io.to(senderSocket).emit("message_seen", { message_id: id });
        });
      }
    });

    /////////////////////////////////////////////////////
    // DISCONNECT
    /////////////////////////////////////////////////////
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