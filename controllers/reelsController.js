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

                // GENERATE TEMP URL
        const temp_video_url = await generateSignedUrl(video_url);

        res.status(201).json({
            success: true,
            message: "reel uploaded successfully",

            temp_video_url,

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
        
        const result = await reelModel.addView(
            req.params.id,
            req.user.id
        );
        res.json({
            success: true,
            data: result,
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

exports.deleteReel = async(req, res)=>{
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




// SHARE REEL
exports.shareReel = async (
    req,
    res
) => {

    try {

        const result =
            await reelModel.shareReel(
                req.params.id,
                req.user.id
            );

        res.json({

            success: true,

            shared: result.shared,

            message: "Reel shared"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};





// TOGGLE SAVE / UNSAVE
exports.toggleSaveReel = async (req, res) => {

    try {

        const user_id = req.user.id;

        const { reel_id } = req.body;

        if (!reel_id) {

            return res.status(400).json({
                success: false,
                message: "reel_id required"
            });

        }

        // CHECK ALREADY SAVED
        const alreadySaved =
        await reelModel.checkSaveed(
            user_id,
            reel_id
        );

        // UNSAVE
        if (alreadySaved) {

            await reelModel.unsaveReel(
                user_id,
                reel_id
            );

            return res.json({
                success: true,
                saved: false,
                message: "reel unsaved successfully"
            });

        }

        // SAVE
        await reelModel.saveReel(
            user_id,
            reel_id
        );

        res.json({
            success: true,
            saved: true,
            message: "reel saved successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

};

/// GET SAVE REELS 

exports.getSavedReels =  async (req, res)=>{

    try {
        const user_id = req.user.id;

        const reels = 
        await reelModel.getSavedReels(user_id);

        const updatedReels = await Promise.all(
            reels.map(async(reel)=>{
                const temp_video_url = await generateSignedUrl(
                    reel.video_url
                );
                return{
                    ...reel,
                    temp_video_url
                };
            })
        );
        res.json({
            success: true,
            data: updatedReels
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error : err.message
        });
    }
};


// DOWNLOAD REELS 


exports.downloadReel = async(req,res)=>{

    try {
        const reel_id = req.params.id ;

        const reel = await reelModel.getReelById(reel_id);

        if(!reel){

            return res.status(400).json({
                success: false,
                message:"reels not found"
            });
        }

        const download_url = 
        await generateSignedUrl(reel.video_url);

        res.json({
            success:true , 
            download_url
        });
        
    } catch (err) {
        res.status(500).json({
            success:true ,
            message : err.message
        });
    }
};