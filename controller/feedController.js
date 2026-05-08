const pool = require("../config/db");

// ✅ GET FEED
exports.getFeed = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.content,
        COALESCE(
          json_agg(
            json_build_object(
              'url', m.media_url,
              'type', m.media_type
            )
          ) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS media
      FROM posts p
      LEFT JOIN post_media m 
      ON p.id = m.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("GET FEED ERROR:", err);
    res.status(500).json({ message: "Error fetching feed" });
  }
};


// ✅ CREATE FEED (POST)
exports.createFeed = async (req, res) => {
  const { content, media } = req.body;

  try {
    // 🔴 Validation (important)
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // 1️⃣ Insert post
    const postResult = await pool.query(
      "INSERT INTO posts (content) VALUES ($1) RETURNING id",
      [content]
    );

    const postId = postResult.rows[0].id;

    // 2️⃣ Insert media (if exists)
    if (media && Array.isArray(media) && media.length > 0) {
      for (let item of media) {
        if (item.url && item.type) {
          await pool.query(
            "INSERT INTO post_media (post_id, media_url, media_type) VALUES ($1, $2, $3)",
            [postId, item.url, item.type]
          );
        }
      }
    }

    // 3️⃣ Final response
    res.status(201).json({
      id: postId,
      content,
      media: media || []
    });

  } catch (err) {
    console.error("CREATE FEED ERROR:", err);
    res.status(500).json({ message: "Error creating feed" });
  }
};