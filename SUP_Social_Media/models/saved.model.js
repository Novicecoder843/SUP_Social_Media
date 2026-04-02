const db = require('../config/db');

class Saved {

  // ✅ Save post
  static async savePost(userId, postId) {
    await db.query(
      `INSERT INTO auth.saved_posts (user_id, post_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [userId, postId]
    );
  }

  // ❌ Unsave post
  static async unsavePost(userId, postId) {
    await db.query(
      `DELETE FROM auth.saved_posts
       WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );
  }

  // 📥 Get saved posts
  static async getSavedPosts(userId) {
    const result = await db.query(
      `SELECT 
          p.id,
          p.content,
          p.created_at,
          u.id AS author_id,
          u.email
       FROM auth.saved_posts sp
       JOIN auth.posts p ON p.id = sp.post_id
       JOIN auth.user u ON u.id = p.user_id
       WHERE sp.user_id = $1
       AND p.is_deleted = false
       ORDER BY sp.created_at DESC`,
      [userId]
    );

    return result.rows;
  }
}

module.exports = Saved;