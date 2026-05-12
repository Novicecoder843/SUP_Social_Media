const jwt = require("jsonwebtoken");
const Chat = require("../models/chat.model");

const onlineUsers = new Map();

module.exports = (io) => {

  /////////////////////////////////////////////////////
  // AUTH
  /////////////////////////////////////////////////////
  io.use((socket, next) => {

    try {

      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.id;

      next();

    } catch (err) {

      console.log("❌ JWT ERROR");

      next(new Error("Invalid token"));
    }
  });

  /////////////////////////////////////////////////////
  // CONNECTION
  /////////////////////////////////////////////////////
  io.on("connection", async (socket) => {

    const userId = socket.userId;

    console.log("🟢 User connected:", userId);

    /////////////////////////////////////////////////////
    // STORE USER
    /////////////////////////////////////////////////////
    onlineUsers.set(
      String(userId),
      socket.id
    );

    console.log(
      "👥 Online Users:",
      Array.from(onlineUsers.keys())
    );

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.keys())
    );

    /////////////////////////////////////////////////////
    // SEND UNDELIVERED
    /////////////////////////////////////////////////////
    try {

      const messages =
        await Chat.getUndelivered(userId);

      messages.forEach(msg => {
        socket.emit("receive_message", msg);
      });

    } catch (err) {

      console.log(
        "❌ Undelivered Error:",
        err.message
      );
    }

    /////////////////////////////////////////////////////
    // SEND MESSAGE
    /////////////////////////////////////////////////////
    socket.on(
      "send_message",
      async (data) => {

        try {

          console.log("📩 MESSAGE:", data);

          const newMsg =
            await Chat.createMessage(data);

          const receiverSocket =
            onlineUsers.get(
              String(data.receiver_id)
            );

          /////////////////////////////////////////////////////
          // SEND TO RECEIVER
          /////////////////////////////////////////////////////
          if (receiverSocket) {

            io.to(receiverSocket)
              .emit(
                "receive_message",
                newMsg
              );
          }

          /////////////////////////////////////////////////////
          // SEND BACK TO SENDER
          /////////////////////////////////////////////////////
          socket.emit(
            "message_sent",
            newMsg
          );

        } catch (err) {

          console.log(
            "❌ Send Error:",
            err.message
          );
        }
      }
    );

    /////////////////////////////////////////////////////
    // TYPING
    /////////////////////////////////////////////////////
    socket.on(
      "typing",
      ({ receiver_id }) => {

        const sock =
          onlineUsers.get(
            String(receiver_id)
          );

        if (sock) {

          io.to(sock).emit(
            "typing",
            {
              sender_id: userId
            }
          );
        }
      }
    );

    /////////////////////////////////////////////////////
    // STOP TYPING
    /////////////////////////////////////////////////////
    socket.on(
      "stop_typing",
      ({ receiver_id }) => {

        const sock =
          onlineUsers.get(
            String(receiver_id)
          );

        if (sock) {

          io.to(sock).emit(
            "stop_typing",
            {
              sender_id: userId
            }
          );
        }
      }
    );

    /////////////////////////////////////////////////////
    // SEEN
    /////////////////////////////////////////////////////
    socket.on(
      "seen",
      async ({ sender_id }) => {

        try {

          const result =
            await Chat.markSeen(
              sender_id,
              userId
            );

          const senderSocket =
            onlineUsers.get(
              String(sender_id)
            );

          if (senderSocket) {

            result.ids.forEach(id => {

              io.to(senderSocket)
                .emit(
                  "message_seen",
                  {
                    message_id: id
                  }
                );
            });
          }

        } catch (err) {

          console.log(
            "❌ Seen Error:",
            err.message
          );
        }
      }
    );

    /////////////////////////////////////////////////////
    // DISCONNECT
    /////////////////////////////////////////////////////
    socket.on("disconnect", () => {

      console.log(
        "🔴 User disconnected:",
        userId
      );

      onlineUsers.delete(
        String(userId)
      );

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );
    });
  });
};