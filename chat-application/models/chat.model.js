
const db = require("../config/db");

/////////////////////////////////////////////////////
// 💬 SEND MESSAGE
/////////////////////////////////////////////////////
exports.sendMessage = async (senderId, receiverId, message) => {
  const result = await db.query(
    `INSERT INTO public.messages (sender_id, receiver_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [senderId, receiverId, message]
  );

  return result.rows[0];
};

/////////////////////////////////////////////////////
// 💬 CREATE MESSAGE (SOCKET)
/////////////////////////////////////////////////////
exports.createMessage = async ({ sender_id, receiver_id, message, parent_id }) => {
  const result = await db.query(
    `INSERT INTO public.messages (sender_id, receiver_id, message, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sender_id, receiver_id, message, parent_id || null]
  );

  return result.rows[0];
};

/////////////////////////////////////////////////////
// 🔁 REPLY MESSAGE
/////////////////////////////////////////////////////
exports.replyMessage = async (senderId, receiverId, message, parentId) => {
  const result = await db.query(
    `INSERT INTO public.messages (sender_id, receiver_id, message, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [senderId, receiverId, message, parentId]
  );

  return result.rows[0];
};

/////////////////////////////////////////////////////
// ❌ DELETE MESSAGE
/////////////////////////////////////////////////////
exports.deleteMessage = async (messageId, userId) => {
  await db.query(
    `UPDATE public.messages
     SET is_deleted = true
     WHERE id = $1 AND sender_id = $2`,
    [messageId, userId]
  );
};

/////////////////////////////////////////////////////
// 📩 GET CHAT (NO PAGINATION)
/////////////////////////////////////////////////////
exports.getChat = async (user1, user2) => {
  const result = await db.query(
    `
    SELECT *
    FROM public.messages
    WHERE 
    (
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    )
    AND is_deleted = false
    ORDER BY created_at ASC
    `,
    [user1, user2]
  );

  return result.rows;
};

/////////////////////////////////////////////////////
// 📩 GET CONVERSATION (PAGINATION)
/////////////////////////////////////////////////////
exports.getConversation = async (user1, user2, limit = 20, offset = 0) => {
  const result = await db.query(
    `
    SELECT 
      id,
      message,
      sender_id,
      receiver_id,
      parent_id,
      is_deleted,
      is_delivered,
      is_seen,
      created_at
    FROM public.messages
    WHERE 
    (
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    )
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4
    `,
    [user1, user2, limit, offset]
  );

  return result;
};

/////////////////////////////////////////////////////
// ✔✔ MARK DELIVERED
/////////////////////////////////////////////////////
exports.markDelivered = async (senderId, receiverId) => {
  const result = await db.query(
    `
    UPDATE public.messages
    SET is_delivered = true
    WHERE sender_id = $1
      AND receiver_id = $2
      AND is_delivered = false
    RETURNING id
    `,
    [senderId, receiverId]
  );

  return {
    count: result.rowCount,
    ids: result.rows.map(r => r.id)
  };
};

/////////////////////////////////////////////////////
// 👀 MARK SEEN
/////////////////////////////////////////////////////
exports.markSeen = async (senderId, receiverId) => {
  const result = await db.query(
    `
    UPDATE public.messages
    SET is_seen = true,
        is_delivered = true
    WHERE sender_id = $1
      AND receiver_id = $2
      AND is_seen = false
    RETURNING id
    `,
    [senderId, receiverId]
  );

  return {
    count: result.rowCount,
    ids: result.rows.map(r => r.id)
  };
};

/////////////////////////////////////////////////////
// 📩 UNDELIVERED (OFFLINE)
/////////////////////////////////////////////////////
exports.getUndeliveredMessages = async (userId) => {
  const result = await db.query(
    `
    SELECT *
    FROM public.messages
    WHERE receiver_id = $1
      AND is_delivered = false
    ORDER BY created_at ASC
    `,
    [userId]
  );

  return result.rows;
};

/////////////////////////////////////////////////////
// ✔✔ MARK ALL DELIVERED
/////////////////////////////////////////////////////
exports.markAllDelivered = async (userId) => {
  const result = await db.query(
    `
    UPDATE public.messages
    SET is_delivered = true
    WHERE receiver_id = $1
      AND is_delivered = false
    RETURNING id
    `,
    [userId]
  );

  return {
    count: result.rowCount,
    ids: result.rows.map(r => r.id)
  };
};