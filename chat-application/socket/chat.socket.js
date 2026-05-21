// const jwt = require("jsonwebtoken");
// const Chat = require("../models/chat.model");

// const onlineUsers = new Map();

// module.exports = (io) => {

//   /////////////////////////////////////////////////////
//   // AUTH
//   /////////////////////////////////////////////////////
//   io.use((socket, next) => {

//     try {

//       const token = socket.handshake.auth.token;

//       if (!token) {
//         return next(new Error("No token"));
//       }

//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET
//       );

//       socket.userId = decoded.id;

//       next();

//     } catch (err) {

//       console.log("❌ JWT ERROR");

//       next(new Error("Invalid token"));
//     }
//   });

//   /////////////////////////////////////////////////////
//   // CONNECTION
//   /////////////////////////////////////////////////////
//   io.on("connection", async (socket) => {

//     const userId = socket.userId;

//     console.log("🟢 User connected:", userId);

//     /////////////////////////////////////////////////////
//     // STORE USER
//     /////////////////////////////////////////////////////
//     onlineUsers.set(
//       String(userId),
//       socket.id
//     );

//     console.log(
//       "👥 Online Users:",
//       Array.from(onlineUsers.keys())
//     );

//     io.emit(
//       "onlineUsers",
//       Array.from(onlineUsers.keys())
//     );

//     /////////////////////////////////////////////////////
//     // SEND UNDELIVERED
//     /////////////////////////////////////////////////////
//     try {

//       const messages =
//         await Chat.getUndelivered(userId);

//       messages.forEach(msg => {
//         socket.emit("receive_message", msg);
//       });

//     } catch (err) {

//       console.log(
//         "❌ Undelivered Error:",
//         err.message
//       );
//     }

//     /////////////////////////////////////////////////////
//     // SEND MESSAGE
//     /////////////////////////////////////////////////////
//     socket.on(
//       "send_message",
//       async (data) => {

//         try {

//           console.log("📩 MESSAGE:", data);

//           const newMsg =
//             await Chat.createMessage(data);

//           const receiverSocket =
//             onlineUsers.get(
//               String(data.receiver_id)
//             );

//           /////////////////////////////////////////////////////
//           // SEND TO RECEIVER
//           /////////////////////////////////////////////////////
//           if (receiverSocket) {

//             io.to(receiverSocket)
//               .emit(
//                 "receive_message",
//                 newMsg
//               );
//           }

//           /////////////////////////////////////////////////////
//           // SEND BACK TO SENDER
//           /////////////////////////////////////////////////////
//           socket.emit(
//             "message_sent",
//             newMsg
//           );

//         } catch (err) {

//           console.log(
//             "❌ Send Error:",
//             err.message
//           );
//         }
//       }
//     );

//     /////////////////////////////////////////////////////
//     // TYPING
//     /////////////////////////////////////////////////////
//     socket.on(
//       "typing",
//       ({ receiver_id }) => {

//         const sock =
//           onlineUsers.get(
//             String(receiver_id)
//           );

//         if (sock) {

//           io.to(sock).emit(
//             "typing",
//             {
//               sender_id: userId
//             }
//           );
//         }
//       }
//     );

//     /////////////////////////////////////////////////////
//     // STOP TYPING
//     /////////////////////////////////////////////////////
//     socket.on(
//       "stop_typing",
//       ({ receiver_id }) => {

//         const sock =
//           onlineUsers.get(
//             String(receiver_id)
//           );

//         if (sock) {

//           io.to(sock).emit(
//             "stop_typing",
//             {
//               sender_id: userId
//             }
//           );
//         }
//       }
//     );

//     /////////////////////////////////////////////////////
//     // SEEN
//     /////////////////////////////////////////////////////
//     socket.on(
//       "seen",
//       async ({ sender_id }) => {

//         try {

//           const result =
//             await Chat.markSeen(
//               sender_id,
//               userId
//             );

//           const senderSocket =
//             onlineUsers.get(
//               String(sender_id)
//             );

//           if (senderSocket) {

//             result.ids.forEach(id => {

//               io.to(senderSocket)
//                 .emit(
//                   "message_seen",
//                   {
//                     message_id: id
//                   }
//                 );
//             });
//           }

//         } catch (err) {

//           console.log(
//             "❌ Seen Error:",
//             err.message
//           );
//         }
//       }
//     );

//     /////////////////////////////////////////////////////
//     // DISCONNECT
//     /////////////////////////////////////////////////////
//     socket.on("disconnect", () => {

//       console.log(
//         "🔴 User disconnected:",
//         userId
//       );

//       onlineUsers.delete(
//         String(userId)
//       );

//       io.emit(
//         "onlineUsers",
//         Array.from(onlineUsers.keys())
//       );
//     });
//   });
// };

const jwt = require("jsonwebtoken");
const Chat = require("../models/chat.model");

/////////////////////////////////////////////////////
// ONLINE USERS
/////////////////////////////////////////////////////
const onlineUsers = new Map();

