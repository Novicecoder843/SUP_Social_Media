// const db = require('../config/db');

// class Comment {

//   static async addComment(postId, userId, content) {
//     const result = await db.query(
//       `INSERT INTO auth.comments (post_id, user_id, content)
//        VALUES ($1,$2,$3)
//        RETURNING *`,
//       [postId, userId, content]
//     );

//     await db.query(
//       `UPDATE auth.posts
//        SET comment_count = comment_count + 1
//        WHERE id = $1`,
//       [postId]
//     );

//     return result.rows[0];
//   }

//   static async getComments(postId) {
//     const result = await db.query(
//       `SELECT c.id, c.content, c.created_at, u.email
//        FROM auth.comments c
//        JOIN auth.users u ON c.user_id = u.id
//        WHERE c.post_id = $1
//        AND c.is_deleted = false
//        ORDER BY c.created_at DESC`,
//       [postId]
//     );

//     return result.rows;
//   }

// }

// module.exports = Comment;
const db = require('../config/db');

class Comment {

  static async deleteComment(commentId, userId) {
    const result = await db.query(
      `UPDATE auth.comments
       SET is_deleted = true
       WHERE id = $1 AND user_id = $2
       RETURNING post_id`,
      [commentId, userId]
    );

    if (result.rowCount > 0) {
      const postId = result.rows[0].post_id;

      await db.query(
        `UPDATE auth.posts
         SET comment_count = comment_count - 1
         WHERE id = $1`,
        [postId]
      );
    }

    return result.rowCount;
  }
}

module.exports = Comment;