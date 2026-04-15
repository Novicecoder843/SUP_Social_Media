

const db = require("../config/db");



// ONLINE
exports.setOnline = async (userId) => {
  await db.query(
    `UPDATE user_schema.userstable 
     SET status = true WHERE id=$1`,
    [userId]
  );
};



exports.createMessage = async (sender, receiver, message) => {
  try {
    const result = await db.query(
      `INSERT INTO user_schema.chats(sender_id, receiver_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [sender, receiver, message]
    );

    return result.rows[0];
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;  // ✅ MUST ADD
  }
};



exports.getConversation = async (user1, user2) => {
  const result = await db.query(
    `SELECT * FROM user_schema.chats
     WHERE (sender_id=$1 AND receiver_id=$2)
     OR (sender_id=$2 AND receiver_id=$1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );
  return result.rows;
};

// MARK DELIVERED
exports.markDelivered = async (id) => {
  await db.query(
    `UPDATE user_schema.chats 
     SET is_delivered = TRUE 
     WHERE id=$1`,
    [id]
  );
};


exports.markAsSeen = async (sender_id, receiver_id) => {
  const result = await db.query(
    `UPDATE user_schema.chats
     SET is_seen = TRUE
     WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=FALSE`,
    [sender_id, receiver_id]
  );
  return result.rowCount;
};




// OFFLINE
exports.setOffline = async (userId) => {
  await db.query(
    `UPDATE user_schema.userstable 
     SET status=FALSE, last_seen=NOW() WHERE id=$1`,
    [userId]
  );
};


// 📩 get undelivered messages
exports.getUndeliveredMessages = async (userId) => {
  const result = await db.query(
    `SELECT * FROM user_schema.chats
     WHERE receiver_id = $1 AND is_delivered = false
     ORDER BY id ASC`,
    [userId]
  );

  return result.rows;
};

// ✔✔ mark delivered
exports.markAllDelivered = async (userId) => {
  await db.query(
    `UPDATE user_schema.chats
     SET is_delivered = true
     WHERE receiver_id = $1 AND is_delivered = false`,
    [userId]
  );
};