const db = require("../config/db");

exports.toggleBlock = async (blocker_id, blocked_id) => {

  const check = await db.query(
    `SELECT * FROM public.user_blocks WHERE blocker_id=$1 AND blocked_id=$2`,
    [blocker_id, blocked_id]
  );

  if (check.rows.length) {
    // unblock
    await db.query(
     `DELETE FROM public.user_blocks WHERE blocker_id=$1 AND blocked_id=$2`,
      [blocker_id, blocked_id]
    );

    return { message: "User unblocked successfully" };
  }

  // block user
  await db.query(
    `INSERT INTO public.user_blocks (blocker_id, blocked_id) VALUES ($1, $2)`,
    [blocker_id, blocked_id]
  );

  // remove follow relations
  await db.query(
    `
    DELETE FROM user_followers 
    WHERE 
      (following_id=$1 AND follower_id=$2)
      OR
      (following_id=$2 AND follower_id=$1)
    `,
    [blocker_id, blocked_id]
  );

  return { message: "User blocked successfully" };
};