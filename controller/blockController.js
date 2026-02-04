const BlockModel = require("../models/blockModel");

exports.blockUnblockUser = async (req, res) => {
    try {
        const userId = req.usr.id;
        const blockedUserId = parseInt(req.params.id);

        if (userId === blockedUserId) {
            return res.status(400).json({
                message: "You cannot block yourself"
            });
        }
        const action = await BlockModel.toggleBlock(
            userId,
            blockedUserId
        );
        res.status(200).json({
            message: `User ${action} successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};