const Reel = require("../models/reelModel");


// CREATE REEL
exports.createReel = async (req, res) => {
  try {

    const user_id = req.user.id;

    const {
      caption,
      location_id,
      tagged_users,
      hashtags,
      audio_id,
      visibility,
    } = req.body;

    const video_url = req.file?.key;

    if (!video_url) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    const reel = await Reel.createReel({
      user_id,
      caption,
      location_id,

      tagged_users: JSON.parse(
        tagged_users || "[]"
      ),

      hashtags: JSON.parse(
        hashtags || "[]"
      ),

      audio_id,
      video_url,
      visibility,
    });

    res.status(201).json({
      success: true,
      message: "Reel created successfully",
      data: reel,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET ALL REELS WITH PAGINATION
exports.getReels = async (req, res) => {
  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 5;

    const offset =
      (page - 1) * limit;

    const reels =
      await Reel.getReels(
        limit,
        offset
      );

    res.status(200).json({
      success: true,
      page,
      limit,
      data: reels,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Error fetching reels",
      error: err.message,
    });

  }
};


// GET SINGLE REEL
exports.getReelById = async (req, res) => {
  try {

    const reel =
      await Reel.getReelById(
        req.params.id
      );

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reel,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Error fetching reel",
      error: err.message,
    });

  }
};


// UPDATE REEL
exports.updateReel = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const user_id =
      req.user.id;

    const {
      caption,
      location_id,
      tagged_users,
      hashtags,
      audio_id,
      visibility,
    } = req.body;

    const video_url =
      req.file?.key;

    const updated =
      await Reel.updateReel(
        reel_id,
        user_id,
        {
          caption,
          location_id,

          tagged_users: JSON.parse(
            tagged_users || "[]"
          ),

          hashtags: JSON.parse(
            hashtags || "[]"
          ),

          audio_id,
          video_url,
          visibility,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Reel updated successfully",
      data: updated,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Error updating reel",
      error: err.message,
    });

  }
};


// DELETE REEL
exports.deleteReel = async (req, res) => {
  try {

    await Reel.deleteReel(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message:
        "Reel deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message:
        "Error deleting reel",
      error: err.message,
    });

  }
};


// LIKE REEL
exports.likeReel = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reel_id =
      req.params.id;

    await Reel.likeReel(
      user_id,
      reel_id
    );

    res.status(200).json({
      success: true,
      message:
        "Reel liked successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// UNLIKE REEL
exports.unlikeReel = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reel_id =
      req.params.id;

    await Reel.unlikeReel(
      user_id,
      reel_id
    );

    res.status(200).json({
      success: true,
      message:
        "Reel unliked successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// ADD COMMENT
exports.addComment = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reel_id =
      req.params.id;

    const {
      comment_text
    } = req.body;

    if (!comment_text) {

      return res.status(400).json({
        success: false,
        message:
          "Comment text is required",
      });
    }

    const comment =
      await Reel.addComment({

        user_id,
        reel_id,
        comment_text,
      });

    res.status(201).json({
      success: true,
      message:
        "Comment added successfully",
      data: comment,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET COMMENTS
exports.getComments = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const comments =
      await Reel.getComments(
        reel_id
      );

    res.status(200).json({
      success: true,
      data: comments,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// REPLY COMMENT
exports.replyComment = async (req, res) => {
  try {

    const parent_id =
      req.params.id;

    const user_id =
      req.user.id;

    const {
      comment_text
    } = req.body;

    if (!comment_text) {

      return res.status(400).json({
        success: false,
        message:
          "Reply text is required",
      });
    }

    const reply =
      await Reel.replyComment({
        user_id,
        parent_id,
        comment_text,
      });

    res.status(201).json({
      success: true,
      message:
        "Reply added successfully",
      data: reply,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {

    const comment_id =
      req.params.id;

    const user_id =
      req.user.id;

    await Reel.deleteComment(
      comment_id,
      user_id
    );

    res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET REPLIES
exports.getReplies = async (req, res) => {
  try {

    const parent_id =
      req.params.id;

    const replies =
      await Reel.getReplies(
        parent_id
      );

    res.status(200).json({
      success: true,
      data: replies,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// SAVE REEL
exports.saveReel = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reel_id =
      req.params.id;

    await Reel.saveReel(
      user_id,
      reel_id
    );

    res.status(201).json({
      success: true,
      message:
        "Reel saved successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// UNSAVE REEL
exports.unSaveReel = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reel_id =
      req.params.id;

    await Reel.unSaveReel(
      user_id,
      reel_id
    );

    res.status(200).json({
      success: true,
      message:
        "Reel removed from saved list",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET SAVED REELS
exports.getSavedReels = async (req, res) => {
  try {

    const user_id =
      req.user.id;

    const reels =
      await Reel.getSavedReels(
        user_id
      );

    res.status(200).json({
      success: true,
      data: reels,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// SHARE REEL
exports.shareReel = async (req, res) => {
  try {

    const sender_id =
      req.user.id;

    const reel_id =
      req.params.id;

    const { receiver_id } =
      req.body;

    await Reel.shareReel({
      sender_id,
      receiver_id,
      reel_id,
    });

    res.status(201).json({
      success: true,
      message:
        "Reel shared successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET SENT SHARES
exports.getSentShares = async (req, res) => {
  try {

    const sender_id =
      req.user.id;

    const shares =
      await Reel.getSentShares(
        sender_id
      );

    res.status(200).json({
      success: true,
      data: shares,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET RECEIVED SHARES
exports.getReceivedShares = async (req, res) => {
  try {

    const receiver_id =
      req.user.id;

    const shares =
      await Reel.getReceivedShares(
        receiver_id
      );

    res.status(200).json({
      success: true,
      data: shares,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// DELETE SHARED REEL
exports.deleteSharedReel = async (req, res) => {
  try {

    const share_id =
      req.params.share_id;

    const user_id =
      req.user.id;

    await Reel.deleteSharedReel(
      share_id,
      user_id
    );

    res.status(200).json({
      success: true,
      message:
        "Shared reel deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET SHARE COUNT
exports.getShareCount = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const count =
      await Reel.getShareCount(
        reel_id
      );

    res.status(200).json({
      success: true,
      share_count: count,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// ADD VIEW
exports.addView = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    await Reel.addView(reel_id);

    res.status(200).json({
      success: true,
      message:
        "View added successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET VIEW COUNT
exports.getViewCount = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const count =
      await Reel.getViewCount(
        reel_id
      );

    res.status(200).json({
      success: true,
      views_count: count,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// ADD HASHTAG
exports.addHashtagToReel = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const { hashtag_id } =
      req.body;

    await Reel.addHashtagToReel(
      reel_id,
      hashtag_id
    );

    res.status(201).json({
      success: true,
      message:
        "Hashtag added successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET REEL HASHTAGS
exports.getReelHashtags = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const hashtags =
      await Reel.getReelHashtags(
        reel_id
      );

    res.status(200).json({
      success: true,
      data: hashtags,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// REMOVE HASHTAG
exports.removeHashtagFromReel = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const hashtag_id =
      req.params.hashtag_id;

    await Reel.removeHashtagFromReel(
      reel_id,
      hashtag_id
    );

    res.status(200).json({
      success: true,
      message:
        "Hashtag removed successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};


// GET REEL AUDIO
exports.getReelAudio = async (req, res) => {
  try {

    const reel_id =
      req.params.id;

    const audio =
      await Reel.getReelAudio(
        reel_id
      );

    res.status(200).json({
      success: true,
      data: audio,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};