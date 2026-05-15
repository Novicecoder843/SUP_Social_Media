const { queue } = require("sharp");
const pool = require("../config/db");
const db = require("../config/db");

// 1. CREATE POST (transaction client use karega)
exports.createPost = (client, user_id, content, location_id, visibility, allow_comments, allow_share) => {
  return client.query(
    `INSERT INTO posts (user_id, content, location_id, visibility, allow_comments, allow_share)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [user_id, content, location_id, visibility || "public", allow_comments ?? true, allow_share ?? true]
  );
};

// 2. BULK INSERT MEDIA (BEST WAY)
exports.addPostMediaBulk = async (
  client,
  post_id,
  mediaList
) => {

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  const values = [];
  const placeholders = [];

  mediaList.forEach((media, index) => {

    const position = index * 4;

    placeholders.push(
      `($${position + 1}, $${position + 2}, $${position + 3}, $${position + 4})`
    );

    values.push(
      post_id,
      media.url,
      media.type,
      media.order
    );
  });

  const query = `
    INSERT INTO post_media
    (post_id, media_url, media_type, order_index)
    VALUES ${placeholders.join(",")}
  `;

  // console.log("MEDIA QUERY:", query);
  // console.log("MEDIA VALUES:", values);

  return await client.query(query, values);
};

// 3. GET ALL POSTS (FEED WITH MEDIA)
exports.getAllPosts = async () => {
  return db.query(
    `
    SELECT 
      p.id,
      p.content,
      p.created_at,
      p.visibility,
      p.allow_comments,
      p.allow_share,

      p.user_id,

      json_build_object(
        'id', u.id,
        'name', u.name
      ) AS user,

       ---LOCATION
       CASE
       WHEN loc.id IS NOT NULL 
       THEN
      json_build_object(
  'id', loc.id,
  'name', loc.name
)
  ELSE NULL
    END AS location,

      -- MEDIA
      COALESCE(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'url', pm.media_url,
            'type', pm.media_type
          )
        ) FILTER (WHERE pm.id IS NOT NULL),
        '[]'
      ) AS media,

       ---HASHTAGS
      COALESCE(
       json_agg(
    DISTINCT 
  jsonb_build_object(
      'id', h.id,
      'tag', h.tag
    )
  ) FILTER (WHERE h.id IS NOT NULL),
  '[]'
) AS hashtags,

 ---TAGGED USERS
COALESCE(
  json_agg(
    DISTINCT 
  jsonb_build_object(
      'id', tu.id,
      'name', tu.name
    )
  ) FILTER (WHERE tu.id IS NOT NULL),
  '[]'
) AS tagged_users,

      -- LIKE COUNT
      (
        SELECT COUNT(*) 
        FROM likes l
        WHERE l.post_id = p.id
      ) AS likes_count,

      -- COMMENT COUNT
      (
        SELECT COUNT(*) 
        FROM comments c
        WHERE c.post_id = p.id
        AND c.parent_id IS NULL
      ) AS comments_count,

      -- SHARE COUNT
      (
        SELECT COUNT(*) 
        FROM shares s
        WHERE s.post_id = p.id
      ) AS shares_count

    FROM posts p

    JOIN users u 
    ON u.id = p.user_id

    LEFT JOIN post_media pm 
     ON pm.post_id = p.id

    LEFT JOIN locations loc
ON loc.id = p.location_id

LEFT JOIN post_hashtags ph
ON ph.post_id = p.id

LEFT JOIN hashtags h
ON h.id = ph.hashtag_id

LEFT JOIN post_tags ptu
ON ptu.post_id = p.id

LEFT JOIN users tu
ON tu.id = ptu.tagged_user_id

    GROUP BY p.id, u.id, loc.id

    ORDER BY p.created_at DESC
    `
  );
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

      ---USER
      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user,

      ---LOCATION
       CASE
       WHEN loc.id IS NOT NULL 
       THEN
      json_build_object(
  'id', loc.id,
  'name', loc.name
)
  ELSE NULL
    END AS location,

      -- MEDIA
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'url', pm.media_url,
          'type', pm.media_type
        )) FILTER (WHERE pm.id IS NOT NULL), '[]'
      ) as media,

       ---HASHTAGS
      COALESCE(
       json_agg(
    DISTINCT 
  jsonb_build_object(
      'id', h.id,
      'tag', h.tag
    )
  ) FILTER (WHERE h.id IS NOT NULL),
  '[]'
) AS hashtags,

 ---TAGGED USERS
COALESCE(
  json_agg(
    DISTINCT 
  jsonb_build_object(
      'id', tu.id,
      'name', tu.name
    )
  ) FILTER (WHERE tu.id IS NOT NULL),
  '[]'
) AS tagged_users,

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

    LEFT JOIN locations loc
ON loc.id = p.location_id

LEFT JOIN post_hashtags ph
ON ph.post_id = p.id

LEFT JOIN hashtags h
ON h.id = ph.hashtag_id

LEFT JOIN post_tags ptu
ON ptu.post_id = p.id

LEFT JOIN users tu
ON tu.id = ptu.tagged_user_id

    WHERE p.id = $1

    GROUP BY p.id, u.id, loc.id, loc.name
    `,
    [postId, userId]
  );
};

// BULK INSERT HASHTAGS
exports.addPostHashtagsBulk = async (
client,
post_id,
hashtagArray
) => {

if (!hashtagArray || hashtagArray.length === 0) {
return null;
}

const values = [];
const placeholders = [];

hashtagArray.forEach((hashtagId, index) => {

const position = index * 2;

placeholders.push(
  `($${position + 1}, $${position + 2})`
);

values.push(post_id, hashtagId);

});

const query = `INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ${placeholders.join(",")}`;

return await client.query(query, values);
};

// BULK INSERT TAGGED USERS
exports.addTaggedUsersBulk = async (
client,
post_id,
taggedArray
) => {

if (!taggedArray || taggedArray.length === 0) {
return null;
}

const values = [];
const placeholders = [];

taggedArray.forEach((taggedUserId, index) => {

const position = index * 2;

placeholders.push(
  `($${position + 1}, $${position + 2})`
);

values.push(post_id, taggedUserId);

});

const query = `INSERT INTO post_tags (post_id, tagged_user_id) VALUES ${placeholders.join(",")}`;

return await client.query(query, values);
};