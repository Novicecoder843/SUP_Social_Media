const BlockModel = require("../models/blockModel");

exports.blockUnblockUser = async (req, res) => {
  try {
    const blocker_id = req.user.id;
    const blocked_id = parseInt(req.params.id);

    if (blocker_id === blocked_id) {
      return res.status(400).json({
        message: "You cannot block yourself"
      });
    }

    const action = await BlockModel.toggleBlock(blocker_id, blocked_id);

    res.status(200).json({
      message: action.message,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};