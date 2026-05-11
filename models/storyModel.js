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
    user_id,
    reaction
) => {

    await db.query(
        `
    INSERT INTO user_schema.story_likes(
        story_id,
        user_id,
        reaction
    )VALUES($1,$2,$3)
    ON CONFLICT (story_id , user_id)
    DO UPDATE SET

    reaction = EXCLUDED.reaction,

    created_at = NOW()

    RETURNING *; `,
        [story_id,
            user_id,
            reaction
        ]

    );
};

exports.replyStory = async (
    story_id,
    sender_id,
    Message
) => {

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

exports.getStoryViewers = async (story_id) => {
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

exports.deleteStory = async (story_id, user_id) => {
    await db.query(`
        DELETE  FROM user_schema.stories 
        WHERE id = $1 
        AND user_id =$2 `,
        [story_id,
            user_id
        ]);
    console.log("story deleted successfully ")
};






// GET STORY DETAILS
exports.getStoryDetails = async (story_id) => {

    const query = `

SELECT
    s.id,
    s.caption,
    s.media_url,
    s.media_type,
    s.created_at,

    u.user_id AS user_id,
    u.username
    

FROM user_schema.stories s

JOIN user_schema.users u
ON s.user_id = u.user_id

WHERE s.id = $1

`;

    const result = await db.query(
        query,
        [story_id]
    );

    return result.rows[0];

};


// TOTAL VIEWS
exports.getTotalViews = async (story_id) => {

    const result = await db.query(
        `
        SELECT COUNT(*) AS total_views
        FROM user_schema.story_views
        WHERE story_id = $1
        `,
        [story_id]
    );

    return result.rows[0];

};


// TOTAL LIKES
exports.getTotalLikes = async (story_id) => {

    const result = await db.query(
        `
        SELECT COUNT(*) AS total_likes
        FROM user_schema.story_likes
        WHERE story_id = $1
        `,
        [story_id]
    );

    return result.rows[0];

};


// TOTAL COMMENTS
exports.getTotalComments = async (story_id) => {

    const result = await db.query(
        `
        SELECT COUNT(*) AS total_comments
        FROM user_schema.story_replies
        WHERE story_id = $1
        `,
        [story_id]
    );

    return result.rows[0];

};


// WHO VIEWED
exports.getStoryViewers = async (story_id) => {

    const result = await db.query(
        `
        SELECT

            u.id,
            u.username,
            u.profile_image,

            sv.viewed_at

        FROM user_schema.story_views sv

        JOIN user_schema.users u
        ON sv.viewer_id = u.id

        WHERE sv.story_id = $1

        ORDER BY sv.viewed_at DESC
        `,
        [story_id]
    );

    return result.rows;

};


// WHO LIKED
exports.getStoryLikes = async (story_id) => {

    const result = await db.query(
        `
        SELECT

            u.id,
            u.username,
            u.profile_image,

            sl.reaction,
            sl.created_at

        FROM user_schema.story_likes sl

        JOIN user_schema.users u
        ON sl.user_id = u.id

        WHERE sl.story_id = $1

        ORDER BY sl.created_at DESC
        `,
        [story_id]
    );

    return result.rows;

};


// WHO COMMENTED
exports.getStoryComments = async (story_id) => {

    const result = await db.query(
        `
        SELECT

            u.id,
            u.username,
            u.profile_image,

            sr.message,
            sr.created_at

        FROM user_schema.story_replies sr

        JOIN user_schema.users u
        ON sr.user_id = u.id

        WHERE sr.story_id = $1

        ORDER BY sr.created_at DESC
        `,
        [story_id]
    );

    return result.rows;

};