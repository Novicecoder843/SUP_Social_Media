

const db = require("../config/db");



// ONLINE
exports.setOnline = async (userId) => {
  await db.query(
    `UPDATE user_schema.userstable 
     SET status = true WHERE id=$1`,
    [userId]
  );
};



exports.createMessage = async (sender, receiver, message , media_url = null) => {
  try {
    const result = await db.query(
      `INSERT INTO user_schema.chats(sender_id, receiver_id, message,media_url)
       VALUES ($1, $2, $3,$4) RETURNING *`,
      [sender, receiver, message,media_url]
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



exports.createGroupMessage = async (group_id, sender_id, message,media_url = null) => {
  const result = await db.query(
    `
    INSERT INTO user_schema.group_messages (group_id, sender_id, message ,media_url)
    VALUES ($1, $2, $3,$4)
    RETURNING id, group_id, sender_id, message, created_at
    `,
    [group_id, sender_id, message,media_url]
  );

  const msg = result.rows[0];

  // 🔥 JOIN USER NAME
  const user = await db.query(
    `SELECT full_name FROM user_schema.userstable WHERE id = $1`,
    [sender_id]
  );

  msg.sender_name = user.rows[0]?.full_name || "Unknown";

  return msg;
};



exports.getGroupMessages = async (groupId) => {
  const result = await db.query(
    `SELECT gm.*, u.full_name AS sender_name
FROM user_schema.group_messages gm
JOIN user_schema.userstable u
ON gm.sender_id = u.id
WHERE gm.group_id = $1
ORDER BY gm.created_at ASC`,
    [groupId]
  );

  return result.rows;
};


exports.deleteMessage = async (messageId) => {

  const query = `
        DELETE FROM user_schema.chats
        WHERE id = $1
    `;

  await db.query(query, [messageId]);
};

exports.deleteForEveryone = async (messageId) => {

  const query = `
        UPDATE user_schema.chats
        SET
            is_deleted = TRUE,
            message = 'This message was deleted'
        WHERE id = $1
    `;

  await db.query(query, [messageId]);
};