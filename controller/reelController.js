const reelModel = require("../models/reelModel");

exports.createReel = async (req, res) => {
  try {
    const reel = await reelModel.createReel(req.body);

    res.status(201).json({
      success: true,
      reel,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAllReels = async (req, res) => {
  try {
    const reels = await reelModel.getAllReels();

    res.json(reels);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getSingleReel = async (req, res) => {
  try {
    const reel = await reelModel.getSingleReel(req.params.id);

    res.json(reel);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteReel = async (req, res) => {
  try {
    await reelModel.deleteReel(req.params.id);

    res.json({
      message: "Reel deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.likeReel = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const { user_id } = req.body;

    const like = await reelModel.likeReel(
      user_id,
      reel_id
    );

    res.json({
      success: true,
      message: "Reel liked",
      like
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.commentReel = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const {
      user_id,
      comment_text,
      parent_id
    } = req.body;

    const comment = await reelModel.commentReel(
      user_id,
      reel_id,
      comment_text,
      parent_id
    );

    res.json({
      success: true,
      message: "Comment added",
      comment
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.saveReel = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const { user_id } = req.body;

    const save = await reelModel.saveReel(
      user_id,
      reel_id
    );

    res.json({
      success: true,
      message: "Reel saved",
      save
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.shareReel = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const {
      sender_id,
      receiver_id
    } = req.body;

    const share = await reelModel.shareReel(
      sender_id,
      receiver_id,
      reel_id
    );

    res.json({
      success: true,
      message: "Reel shared",
      share
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.viewReel = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const {
      user_id,
      watched_seconds
    } = req.body;

    const view = await reelModel.viewReel(
      user_id,
      reel_id,
      watched_seconds
    );

    res.json({
      success: true,
      message: "View added",
      view
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.addHashtags = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const { tags } = req.body;

    const hashtags = await reelModel.addHashtags(
      reel_id,
      tags
    );

    res.json({
      success: true,
      hashtags
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.getReelHashtags = async (req, res) => {

  try {

    const reel_id = req.params.id;

    const hashtags = await reelModel.getReelHashtags(reel_id);

    res.json({
      success: true,
      hashtags
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};