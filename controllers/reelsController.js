const reelModel = require("../models/reelsModel");
const generateSignedUrl = require("../utlis/getSignedUrl");



//  UPLOAD REELS 

exports.uploadReel = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: true,
                message: "video require"
            });

        }
        const video_url = req.file.key;

        const thumbnail_url = "";

        const reel = await reelModel.createReel(
            user_id,
            video_url,
            thumbnail_url,
            caption
        );
        res.status(201).json({
            success: true,
            message: "reel uploaded successfully",
            data: reel
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


exports.getReelsFeed = async (
    req,
    res
) => {

    try {

        const reels =
            await reelModel.getReelsFeed(
                req.user.id
            );

        console.log("REELS:", reels);


        const updatedReels =
            await Promise.all(

                reels.map(async (reel) => {

                    let videoUrl =
                        reel.video_url;

                    // ONLY GENERATE SIGNED URL
                    // IF S3 KEY EXISTS
                    if (
                        reel.video_url &&
                        !reel.video_url.startsWith("http")
                    ) {

                        try {

                            videoUrl =
                                await generateSignedUrl(
                                    reel.video_url
                                );

                        } catch (err) {

                            console.log(
                                "SIGNED URL ERROR:",
                                err.message
                            );

                        }

                    }

                    return {

                        ...reel,

                        video_url: videoUrl

                    };

                })

            );


        return res.json({

            success: true,

            data: updatedReels

        });

    } catch (err) {

        console.error(
            "GET FEED ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

// LIKE REELS 
exports.likeReel = async (req, res) => {
    try {
        const result = await reelModel.likeReel(
            req.params.id,
            req.user.id
        );
        res.json({
            success: true,
            message: "liked this reels ",
            liked: result.liked
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

};


// VIEW REELS 


exports.viewReel = async (
    req, res
) => {
    try {
        await reelModel.addView(
            req.params.id,
            req.user.id
        );
        res.json({
            success: true,
            message: "reels views successfully "
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error : err.message
        });
    }
};


// COMMENT REELS 

exports.commentReel = async (req, res)=>{

    try {
        const {comment } = req.body;
        const data = 
        await reelModel.commentReel(
            req.params.id,
            req.user.id,
            comment
        );
        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error : err.message
        });
    }
};


// DELETE REELS 

exports.deleteReel = async(rrq, res)=>{
    try {
         await reelModel.deleteReel(
            req.params.id,
            req.user.id
         );
         res.json({
            success: true,
            message: "reels deleted successfully"
         });

    } catch (error) {
         res.status(500).json({
            success: false,
            errror : error.message
         });
    }
};
