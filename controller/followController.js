const FollowModel = require("../models/followModel");

exports.followUnfollow = async (req, res) => {
  try {
    const followerId = req.user.id;        // from JWT
    const userId = parseInt(req.params.id);

    if (userId === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const action = await FollowModel.toggleFollow(userId, followerId);

    res.status(200).json({
      message: `User ${action} successfully`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};