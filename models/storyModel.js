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
    console.log(result.rows);
    return result.rows;
};

exports.addView = async (story_id, viewer_id) => {



    // CHECK ALREADY VIEWED
    const existing = await db.query(
        `
        SELECT *
        FROM user_schema.story_views

        WHERE story_id = $1
        AND viewer_id = $2
        `,
        [story_id, viewer_id]
    );


    // IF NOT VIEWED
    if (existing.rows.length === 0) {

        const result = await db.query(
            `
            INSERT INTO user_schema.story_views
            (
                story_id,
                viewer_id,
                is_seen,
                viewed_at
            )

            VALUES
            (
                $1,
                $2,
                TRUE,
                NOW()
            )

            RETURNING *
            `,
            [story_id, viewer_id]
        );

        return result.rows[0];

    }


    // IF ALREADY VIEWED
    const update = await db.query(
        `
        UPDATE user_schema.story_views

        SET
            is_seen = TRUE,
            viewed_at = NOW()

        WHERE story_id = $1
        AND viewer_id = $2

        RETURNING *
        `,
        [story_id, viewer_id]
    );
    return update.rows[0];
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

    u.id AS user_id,
    u.full_name

FROM user_schema.stories s

LEFT JOIN user_schema.userstable u
ON s.user_id = u.id

WHERE s.id = $1;

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
    u.full_name,

    sv.viewed_at

      FROM user_schema.story_views sv

       LEFT JOIN user_schema.userstable u
       ON sv.viewer_id = u.id

      WHERE sv.story_id = $1

     ORDER BY sv.viewed_at DESC;
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
            u.full_name,
            

            sl.reaction,
            sl.created_at

        FROM user_schema.story_likes sl

        JOIN user_schema.userstable u
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
            u.full_name,
            

            sr.message,
            sr.create_at

        FROM user_schema.story_replies sr

        JOIN user_schema.userstable u
        ON sr.id = u.id

        WHERE sr.story_id = $1

        ORDER BY sr.create_at DESC
        `,
        [story_id]
    );

    return result.rows;

};