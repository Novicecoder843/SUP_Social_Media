const db = require("../config/db");

exports.toggleFollow = async (userId, followerId) => {
  try {
  // check already following
  const existing = await db.query(
    `SELECT * FROM user_followers WHERE following_id =$1 AND follower_id =$2`,
    [userId, followerId]
  );

  if (existing.rows.length > 0) {
    // unfollow
    await db.query(
      `DELETE FROM user_followers WHERE following_id =$1 AND follower_id =$2`,
      [userId, followerId]
    );
    return "unfollowed";
  } else {
    // follow
    await db.query(
      `INSERT INTO user_followers (following_id, follower_id) VALUES ($1, $2)`,
      [userId, followerId]
    );
    return "followed";
  }

} catch(err) {
  console.log(err);
  throw err;
}
};