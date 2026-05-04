const storyModel = require("../models/storyModel");
const db = require("../config/db");


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
        const media_url = req.file.location;

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



exports.viewStory = async (
    req,
    res
) => {

    try {
        const user_id = req.user.id;
        const story_id = req.params.id;
        // 🔍 Step 1: Check story exists
        const story = await db.query(
            "SELECT id FROM user_schema.stories WHERE id = $1",
            [story_id]
        );

        if (story.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }

        await storyModel.addView(
            req.params.id,
            req.user.id
        );



        res.json({
            success: true,
            message: "Story viewed"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};


exports.likeStory = async (
    req,
    res
) => {

    try {

        await storyModel.likeStory(
            req.params.id,
            req.user.id
        );

        res.json({
            success: true,
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
            data: reply
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
            data: viewers
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