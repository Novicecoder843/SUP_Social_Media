const db = require('../config/db');

class Analytics {

  static async getPostAnalytics(postId) {

    const likes = await db.query(
      `SELECT COUNT(*) FROM auth.post_likes WHERE post_id = $1`,
      [postId]
    );

    const comments = await db.query(
      `SELECT COUNT(*) FROM auth.comments WHERE post_id = $1`,
      [postId]
    );

    const shares = await db.query(
      `SELECT COUNT(*) FROM auth.post_shares WHERE post_id = $1`,
      [postId]
    );

    const saves = await db.query(
      `SELECT COUNT(*) FROM auth.saved_posts WHERE post_id = $1`,
      [postId]
    );

    return {
      likes: Number(likes.rows[0].count),
      comments: Number(comments.rows[0].count),
      shares: Number(shares.rows[0].count),
      saves: Number(saves.rows[0].count),
      reach: 0 // optional (not tracked yet)
    };
  }

}

module.exports = Analytics;