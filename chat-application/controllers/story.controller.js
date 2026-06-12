const storyModel = require("../models/story.model");

/////////////////////////////////////////////////////
// 📤 UPLOAD STORY
/////////////////////////////////////////////////////
exports.uploadStory = async (req, res) => {
  try {

    console.log("USER =>", req.user);
    console.log("FILES =>", req.files);

    const file = req.files?.[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Media file is required"
      });
    }

    const story = await storyModel.createStory(
      req.user.id,
      file.location,
      file.mimetype.startsWith("image/")
        ? "image"
        : "video",
      req.body.caption || null
    );

    console.log("STORY SAVED =>", story);

    return res.status(201).json({
      success: true,
      data: story
    });

  } catch (err) {
    console.log("ERROR =>", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// exports.uploadStory = async (req, res) => {
//   try {
//     console.log("USER =>", req.user);
//     console.log("USER ID =>", user_id);
//     console.log("FILES =>", req.files);
//     console.log("FILE =>", req.file);

//     const file = req.file || req.files?.[0];
//     console.log("MEDIA URL =>", file.location);
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Media file is required"
//       });
//     }

//     const user_id =req.user.id ||req.user.userId;
//     const media_url = file.location;

//     const media_type =
//       file.mimetype.startsWith("image/")
//         ? "image"
//         : "video";

//     const caption = req.body.caption || null;

//     const story = await storyModel.createStory(
//       user_id,
//       media_url,
//       media_type,
//       caption
//     );

//     console.log("STORY SAVED =>", story);

//     return res.status(201).json({
//       success: true,
//       data: story
//     });

//   } catch (err) {

//     console.log("UPLOAD ERROR =>", err);

//     return res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };
/////////////////////////////////////////////////////
// 📚 GET ALL STORIES
/////////////////////////////////////////////////////

exports.getStories = async (
  req,
  res
) => {

  try {

    const stories =
      await storyModel.getAllStories();

    return res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });

  } catch (err) {

    console.log(
      "❌ Get Stories Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// 👀 VIEW STORY
/////////////////////////////////////////////////////

exports.viewStory = async (
  req,
  res
) => {

  try {

    const storyId =
      req.params.id;

    const viewerId =
      req.user.id;

    await storyModel.addView(
      storyId,
      viewerId
    );

    return res.status(200).json({
      success: true,
      message: "Story viewed"
    });

  } catch (err) {

    console.log(
      "❌ View Story Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// ❤️ LIKE STORY
/////////////////////////////////////////////////////

exports.likeStory = async (
  req,
  res
) => {

  try {

    const storyId =
      req.params.id;

    const userId =
      req.user.id;

    await storyModel.likeStory(
      storyId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Story liked"
    });

  } catch (err) {

    console.log(
      "❌ Like Story Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// 💬 REPLY STORY
/////////////////////////////////////////////////////

exports.replyStory = async (
  req,
  res
) => {

  try {

    const storyId =
      req.params.id;

    const senderId =
      req.user.id;

    const { message } =
      req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Reply message is required"
      });
    }

    const reply =
      await storyModel.replyStory(
        storyId,
        senderId,
        message
      );

    return res.status(201).json({
      success: true,
      data: reply
    });

  } catch (err) {

    console.log(
      "❌ Reply Story Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// 👥 GET STORY VIEWERS
/////////////////////////////////////////////////////

exports.getStoryViewers = async (
  req,
  res
) => {

  try {

    const storyId =
      req.params.id;

    const viewers =
      await storyModel.getStoryViewers(
        storyId
      );

    return res.status(200).json({
      success: true,
      count: viewers.length,
      data: viewers
    });

  } catch (err) {

    console.log(
      "❌ Story Viewers Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/////////////////////////////////////////////////////
// 🗑 DELETE STORY
/////////////////////////////////////////////////////

exports.deleteStory = async (
  req,
  res
) => {

  try {

    const storyId =
      req.params.id;

    const userId =
      req.user.id;

    await storyModel.deleteStory(
      storyId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully"
    });

  } catch (err) {

    console.log(
      "❌ Delete Story Error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};