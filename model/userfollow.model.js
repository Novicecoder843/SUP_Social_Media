const pool = require("../config/db");

/* ================= FOLLOW USER ================= */
exports.followUser = async (followerId, followingId) => {
  const result = await pool.query(
    `INSERT INTO user_followers (follower_id, following_id)
     VALUES ($1, $2)
     RETURNING *`,
    [followerId, followingId]
  );

  return result.rows[0];
};

/* ================= UNFOLLOW USER ================= */
exports.unfollowUser = async (followerId, followingId) => {
  await pool.query(
    `DELETE FROM user_followers
     WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId]
  );
};

/* ================= BLOCK USER ================= */
exports.blockUser = async (blockerId, blockedId) => {
  const result = await pool.query(
    `INSERT INTO user_blocks (blocker_id, blocked_id)
     VALUES ($1, $2)
     RETURNING *`,
    [blockerId, blockedId]
  );

  return result.rows[0];
};
