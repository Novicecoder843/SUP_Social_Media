const db = require('../config/db');

class Report {

  static async reportPost(userId, postId, reason) {
    await db.query(
      `INSERT INTO auth.post_reports (post_id, user_id, reason)
       VALUES ($1,$2,$3)
       ON CONFLICT (post_id, user_id)
       DO UPDATE SET reason = EXCLUDED.reason`,
      [postId, userId, reason]
    );
  }

}

module.exports = Report;