module.exports = (io) => {

  /////////////////////////////////////////////////////
  // 🔐 AUTH
  /////////////////////////////////////////////////////
  io.use((socket, next) => {

    try {

      const token =
        socket.handshake.auth.token;

      if (!token) {
        return next(
          new Error("No token")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.id;

      next();

    } catch (err) {

      console.log(
        "❌ JWT ERROR:",
        err.message
      );

      next(
        new Error("Invalid token")
      );
    }
  });

  /////////////////////////////////////////////////////
  // 🔌 CONNECTION
  /////////////////////////////////////////////////////
  io.on(
    "connection",
    async (socket) => {

      const userId =
        socket.userId;

      /////////////////////////////////////////////////////
      // STORE USER
      /////////////////////////////////////////////////////
      onlineUsers.set(
        String(userId),
        socket.id
      );

      /////////////////////////////////////////////////////
      // TERMINAL LOG
      /////////////////////////////////////////////////////
      console.log(
        "🟢 User connected:",
        userId
      );

      console.log(
        "👥 Online Users:",
        Object.fromEntries(
          onlineUsers
        )
      );

      /////////////////////////////////////////////////////
      // SEND ONLINE USERS
      /////////////////////////////////////////////////////
      io.emit(
        "onlineUsers",
        Array.from(
          onlineUsers.keys()
        )
      );

      /////////////////////////////////////////////////////
      // 📩 SEND UNDELIVERED MESSAGES
      /////////////////////////////////////////////////////
      try {

        const messages =
          await Chat.getUndelivered(
            userId
          );

        messages.forEach(msg => {

          socket.emit(
            "receive_message",
            msg
          );
        });

      } catch (err) {

        console.log(
          "❌ Undelivered Error:",
          err.message
        );
      }

      /////////////////////////////////////////////////////
      // 👥 JOIN GROUP
      /////////////////////////////////////////////////////
      socket.on(
        "join_group",
        (groupId) => {

          socket.join(
            "group_" + groupId
          );

          console.log(
            `👥 User ${userId} joined group ${groupId}`
          );
        }
      );

      /////////////////////////////////////////////////////
      // 📤 SEND PRIVATE MESSAGE
      /////////////////////////////////////////////////////
      socket.on(
        "send_message",
        async (data) => {

          try {

            console.log(
              "📩 PRIVATE MESSAGE:",
              data
            );

            /////////////////////////////////////////////////////
            // SAVE MESSAGE
            /////////////////////////////////////////////////////
            const newMsg =
              await Chat.createMessage({
                sender_id: userId,
                receiver_id:
                  data.receiver_id,
                message:
                  data.message
              });

            /////////////////////////////////////////////////////
            // RECEIVER SOCKET
            /////////////////////////////////////////////////////
            const receiverSocket =
              onlineUsers.get(
                String(
                  data.receiver_id
                )
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
      // 👥 SEND GROUP MESSAGE
      /////////////////////////////////////////////////////
      socket.on(
        "send_group_message",
        async (data) => {

          try {

            console.log(
              "👥 GROUP MESSAGE:",
              data
            );

            /////////////////////////////////////////////////////
            // SAVE GROUP MESSAGE
            /////////////////////////////////////////////////////
            const msg =
              await Chat.createGroupMessage(
                data.group_id,
                userId,
                data.message
              );

            /////////////////////////////////////////////////////
            // SEND TO GROUP
            /////////////////////////////////////////////////////
            io.to(
              "group_" +
              data.group_id
            ).emit(
              "receive_group_message",
              msg
            );

          } catch (err) {

            console.log(
              "❌ GROUP ERROR:",
              err.message
            );
          }
        }
      );

      /////////////////////////////////////////////////////
      // ✍️ TYPING
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
      // ⛔ STOP TYPING
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
      // 👀 SEEN
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
// 🗑 DELETE MESSAGE
/////////////////////////////////////////////////////

socket.on(
  "delete_message",
  async ({
    message_id,
    receiver_id
  }) => {

    try {

      /////////////////////////////////////////////////////
      // DELETE FROM DB
      /////////////////////////////////////////////////////

      const deleted =
        await Chat.deleteMessage(
          message_id,
          userId
        );

      /////////////////////////////////////////////////////
      // NOT FOUND
      /////////////////////////////////////////////////////

      if (!deleted) {

        return console.log(
          "❌ Message not found"
        );
      }

      console.log(
        "🗑 Message Deleted:",
        message_id
      );

      /////////////////////////////////////////////////////
      // RECEIVER SOCKET
      /////////////////////////////////////////////////////

      const receiverSocket =
        onlineUsers.get(
          String(receiver_id)
        );

      /////////////////////////////////////////////////////
      // SEND DELETE TO RECEIVER
      /////////////////////////////////////////////////////

      if (receiverSocket) {

        io.to(receiverSocket)
          .emit(
            "message_deleted",
            {
              message_id
            }
          );
      }

      /////////////////////////////////////////////////////
      // SEND DELETE TO SENDER
      /////////////////////////////////////////////////////

      socket.emit(
        "message_deleted",
        {
          message_id
        }
      );

    } catch (err) {

      console.log(
        "❌ DELETE ERROR:",
        err.message
      );
    }
  }
);
      /////////////////////////////////////////////////////
      // 🔴 DISCONNECT
      /////////////////////////////////////////////////////
      socket.on(
        "disconnect",
        () => {

          /////////////////////////////////////////////////////
          // REMOVE USER
          /////////////////////////////////////////////////////
          onlineUsers.delete(
            String(userId)
          );

          /////////////////////////////////////////////////////
          // TERMINAL LOG
          /////////////////////////////////////////////////////
          console.log(
            "🔴 User disconnected:",
            userId
          );

          console.log(
            "👥 Online Users:",
            Object.fromEntries(
              onlineUsers
            )
          );

          /////////////////////////////////////////////////////
          // SEND ONLINE USERS
          /////////////////////////////////////////////////////
          io.emit(
            "onlineUsers",
            Array.from(
              onlineUsers.keys()
            )
          );
        }
      );
    }
  );
};