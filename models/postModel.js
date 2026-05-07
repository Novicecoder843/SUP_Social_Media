const pool = require("../config/db");
const db = require("../config/db");

// 1. CREATE POST (transaction client use karega)
exports.createPost = (client, user_id, content) => {
  return client.query(
    `INSERT INTO posts (user_id, content, created_at, updated_at)
     VALUES ($1,$2,NOW(),NOW())
     RETURNING *`,
    [user_id, content]
  );
};

// 2. BULK INSERT MEDIA (BEST WAY)
exports.addPostMediaBulk = (client, post_id, mediaList) => {
  if (!mediaList || mediaList.length === 0) return;

  const values = [];
  const placeholders = [];

  mediaList.forEach((media, index) => {
    const i = index * 4;

    placeholders.push(
      `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4})`
    );

    values.push(
      post_id,
      media.url,
      media.type,
      media.order
    );
  });

  return client.query(
    `INSERT INTO post_media 
     (post_id, media_url, media_type, order_index)
     VALUES ${placeholders.join(",")}`,
    values
  );
};

// 3. GET ALL POSTS (FEED WITH MEDIA)
exports.getAllPosts = () => {
  return pool.query(`
    SELECT 
      p.id,
      p.user_id,
      p.content,
      p.created_at,

      COALESCE(
        json_agg(
          json_build_object(
            'url', m.media_url,
            'type', m.media_type,
            'order', m.order_index
          )
          ORDER BY m.order_index
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS media

    FROM posts p
    LEFT JOIN post_media m ON p.id = m.post_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);
};

// 4. GET SINGLE POST
exports.getPostById = (post_id) => {
  return pool.query(`
    SELECT 
      p.id,
      p.user_id,
      p.content,
      p.created_at,

      COALESCE(
        json_agg(
          json_build_object(
            'url', m.media_url,
            'type', m.media_type,
            'order', m.order_index
          )
          ORDER BY m.order_index
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS media

    FROM posts p
    LEFT JOIN post_media m ON p.id = m.post_id
    WHERE p.id = $1
    GROUP BY p.id
  `, [post_id]);
};

// 5. DELETE POST
exports.deletePost = (post_id, user_id) => {
  return pool.query(
    `DELETE FROM posts 
     WHERE id=$1 AND user_id=$2`,
    [post_id, user_id]
  );
};

// 6. UPDATE POST (ONLY TEXT)
exports.updatePost = (post_id, user_id, content) => {
  return pool.query(
    `UPDATE posts 
     SET content=$1, updated_at=NOW()
     WHERE id=$2 AND user_id=$3
     RETURNING *`,
    [content, post_id, user_id]
  );
};

// 7. USER POSTS (WITH MEDIA)
exports.getUserPosts = async (user_id) => {
  return await db.query(`
    SELECT 
      p.id,
      p.content,
      p.created_at,

      -- user info
      u.id as user_id,
      u.name,

      -- media
      COALESCE(
        json_agg(
          json_build_object(
            'url', pm.media_url,
            'type', pm.media_type
          )
        ) FILTER (WHERE pm.id IS NOT NULL), '[]'
      ) AS media,

      COUNT(DISTINCT l.id) AS likes_count,
      COUNT(DISTINCT c.id) AS comments_count,
      COUNT(DISTINCT s.id) AS shares_count

    FROM posts p

    JOIN users u ON u.id = p.user_id   --- IMPORTANT

    LEFT JOIN post_media pm ON pm.post_id = p.id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN shares s ON s.post_id = p.id

    WHERE p.user_id = $1

    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
  `, [user_id]);
};

exports.getSinglePostFull = (postId, userId) => {
  return pool.query(
    `
    SELECT 
      p.id,
      p.content,
      p.created_at,

      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user,

      -- MEDIA
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'url', pm.media_url,
          'type', pm.media_type
        )) FILTER (WHERE pm.id IS NOT NULL), '[]'
      ) as media,

      -- COUNTS
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
      (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as shares_count,

      -- IS LIKED
      EXISTS (
        SELECT 1 FROM likes 
        WHERE post_id = p.id AND user_id = $2
      ) as is_liked

    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN post_media pm ON pm.post_id = p.id

    WHERE p.id = $1

    GROUP BY p.id, u.id
    `,
    [postId, userId]
  );
};