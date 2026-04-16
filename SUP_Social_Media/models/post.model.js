// const db = require('../config/db');

// // class Post {

// //   static async create(userId, content, visibility) {
// //     const result = await db.query(
// //       `INSERT INTO auth.posts (user_id, content, visibility)
// //        VALUES ($1,$2,$3)
// //        RETURNING *`,
// //       [userId, content, visibility]
// //     );
// //     return result.rows[0];
// //   }

// //   static async getById(id) {
// //     const result = await db.query(
// //       `SELECT * FROM auth.posts
// //        WHERE id=$1 AND is_deleted=false`,
// //       [id]
// //     );
// //     return result.rows[0];
// //   }


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

//   static async addMedia(postId, fileName, type) {
//     await db.query(
//       `INSERT INTO auth.post_media (post_id, media_url, media_type)
//        VALUES ($1,$2,$3)`,
//       [postId, fileName, type]
//     );
//   }

//   static async getById(id,postId) {
//     const post = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE id=$1 AND is_deleted=false`,
//       [id]
//     );

//     if (!post.rows.length) return null;

// // Add mentions
//     const mentionRes = await db.query(
//   `SELECT u.id, u.email
//    FROM auth.post_mentions pm
//    JOIN auth.users u ON u.id = pm.mentioned_user_id
//    WHERE pm.post_id = $1`,
//   [postId]
// );

//     post.mentions = mentionRes.rows;



//     const media = await db.query(
//       `SELECT media_url, media_type
//        FROM auth.post_media
//        WHERE post_id=$1`,
//       [id]
//     );

//     const data = post.rows[0];
//     data.media = media.rows;

//     return data;
//   }

//  static async update(id, content, visibility) {
//     const result = await db.query(
//       `UPDATE auth.posts
//        SET content=$1, visibility=$2, updated_at=NOW()
//        WHERE id=$3 AND is_deleted=false
//        RETURNING *`,
//       [content, visibility, id]
//     );
//     return result.rows[0];
//   }


//   static async delete(id) {
//     await db.query(
//       `UPDATE auth.posts
//        SET is_deleted=true
//        WHERE id=$1`,
//       [id]
//     );
//   }

//   static async getFeed() {
//     const result = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE visibility='public'
//        AND is_deleted=false
//        ORDER BY created_at DESC`
//     );
//     return result.rows;
//   }

//   static async getUserPosts(userId) {
//     const result = await db.query(
//       `SELECT * FROM auth.posts
//        WHERE user_id=$1
//        AND is_deleted=false
//        ORDER BY created_at DESC`,
//       [userId]
//     );
//     return result.rows;
//   }
// }


  

// module.exports = Post;

const db = require('../config/db');

class Post {

  //////////////////////////////////////////////////////
  // ✅ CREATE POST
  //////////////////////////////////////////////////////
  static async create(userId, content, visibility) {
    const result = await db.query(
      `INSERT INTO auth.posts (user_id, content, visibility)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [userId, content, visibility]
    );

    return result.rows[0];
  }

  //////////////////////////////////////////////////////
  // ✅ ADD MEDIA (S3 URL)
  //////////////////////////////////////////////////////
  static async addMedia(postId, mediaUrl, type) {
    await db.query(
      `INSERT INTO auth.post_media (post_id, media_url, media_type)
       VALUES ($1,$2,$3)`,
      [postId, mediaUrl, type]
    );
  }

  //////////////////////////////////////////////////////
  // ✅ GET SINGLE POST (WITH MEDIA + MENTIONS)
  //////////////////////////////////////////////////////
  static async getById(id) {
    const postRes = await db.query(
      `SELECT * FROM auth.posts
       WHERE id=$1 AND is_deleted=false`,
      [id]
    );

    if (!postRes.rows.length) return null;

    const post = postRes.rows[0];

    // 🔥 MEDIA
    const mediaRes = await db.query(
      `SELECT media_url, media_type
       FROM auth.post_media
       WHERE post_id=$1`,
      [id]
    );

    post.media = mediaRes.rows;

    // 🔥 MENTIONS
    const mentionRes = await db.query(
      `SELECT u.id, u.email
       FROM auth.post_mentions pm
       JOIN auth.users u ON u.id = pm.mentioned_user_id
       WHERE pm.post_id = $1`,
      [id]
    );

    post.mentions = mentionRes.rows;

    return post;
  }

  //////////////////////////////////////////////////////
  // ✅ UPDATE POST
  //////////////////////////////////////////////////////
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

  //////////////////////////////////////////////////////
  // ✅ DELETE (SOFT DELETE)
  //////////////////////////////////////////////////////
  static async delete(id) {
    await db.query(
      `UPDATE auth.posts
       SET is_deleted=true
       WHERE id=$1`,
      [id]
    );
  }

  //////////////////////////////////////////////////////
  // ✅ FEED (WITH MEDIA)
  //////////////////////////////////////////////////////
  static async getFeed() {
    const result = await db.query(
      `SELECT * FROM auth.posts
       WHERE visibility='public'
       AND is_deleted=false
       ORDER BY created_at DESC`
    );

    const posts = result.rows;

    // 🔥 attach media to each post
    for (let post of posts) {
      const mediaRes = await db.query(
        `SELECT media_url, media_type
         FROM auth.post_media
         WHERE post_id=$1`,
        [post.id]
      );

      post.media = mediaRes.rows;
    }

    return posts;
  }

  //////////////////////////////////////////////////////
  // ✅ USER POSTS (WITH MEDIA)
  //////////////////////////////////////////////////////
  static async getUserPosts(userId) {
    const result = await db.query(
      `SELECT * FROM auth.posts
       WHERE user_id=$1
       AND is_deleted=false
       ORDER BY created_at DESC`,
      [userId]
    );

    const posts = result.rows;

    for (let post of posts) {
      const mediaRes = await db.query(
        `SELECT media_url, media_type
         FROM auth.post_media
         WHERE post_id=$1`,
        [post.id]
      );

      post.media = mediaRes.rows;
    }

    return posts;
  }
}

module.exports = Post;





