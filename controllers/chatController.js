const pool = require("../db/db");

// GET CHAT HISTORY
exports.getChats = async (req, res) => {
  try {

    const { userId } = req.params;

    const chats = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [req.user.id, userId]
    );

    res.status(200).json({
      success: true,
      chats: chats.rows
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Fetch chats failed"
    });
  }
};

// GET ALL CONVERSATIONS
exports.getConversations = async (req, res) => {
  try {

    const conversations = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,

        (
          SELECT message
          FROM messages
          WHERE
            (sender_id = u.id AND receiver_id = $1)
            OR
            (sender_id = $1 AND receiver_id = u.id)
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_message,

        (
          SELECT created_at
          FROM messages
          WHERE
            (sender_id = u.id AND receiver_id = $1)
            OR
            (sender_id = $1 AND receiver_id = u.id)
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_message_time

      FROM users u

      WHERE u.id != $1

      ORDER BY last_message_time DESC NULLS LAST
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      conversations: conversations.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Fetch conversations failed"
    });

  }
};