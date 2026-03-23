const Like = require('../models/like.model');

// exports.likePost = async (req, res) => {
//   try {
//     await Like.likePost(req.params.id, req.user.id);

//     res.json({
//       message: "Post liked"
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.unlikePost = async (req, res) => {
//   try {
//     await Like.unlikePost(req.params.id, req.user.id);

//     res.json({
//       message: "Post unliked"
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.likeComment = async (req, res) => {
  try {
    await Like.likeComment(req.params.id, req.user.id);

    res.json({
      message: "Comment liked"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    await Like.unlikeComment(req.params.id, req.user.id);

    res.json({
      message: "Comment unliked"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};