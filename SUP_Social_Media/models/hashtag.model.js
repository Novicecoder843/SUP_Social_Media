const db = require('../config/db');

class Hashtag {

  // 🔥 extract hashtags from content
  static extractTags(content) {
    const matches = content.match(/#\w+/g);
    return matches ? matches.map(tag => tag.replace('#', '').toLowerCase()) : [];
  }

  // 🔥 create or get hashtag
  static async getOrCreate(tag) {
    const result = await db.query(
      `INSERT INTO auth.hashtags (tag)
       VALUES ($1)
       ON CONFLICT (tag)
       DO UPDATE SET tag = EXCLUDED.tag
       RETURNING id`,
      [tag]
    );

    return result.rows[0].id;
  }

  // 🔥 link post ↔ hashtag
  static async linkPost(postId, hashtagId) {
    await db.query(
      `INSERT INTO auth.post_hashtags (post_id, hashtag_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [postId, hashtagId]
    );
  }

  // 🔍 search hashtags
  static async search(q) {
    const result = await db.query(
      `SELECT tag
       FROM auth.hashtags
       WHERE tag ILIKE $1
       LIMIT 10`,
      [`%${q}%`]
    );

    return result.rows;
  }

  // 🔥 trending hashtags
  static async trending() {
    const result = await db.query(
      `SELECT h.tag, COUNT(ph.post_id) AS usage_count
       FROM auth.hashtags h
       JOIN auth.post_hashtags ph
       ON h.id = ph.hashtag_id
       GROUP BY h.tag
       ORDER BY usage_count DESC
       LIMIT 10`
    );

    return result.rows;
  }

  // 🔍 get posts by hashtag
  static async getPosts(tag) {
    const result = await db.query(
      `SELECT p.*
       FROM auth.posts p
       JOIN auth.post_hashtags ph ON p.id = ph.post_id
       JOIN auth.hashtags h ON h.id = ph.hashtag_id
       WHERE h.tag = $1
       AND p.is_deleted = false`,
      [tag.toLowerCase()]
    );

    return result.rows;
  }

}

module.exports = Hashtag;