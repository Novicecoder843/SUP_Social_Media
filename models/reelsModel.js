const db= require("../config/db");

// CREATE REELS 

exports.createReel = async(
    user_id,
    video_url,
    thumbnail_url,
    caption 
)=> {
    const result = await db.query(
        `
        INSERT INTO user_schema.reels(
        user_id,
        video_url,
        thumbnail_url,
        caption,
        create_at )
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
        `,
        [user_id,
            video_url,
            thumbnail_url,
            caption 
        ]
    );
    return result.rows[0];
};



// GET REELS FEED 

// exports.getReelsFeed = async(
//     user_id
// )=>{
//     const result = await db.query(
//         `
//         SELECT r.*,
//         u.full_name,
//         u.profile_image,
//         EXISTS(SELECT 1
//         FROM user_schema.reel_likes rl 
//         WHERE rl.reel_id = r.id
//         AND rl.user_id = $1 
//         )AS "isLiked"
    
//         FROM user_schema.reels r
//         JOIN user_schema.userstable u 
//         ON u.id = r.user_id 
//         ORDER BY r.created_at DESC
//         `,
//         [user_id]
//     );

//     return result.rows;
// };

exports.getReelsFeed = async (
    user_id
) => {

    const result = await db.query(
        `
        SELECT 
            r.*,

            u.full_name,
            

            EXISTS(
                SELECT 1
                FROM user_schema.reel_like rl 
                WHERE rl.reel_id = r.id
                AND rl.user_id = $1
            ) AS "isLiked"
    
        FROM user_schema.reels r

        JOIN user_schema.userstable u 
        ON u.id = r.user_id 

        ORDER BY r.create_at DESC
        `,
        [user_id]
    );

    return result.rows;

};

// like reels 

exports.likeReel = async (
    reel_id,
    user_id
)=>{
    const existing  = await db.query(
        ` 
         SELECT * FROM  user_schema.reel_like
         WHERE reel_id = $1
         AND user_id = $2
        `,
        [reel_id , user_id]
    );

    // UNLIKE

    if (existing.rows.length>0){
        await db.query(
            `DELETE FROM user_schema.reel_like 
            WHERE reel_id = $1
            AND user_id = $2 `,
            [reel_id, user_id]
        );

        return {
            liked: false
        };
    }

    // LIEK 
    await db.query(
        `
        INSERT INTO user_schema.reel_like
        (
        reel_id,
        user_id,
        create_at)
        VALUES (
        $1,$2,NOW()  )`,
        [reel_id , user_id]
    );
    return{
        liked:true
    };
};


// ADD VIEW 

exports.addView = async(
    reel_id,
    user_id
)=>{
    const existing = await db.query(
        `
        SELECT * FROM 
        user_schema.reel_views
        WHERE reel_id = $1 
        AND  user_id = $2 `,
        [reel_id,
            user_id
        ]
    );

    if (existing.rows.length >0){
        return;
    }
    await db.query(`
        INSERT INTO user_schema.reel_views
        (reel_id,
        user_id,
        viewed_at
        ) VALUES ($1,$2,NOW())
        
        `,
     [reel_id, user_id]
    );
       
};

// COMMENT REEL
exports.commentReel = async (
    reel_id,
    user_id,
    comment
) => {

    const result = await db.query(
        `
        INSERT INTO user_schema.reel_comments
        (
            reel_id,
            user_id,
            comment,
            created_at
        )

        VALUES
        (
            $1,
            $2,
            $3,
            NOW()
        )

        RETURNING *
        `,
        [
            reel_id,
            user_id,
            comment
        ]
    );

    return result.rows[0];

};


// DELETE REEL
exports.deleteReel = async (
    reel_id,
    user_id
) => {

    await db.query(
        `
        DELETE FROM user_schema.reels

        WHERE id = $1
        AND user_id = $2
        `,
        [reel_id, user_id]
    );

};