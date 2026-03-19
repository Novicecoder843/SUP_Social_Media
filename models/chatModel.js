const pool = require("../config/db");

// send message
exports.sendMessage = (senderId, receiverId, message) => {
  return pool.query(
    `INSERT INTO user_schema.chats (sender_id, receiver_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [senderId, receiverId, message]
  );
};

// reply message
exports.replyMessage = (senderId, receiverId, message, parentId) => {
  return pool.query(
    `INSERT INTO user_schema.chats 
     (sender_id, receiver_id, message, parent_message_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [senderId, receiverId, message, parentId]
  );
};

// delete message
exports.deleteMessage = (messageId, userId) => {
  return pool.query(
    `UPDATE user_schema.chats
     SET is_deleted = TRUE
     WHERE id = $1 AND sender_id = $2`,
    [messageId, userId]
  );
};

// get chat between two users
exports.getChat = (user1, user2) => {
  return pool.query(
    `
    SELECT * FROM user_schema.chats
    WHERE 
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
    `,
    [user1, user2]
  );
};