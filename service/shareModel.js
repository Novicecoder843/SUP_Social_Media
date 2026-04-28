const pool = require("../db/db");

// SHARE
const sharePost = async (user_id, post_id) => {
  await pool.query(
    `INSERT INTO shares (user_id, post_id)
     VALUES ($1, $2)`,
    [user_id, post_id]
  );
};

// UNSHARE
const unsharePost = async (user_id, post_id) => {
  await pool.query(
    `DELETE FROM shares
     WHERE user_id=$1 AND post_id=$2`,
    [user_id, post_id]
  );
};

// COUNT
const getShareCount = async (post_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM shares WHERE post_id=$1`,
    [post_id]
  );

  return result.rows[0].count;
};

// USERS
const getSharedUsers = async (post_id) => {
  const result = await pool.query(
    `SELECT user_id FROM shares WHERE post_id=$1`,
    [post_id]
  );

  return result.rows;
};

module.exports = {
  sharePost,
  unsharePost,
  getShareCount,
  getSharedUsers
};