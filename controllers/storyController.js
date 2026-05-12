const storyModel = require("../models/storyModel");
const db = require("../config/db");
const generateSignedUrl = require("../utlis/getSignedUrl");

exports.uploadStory = async (req, res) => {
    try {
        const user_id = req.user.id;

        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: " Media is require"
            });
        }
        // const media_url = req.file.location;
        const media_url = req.file.key;

        const media_type =
            req.file.mimetype.startsWith("image/")
                ? "image"
                : "video";

        const story =
            await storyModel.createStory(
                user_id,
                media_url,
                media_type,
                caption
            );
        res.status(201).json({
            success: true,
            message: "stury uploaded successfully ",
            date: story
        });


    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


exports.getStories = async (
    req,
    res
) => {

    try {

        const stories =
            await storyModel.getAllStories();

        res.json({
            success: true,
            data: stories
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};



// exports.viewStory = async (
//     req,
//     res
// ) => {

//     try {
//         const user_id = req.user.id;
//         const story_id = req.params.id;

//         // 🔍 Step 1: Check story exists
//         const story = await db.query(
//             "SELECT id FROM user_schema.stories WHERE id = $1",
//             [story_id]
//         );

//         if (story.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Story not found"
//             });
//         }

//         // REAL STORY DATA
//         const storyData = story.rows[0];

//         console.log("STORY DATA:", storyData);
//          console.log(storyData.media_url);

//         await storyModel.addView(
//             req.params.id,
//             req.user.id
//         );

//         // GENERATE CLICKABLE URL
//         const signedUrl = await generateSignedUrl(
//            storyData.media_url
//         );



//         res.json({
//             success: true,
//             story_id: storyData.id,
//             story_type: storyData.media_type,
//             caption: storyData.caption,
//             story_url: signedUrl,
//             message: "Story viewed"
//         });

//     } catch (err) {

//         res.status(500).json({
//             error: err.message
//         });
//     }
// };


exports.viewStory = async (req, res) => {

    try {

        const story_id = req.params.id;

        const user_id = req.user.id;


        // GET STORY
        const result = await db.query(
            `
            SELECT *
            FROM user_schema.stories
            WHERE id = $1
            `,
            [story_id]
        );


        // STORY NOT FOUND
        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Story not found"
            });

        }


        // REAL STORY DATA
        const story = result.rows[0];


        console.log("STORY DATA:", story);


        console.log("MEDIA URL:", story.media_url);


        // ADD VIEW
        await storyModel.addView(
            story_id,
            user_id
        );


        // CHECK media_url EXISTS
        if (!story.media_url) {

            return res.status(400).json({
                success: false,
                error: "media_url missing in database"
            });

        }


        // GENERATE SIGNED URL
        const signedUrl = await generateSignedUrl(
            story.media_url
        );


        return res.json({

            success: true,

            story_id: story.id,

            story_type: story.media_type,

            caption: story.caption,

            story_url: signedUrl,

            message: "Story viewed"

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

};



exports.likeStory = async (
    req,
    res
) => {

    try {

        const story_id = req.params.id;

        const user_id = req.user.id;
        const { reaction } = req.body;

        // CHECK STORY EXISTS
        const story = await db.query(
            `
            SELECT id
            FROM user_schema.stories
            WHERE id = $1
            `,
            [story_id]
        );


        if (story.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Story not found"
            });

        }

        // DEFAULT REACTION
        const userReaction = reaction || "like";

        await storyModel.likeStory(
            story_id,
            user_id,
            userReaction
        );

        res.json({
            success: true,
            story_id: Number(story_id),
            liked: true,
            liked_by: user_id,
            reaction: userReaction,
            message: "Story liked"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};


exports.replyStory = async (
    req,
    res
) => {

    try {

        const {
            message
        } = req.body;

        if (!message) {

            return res.status(400).json({
                success: false,
                message: "Message required"
            });
        }

        const reply =
            await storyModel.replyStory(
                req.params.id,
                req.user.id,
                message
            );

        res.json({
            success: true,
            data: reply,
            message:  message,
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};

exports.getStoryViewers = async (
    req,
    res
) => {

    try {

        const viewers =
            await storyModel.getStoryViewers(
                req.params.id
            );

        res.json({
            success: true,
            data: viewers,
            user_id:req.params.id
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};

exports.deleteStory = async (
    req,
    res
) => {

    try {

        await storyModel.deleteStory(
            req.params.id,
            req.user.id
        );

        res.json({
            success: true,
            message: "Story deleted"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};




exports.getStoryDetails = async (req, res) => {

    try {

        const story_id = req.params.id;
        console.log(story_id);


        // STORY
        const story =
            await storyModel.getStoryDetails(
                story_id
            );


        console.log("STORY:",story);

        if (!story) {

            return res.status(404).json({
                success: false,
                error: "Story not found"
            });

        }


        // SIGNED URL
        const signedUrl =
            await generateSignedUrl(
                story.media_url
            );


        // ANALYTICS
        const totalViews =
            await storyModel.getTotalViews(
                story_id
            );

        const totalLikes =
            await storyModel.getTotalLikes(
                story_id
            );

        const totalComments =
            await storyModel.getTotalComments(
                story_id
            );


        // USERS
        const viewers =
            await storyModel.getStoryViewers(
                story_id
            );

        const likes =
            await storyModel.getStoryLikes(
                story_id
            );

        const comments =
            await storyModel.getStoryComments(
                story_id
            );


        return res.json({

            success: true,

            story: {

                story_id: story.id,

                caption: story.caption,

                media_type: story.media_type,

                story_url: signedUrl,

                created_at: story.created_at,

                owner: {

                    user_id: story.user_id,

                    username: story.username,


                }

            },


            analytics: {

                total_views:
                    Number(
                        totalViews.total_views
                    ),

                total_likes:
                    Number(
                        totalLikes.total_likes
                    ),

                total_comments:
                    Number(
                        totalComments.total_comments
                    )

            },


            viewers,

            likes,

            comments

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

};