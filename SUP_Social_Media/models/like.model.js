const db = require('../config/db');

class Like {

  static async likePost(postId, userId) {
    await db.query(
      `INSERT INTO auth.post_likes (post_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [postId, userId]
    );

    // optional count update
    await db.query(
      `UPDATE auth.posts
       SET like_count = like_count + 1
       WHERE id = $1`,
      [postId]
    );
  }

  static async unlikePost(postId, userId) {
    const result = await db.query(
      `DELETE FROM auth.post_likes
       WHERE post_id=$1 AND user_id=$2
       RETURNING *`,
      [postId, userId]
    );

    if (result.rowCount > 0) {
      await db.query(
        `UPDATE auth.posts
         SET like_count = like_count - 1
         WHERE id = $1`,
        [postId]
      );
    }
  }

}

module.exports = Like;