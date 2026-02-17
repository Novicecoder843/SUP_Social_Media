const db = require("../config/db");

exports.toggleFollow = async (userId, followerId) => {
  // check already following
  const check = await db.query(
    `SELECT id FROM user_followers WHERE user_id=$1 AND follower_id=$2`,
    [userId, followerId]
  );

  if (check.rows.length) {
    // unfollow
    await db.query(
      `DELETE FROM user_followers WHERE user_id=$1 AND follower_id=$2`,
      [userId, followerId]
    );
    return "unfollowed";
  } else {
    // follow
    await db.query(
      `INSERT INTO user_followers (user_id, follower_id) VALUES ($1, $2)`,
      [userId, followerId]
    );
    return "followed";
  }
};