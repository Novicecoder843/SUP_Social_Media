const UserFollow = require("../model/userfollow.model");

/* ================= FOLLOW ================= */
exports.follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const result = await UserFollow.followUser(followerId, followingId);

    res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: result,
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UNFOLLOW ================= */
exports.unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);

    await UserFollow.unfollowUser(followerId, followingId);

    res.json({
      success: true,
      message: "User unfollowed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= BLOCK ================= */
exports.block = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = parseInt(req.params.id);

    if (blockerId === blockedId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    const result = await UserFollow.blockUser(blockerId, blockedId);

    res.status(201).json({
      success: true,
      message: "User blocked successfully",
      data: result,
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "User already blocked",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
