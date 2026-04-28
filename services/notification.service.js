const db = require("../db");
const { getIO } = require("../sockets/socket");

exports.createNotification = async ({ senderId, receiverId, type, postId }) => {
  await db.query(
    `INSERT INTO notifications(sender_id, receiver_id, type, post_id)
     VALUES($1,$2,$3,$4)`,
    [senderId, receiverId, type, postId]
  );

  const io = getIO();
  io.to(`user_${receiverId}`).emit("notification", {
    type,
    postId,
    senderId
  });
};