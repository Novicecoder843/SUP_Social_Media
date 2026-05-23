const { file } = require("zod");
const storyModel = require("../models/storyModel");
const upload = require("../middleware/uploadS3");

const createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media file required",
      });
    }
    // const file = await upload(req.file);
    const mediaUrl =  req.file.key;

    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const story = await storyModel.createStory({
      user_id: req.user.id,
      media_url: mediaUrl,
      media_type: mediaType,
      caption: req.body.caption,
      visibility: req.body.visibility || "followers",
    });
    story.media_url =
`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${story.media_url}`;

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFeedStories = async (req, res) => {
  try {
    const stories = await storyModel.getFeedStories(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserStories = async (req, res) => {
  try {
    const stories = await storyModel.getUserStories(
      req.params.userId
    );

    return res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStoryDetails = async (req, res) => {
  try {
    const story = await storyModel.getStoryById(
      req.params.storyId
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const viewStory = async (req, res) => {
  try {
    await storyModel.addStoryView(
      req.params.storyId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Story viewed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStoryViews = async (req, res) => {
  try {
    const views = await storyModel.getStoryViews(
      req.params.storyId
    );

    return res.status(200).json({
      success: true,
      data: views,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteStory = async (req, res) => {
  try {
    const deleted = await storyModel.deleteStory(
      req.params.storyId,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Story not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ADD REACTION
const addReaction = async (req, res) => {
  try {
    const story = await storyModel.getStoryById(
      req.params.storyId
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const reaction = await storyModel.addReaction({
      story_id: req.params.storyId,
      user_id: req.user.id,
      reaction: req.body.reaction,
    });

    return res.status(201).json({
      success: true,
      message: "Reaction added successfully",
      data: reaction,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GET STORY REACTIONS
const getStoryReactions = async (req, res) => {
  try {

    const reactions =
      await storyModel.getStoryReactions(
        req.params.storyId
      );

    return res.status(200).json({
      success: true,
      count: reactions.length,
      data: reactions,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// DELETE REACTION
const deleteReaction = async (req, res) => {
  try {

    const deleted =
      await storyModel.deleteReaction(
        req.params.storyId,
        req.user.id
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Reaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reaction deleted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ADD REPLY
const addReply = async (req, res) => {
  try {

    const story = await storyModel.getStoryById(
      req.params.storyId
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const reply = await storyModel.addReply({
      story_id: req.params.storyId,
      sender_id: req.user.id,
      message: req.body.message,
    });

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: reply,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GET STORY REPLIES
const getStoryReplies = async (req, res) => {
  try {

    const replies =
      await storyModel.getStoryReplies(
        req.params.storyId
      );

    return res.status(200).json({
      success: true,
      count: replies.length,
      data: replies,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// DELETE REPLY
const deleteReply = async (req, res) => {
  try {

    const deleted =
      await storyModel.deleteReply(
        req.params.replyId,
        req.user.id
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// CREATE HIGHLIGHT
const createHighlight = async (req, res) => {
  try {
    const { title, cover_url } = req.body;

    const highlight = await storyModel.createHighlight({
      user_id: req.user.id,
      title,
      cover_url,
    });

    res.status(201).json({
      success: true,
      message: "Highlight created",
      data: highlight,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET USER HIGHLIGHTS
const getUserHighlights = async (req, res) => {
  try {
    const highlights = await storyModel.getUserHighlights(
      req.params.userId
    );

    res.status(200).json({
      success: true,
      data: highlights,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE HIGHLIGHT
const getHighlightById = async (req, res) => {
  try {
    const highlight = await storyModel.getHighlightById(
      req.params.highlightId
    );

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.status(200).json({
      success: true,
      data: highlight,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD STORY TO HIGHLIGHT
const addStoryToHighlight = async (req, res) => {
  try {
    const result = await storyModel.addStoryToHighlight({
      highlight_id: req.params.highlightId,
      story_id: req.body.storyId,
    });

    res.status(201).json({
      success: true,
      message: "Story added to highlight",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE STORY FROM HIGHLIGHT
const removeStoryFromHighlight = async (req, res) => {
  try {
    const deleted = await storyModel.removeStoryFromHighlight({
      highlightId: req.params.highlightId,
      storyId: req.params.storyId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Story not found in highlight",
      });
    }

    res.status(200).json({
      success: true,
      message: "Story removed from highlight",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE HIGHLIGHT
const deleteHighlight = async (req, res) => {
  try {
    const deleted = await storyModel.deleteHighlight(
      req.params.highlightId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD CLOSE FRIEND
const addCloseFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    if (userId == friendId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself",
      });
    }

    const data = await storyModel.addCloseFriend(userId, friendId);

    return res.status(201).json({
      success: true,
      message: "Close friend added successfully",
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// REMOVE CLOSE FRIEND
const removeCloseFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const data = await storyModel.removeCloseFriend(userId, friendId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Close friend not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Close friend removed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GET CLOSE FRIENDS
const getCloseFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await storyModel.getCloseFriends(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createStory,
  getFeedStories,
  getUserStories,
  getStoryDetails,
  viewStory,
  getStoryViews,
  deleteStory,
  addReaction,
  getStoryReactions,
  deleteReaction,
   addReply,
  getStoryReplies,
  deleteReply,
   createHighlight,
  getUserHighlights,
  getHighlightById,
  addStoryToHighlight,
  removeStoryFromHighlight,
  deleteHighlight,
  addCloseFriend,
  removeCloseFriend,
  getCloseFriends,
};