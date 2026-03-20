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



exports.getConversation = (user1, user2, limit = 20, offset = 0) => {
  return pool.query(
    `
    SELECT 
      c.id,
      c.message,
      c.sender_id,
      c.receiver_id,
      c.parent_message_id,
      c.is_deleted,
      c.created_at,

      u.full_name AS sender_name,
      up.username AS sender_username,
      up.profile_image AS sender_profile

    FROM user_schema.chats c
    JOIN user_schema.userstable u ON u.id = c.sender_id
    LEFT JOIN user_schema.user_profiles up ON up.user_id = u.id

    WHERE 
      (c.sender_id = $1 AND c.receiver_id = $2)
      OR
      (c.sender_id = $2 AND c.receiver_id = $1)

    ORDER BY c.created_at ASC
    LIMIT $3 OFFSET $4
    `,
    [user1, user2, limit, offset]
  );
};

exports.markAsSeen = async (senderId, receiverId) => {
  const query = `
        UPDATE user_schema.chats
        SET is_seen = true
        WHERE sender_id = $1 AND receiver_id = $2 AND is_seen = false
        RETURNING *;
    `;
  const result = await pool.query(query, [senderId, receiverId]);

  return {
    rows: result.rows,
    count: result.rowCount
  };
};