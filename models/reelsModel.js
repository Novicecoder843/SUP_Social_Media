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

        // DECREASE COUNT
        await db.query(
            `
            UPDATE user_schema.reels

            SET likes_count = likes_count - 1

            WHERE id = $1
            `,
            [reel_id]
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


    // INCREASE COUNT
    await db.query(
        `
        UPDATE user_schema.reels

        SET likes_count = likes_count + 1

        WHERE id = $1
        `,
        [reel_id]
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

     console.log("REEL ID:", reel_id);
    console.log("USER ID:", user_id);

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

    console.log("EXISTING:", existing.rows);

    if (existing.rows.length > 0){
        return {
            viewed: true
        };
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

    console.log("VIEW INSERTED");

     // INCREASE VIEW COUNT
    await db.query(
        `
        UPDATE user_schema.reels

        SET views_count = COALESCE(views_count,0) + 1

        WHERE id = $1
        `,
        [reel_id]
    );
    console.log("VIEW COUNT UPDATED");

    return {
        viewed: true
    };
       
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
            createed_at
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

    // INCREASE COMMENT COUNT
    await db.query(
        `
        UPDATE user_schema.reels

        SET comment_count = comment_count + 1

        WHERE id = $1
        `,
        [reel_id]
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


// SHARE REEL
exports.shareReel = async (
    reel_id,
    user_id
) => {

    // STORE SHARE HISTORY
    await db.query(
        `
        INSERT INTO user_schema.reel_shares
        (
            reel_id,
            user_id,
            created_at
        )

        VALUES
        (
            $1,
            $2,
            NOW()
        )
        `,
        [reel_id, user_id]
    );


    // INCREASE SHARE COUNT
    await db.query(
        `
        UPDATE user_schema.reels

        SET shares_count = shares_count + 1

        WHERE id = $1
        `,
        [reel_id]
    );


    return {
        shared: true
    };

};



exports.saveReel = async( user_id , reel_id)=>{

    const result = await db.query(

        `INSERT INTO  user_schema.saved_reels (user_id , reel_id ) 
        VALUES ($1 , $2 )
        RETURNING * `,
        [user_id,reel_id]
    );
    return result.rows[0];
};

exports.checkSaveed = async(user_id, reel_id)=>{
    const result= await db.query(
        `
        SELECT * FROM user_schema.saved_reels WHERE user_id = $1 AND  reel_id = $2`,
        [user_id,reel_id]
    );
    return result.rows;
;}


// UNSAVE REELS //

exports.unsaveReel = async (user_id, reel_id)=>{
     await db.query(
        `
        DELETE FROM user_schema.saved_reels WHERE user_id = $1 
        AND reel_id = $2`,
        [user_id,reel_id]
     );
}


// GET SAVES REELS /

exports.getSavedReels = async (user_id)=>{
    const result = await db.query(
        ` SELECT * FROM user_schema.saved_reels sr 
        JOIN user_schema.reels r 
        
        ON sr.reel_id = r.id
        WHERE sr.user_id = $1
        ORDER BY sr.created_at DESC`,
        [user_id]
    )
    return result.rows;
};


// GET SINGLE REEL

exports.getReelById = async(reel_id)=>{
    const result = await db.query(

        `
        SELECT * FROM user_schema.reels 
        WHERE id = $1 `,
        [reel_id]
  
    );
    return result.rows[0]
};

exports.getMyReel = async(user_id)=>{

    const result = await db.query(
        `SELECT * FROM user_schema.reels
        WHERE user_id = $1
        ORDER BY create_at DESC `,
        [user_id]
    );
    return result.rows;
};

exports.cheakReports = async(user_id, reel_id)=>{

    const result = await db.query(
        `
        SELECT * FROM user_schema.reel_reports
        WHERE   user_id = $1 
        AND reel_id = $2 
        `,
        [user_id , reel_id]

    );
    return result.rows[0]
};


exports.reportReel = async(
    user_id,reel_id,reason
)=>{
    const result = await db.query(

    `INSERT INTO user_schema.reel_reports

    (user_id, reel_id, reason)

    VALUES ($1,$2,$3)

    RETURNING *`,

    [user_id, reel_id, reason]

);
     return result.rows[0]
};


exports.removeReports = async(user_id, reel_id)=>{

    await db.query(
        `
        DELETE FROM user_schema.reel_reports 
        WHERE user_id = $1 
        AND reel_id = $2 `,
        [user_id, reel_id]
    );
    
}