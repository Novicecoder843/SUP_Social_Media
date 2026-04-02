const db = require('../config/db');

class Share {

  static async sharePost(userId, postId, comment) {
    await db.query(
      `INSERT INTO auth.post_shares (post_id, user_id, comment)
       VALUES ($1,$2,$3)
       ON CONFLICT (post_id, user_id)
       DO UPDATE SET comment = EXCLUDED.comment`,
      [postId, userId, comment || null]
    );
  }

  static async getShares(postId) {

    const sharesRes = await db.query(
      `SELECT 
          u.id,
          u.email,
          ps.comment,
          ps.created_at
       FROM auth.post_shares ps
       JOIN auth.users u ON u.id = ps.user_id   -- ✅ FIXED
       WHERE ps.post_id = $1
       ORDER BY ps.created_at DESC`,
      [postId]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM auth.post_shares WHERE post_id = $1`,
      [postId]
    );

    return {
      count: Number(countRes.rows[0].count),
      users: sharesRes.rows
    };
  }
}

module.exports = Share;