const db = require("../config/db");

exports.createMessage = async (data) => {
  const { sender_id, receiver_id, message, parent_message_id } = data;

  const result = await db.query(
    `INSERT INTO user_schema.chats
     (sender_id, receiver_id, message, parent_message_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [sender_id, receiver_id, message, parent_message_id || null]
  );

  return result.rows[0];
};


exports.getConversation = async (user1, user2) => {
  const result = await db.query(
    `SELECT * FROM user_schema.chats
     WHERE 
      (sender_id=$1 AND receiver_id=$2)
      OR
      (sender_id=$2 AND receiver_id=$1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );

  return result.rows;
};


exports.markSeen = async (sender_id, receiver_id) => {
  await db.query(
    `UPDATE user_schema.chats
     SET is_seen = TRUE
     WHERE sender_id=$1 AND receiver_id=$2`,
    [sender_id, receiver_id]
  );
};