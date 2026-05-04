const db = require("../config/db");

exports.createStory = async (
    user_id,
    media_url,
    media_type,
    caption
) => {
    const result = await db.query(
        `INSERT INTO user_schema.stories(
        user_id,
        media_url,
        media_type,
        caption,
        created_at,
        expiar_at
        ) VALUES ($1,$2,$3,$4,NOW(),NOW() + INTERVAL '24 HOURS')
         RETURNING *`,


        [user_id, media_url, media_type, caption]
    );
    console.log(result);
    return result.rows[0];
};


exports.getAllStories = async () => {
    const result = await db.query(
        `
    SELECT s.*, u.full_name
    FROM user_schema.stories s 
    JOIN user_schema.userstable u 
    ON u.id = s.user_id
    WHERE s.expiar_at > NOW()
    ORDER BY s.created_at DESC
    `
    );
    console.log(result)
    return result.rows;
};

exports.addView = async (story_id, viewer_id) => {
  

    await db.query(
        `
        INSERT INTO user_schema.story_views(
        story_id,
        viewer_id) 
        VALUES($1,$2) ON CONFLICT(story_id, viewer_id)
        DO NOTHING `,
        [story_id,
            viewer_id
        ]
    );
};

exports.likeStory = async (
    story_id,
    user_id
) => {

    await db.query(
        `
    INSERT INTO user_schema.story_likes(
        story_id,
        user_id
    )VALUES($1,$2)
    ON CONFLICT (story_id , user_id)
    DO NOTHING `,
        [story_id,
            user_id
        ]

    );
};

exports.replyStory = async(
    story_id,
    sender_id,
    Message
)=>{

    const result = await db.query(
        `
        INSERT INTO user_schema.story_replies
        (
        story_id,
        sender_id,
        message
        )
        VALUES( $1,$2,$3)
        RETURNING * `,
        [story_id, sender_id, Message]
    );
    console.log(result)
    return result.row;
};

exports.getStoryViewers = async(story_id)=>{
    const result = await db.query(`
        SELECT u.id , 
        u.full_name,
        sv.viewed_at
        FROM user_schema.story_views sv 
        JOIN user_schema.userstable u 
        ON u.id = sv.viewer_id 
        WHERE  sv.story_id = $1
        ORDER BY sv.viewed_at DESC `,
    [story_id]
    );
 console.log(result)
  return result.rows;
};

exports.deleteStory = async(story_id , user_id)=>{
    await db.query(`
        DELETE  FROM user_schema.stories 
        WHERE id = $1 
        AND user_id =$2 `,
    [story_id,
        user_id
    ]);
  console.log("story deleted successfully ")  
};