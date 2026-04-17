const { sendMessage } = require("../utils/chat");

exports.send = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    const result = await sendMessage(senderId, receiverId, message);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};