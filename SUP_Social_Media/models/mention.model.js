const db = require('../config/db');

class Mention {

  // 🔥 Extract @mentions
  static extractMentions(content) {
    const matches = content.match(/@\w+/g);
    return matches
      ? matches.map(m => m.replace('@', '').toLowerCase())
      : [];
  }

  // 🔍 Get user by username
  static async getUserByUsername(username) {
    const result = await db.query(
      `SELECT id, username
       FROM auth.users
       WHERE username = $1`,
      [username]
    );

    return result.rows[0];
  }

  // 🔗 Link mention
  static async addMention(postId, userId) {
    await db.query(
      `INSERT INTO auth.post_mentions (post_id, mentioned_user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [postId, userId]
    );
  }

  // 📥 Get mentions of a post
  static async getMentionsByPost(postId) {
    const result = await db.query(
      `SELECT u.id, u.username
       FROM auth.post_mentions pm
       JOIN auth.user u ON u.id = pm.mentioned_user_id
       WHERE pm.post_id = $1`,
      [postId]
    );

    return result.rows;
  }

  // 📥 Get posts where user is mentioned
  static async getPostsWhereUserMentioned(userId) {
    const result = await db.query(
      `SELECT p.*
       FROM auth.post_mentions pm
       JOIN auth.posts p ON p.id = pm.post_id
       WHERE pm.mentioned_user_id = $1`,
      [userId]
    );

    return result.rows;
  }
}

module.exports = Mention;