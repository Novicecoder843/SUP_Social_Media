const db = require("../config/db");

exports.toggleBlock = async (userId, blockedUserId) => {
  // check if already blocked
  const check = await db.query(
    `SELECT id FROM user_blocks WHERE user_id=$1 AND blocked_user_id=$2`,
    [userId, blockedUserId]
  );

  if (check.rows.length) {
    // unblock
    await db.query(
      `DELETE FROM user_blocks WHERE user_id=$1 AND blocked_user_id=$2`,
      [userId, blockedUserId]
    );
    return "unblocked";
  }

  // block user
  await db.query(
    `INSERT INTO user_blocks (user_id, blocked_user_id) VALUES ($1, $2)`,
    [userId, blockedUserId]
  );

  // remove follow relations (both sides)
  await db.query(
    `
    DELETE FROM user_followers 
    WHERE 
      (user_id=$1 AND follower_id=$2)
      OR
      (user_id=$2 AND follower_id=$1)
    `,
    [userId, blockedUserId]
  );

  return "blocked";
};