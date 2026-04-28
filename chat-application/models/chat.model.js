const db = require("../config/db");

// 💬 Send message
exports.send = async (senderId, receiverId, message) => {
  const result = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, message)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [senderId, receiverId, message]
  );

  return result.rows[0];
};

// 🔁 Reply
exports.reply = async (senderId, message, parentId) => {
  const result = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, message, parent_id)
     SELECT $1, sender_id, $2, $3
     FROM messages WHERE id=$3
     RETURNING *`,
    [senderId, message, parentId]
  );

  return result.rows[0];
};

// 📩 Get chat
exports.getChat = async (user1, user2) => {
  const result = await db.query(
    `SELECT * FROM messages
     WHERE ((sender_id=$1 AND receiver_id=$2)
     OR (sender_id=$2 AND receiver_id=$1))
     AND is_deleted=false
     ORDER BY created_at ASC`,
    [user1, user2]
  );

  return result.rows;
};

// ❌ Delete
exports.delete = async (messageId, userId) => {
  await db.query(
    `UPDATE messages
     SET is_deleted=true
     WHERE id=$1 AND sender_id=$2`,
    [messageId, userId]
  );
};