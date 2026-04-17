const pool = require("../config/db");

exports.sendMessage = async (senderId, receiverId, message) => {
  // SAVE MESSAGE
  const result = await pool.query(
    "INSERT INTO messages(sender_id, receiver_id, message) VALUES($1,$2,$3) RETURNING *",
    [senderId, receiverId, message]
  );

  // FIND RECEIVER SOCKET
  const socketId = global.onlineUsers[receiverId];

  // SEND REAL-TIME
  if (socketId) {
    global.io.to(socketId).emit("receive_message", result.rows[0]);
  }

  return result.rows[0];
};