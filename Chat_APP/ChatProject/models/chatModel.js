const db = require("../config/db");

exports.userRegister = async(full_name , email ,password_hash,) =>{
  const result = await db.query(`
    INSERT INTO chat_schema.userstable (full_name, email, password_hash)
    VALUES ($1,$2,$3) RETURNING * `,
  [full_name , email , password_hash ]);
  return result.rows[0];
};



exports.findByEmail = async (email  )=>{

  const result = await db.query (`
    SELECT id , full_name ,email ,password_hash , status FROM
    chat_schema.userstable 
    WHERE email = $1  `
  ,[email]);
  return result.rows[0];
}


// ONLINE
exports.setOnline = async (userId) => {
  await db.query(
    `UPDATE chat_schema.userstable 
     SET is_online=TRUE WHERE id=$1`,
    [userId]
  );
};



exports.createMessage = async (sender, receiver, message) => {
  try {
    const result = await db.query(
      `INSERT INTO chat_schema.chats(sender_id, receiver_id, message)
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
    `SELECT * FROM chat_schema.chats
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
    `UPDATE chat_schema.chats 
     SET is_delivered = TRUE 
     WHERE id=$1`,
    [id]
  );
};
 

exports.markAsSeen = async (sender_id, receiver_id) => {
  const result = await db.query(
    `UPDATE chat_schema.chats
     SET is_seen = TRUE
     WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=FALSE`,
    [sender_id, receiver_id]
  );
  return result.rowCount;
};




// OFFLINE
exports.setOffline = async (userId) => {
  await db.query(
    `UPDATE chat_schema.userstable 
     SET is_online=FALSE, last_seen=NOW() WHERE id=$1`,
    [userId]
  );
};