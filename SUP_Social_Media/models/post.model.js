const db = require('../config/db');

// class Post {

//   static async create(userId, content, visibility) {
//     const result = await db.query(
//       `INSERT INTO auth.posts (user_id, content, visibility)
//        VALUES ($1,$2,$3)
//        RETURNING *`,
//       [userId, content, visibility]
//     );
//     return result.rows[0];
//   }

//   static async getById(id) {
//     const result = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE id=$1 AND is_deleted=false`,
//       [id]
//     );
//     return result.rows[0];
//   }


class Post {

  static async create(userId, content, visibility) {
    const result = await db.query(
      `INSERT INTO auth.posts (user_id, content, visibility)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [userId, content, visibility]
    );
    return result.rows[0];
  }

  static async addMedia(postId, fileName, type) {
    await db.query(
      `INSERT INTO auth.post_media (post_id, media_url, media_type)
       VALUES ($1,$2,$3)`,
      [postId, fileName, type]
    );
  }

  static async getById(id,postId) {
    const post = await db.query(
      `SELECT * FROM auth.posts
       WHERE id=$1 AND is_deleted=false`,
      [id]
    );

    if (!post.rows.length) return null;

// Add mentions
    const mentionRes = await db.query(
  `SELECT u.id, u.email
   FROM auth.post_mentions pm
   JOIN auth.users u ON u.id = pm.mentioned_user_id
   WHERE pm.post_id = $1`,
  [postId]
);

    post.mentions = mentionRes.rows;



    const media = await db.query(
      `SELECT media_url, media_type
       FROM auth.post_media
       WHERE post_id=$1`,
      [id]
    );

    const data = post.rows[0];
    data.media = media.rows;

    return data;
  }

 static async update(id, content, visibility) {
    const result = await db.query(
      `UPDATE auth.posts
       SET content=$1, visibility=$2, updated_at=NOW()
       WHERE id=$3 AND is_deleted=false
       RETURNING *`,
      [content, visibility, id]
    );
    return result.rows[0];
  }


  static async delete(id) {
    await db.query(
      `UPDATE auth.posts
       SET is_deleted=true
       WHERE id=$1`,
      [id]
    );
  }

  static async getFeed() {
    const result = await db.query(
      `SELECT * FROM auth.posts
       WHERE visibility='public'
       AND is_deleted=false
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  static async getUserPosts(userId) {
    const result = await db.query(
      `SELECT * FROM auth.posts
       WHERE user_id=$1
       AND is_deleted=false
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}


  

module.exports = Post;


// static async update(postId, userId, content, visibility) {
//     const result = await db.query(
//       `UPDATE auth.posts
//        SET content = $1,
//            visibility = $2,
//            updated_at = NOW()
//        WHERE id = $3
//        AND user_id = $4
//        AND is_deleted = false
//        RETURNING *`,
//       [content, visibility, postId, userId]
//     );
//     return result.rows[0];
//   }
  




//   static async update(id, content, visibility) {
//     const result = await db.query(
//       `UPDATE auth.posts
//        SET content=$1, visibility=$2, updated_at=NOW()
//        WHERE id=$3 AND is_deleted=false
//        RETURNING *`,
//       [content, visibility, id]
//     );
//     return result.rows[0];
//   }

//   static async softDelete(postId, userId) {
//     const result = await db.query(
//       `UPDATE auth.posts
//        SET is_deleted = true
//        WHERE id = $1
//        AND user_id = $2
//        RETURNING *`,
//       [postId, userId]
//     );
//     return result.rows[0];
//   }

//   static async getFeed() {
//     const result = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE visibility = 'public'
//        AND is_deleted = false
//        ORDER BY created_at DESC`
//     );
//     return result.rows;
//   }

//   static async getUserPosts(userId) {
//     const result = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE user_id = $1
//        AND is_deleted = false
//        ORDER BY created_at DESC`,
//       [userId]
//     );
//     return result.rows;
//   }
// }

