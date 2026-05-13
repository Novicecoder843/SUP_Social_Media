// const reelModel = require("../models/reelModel");

// exports.createReel = async (req, res) => {
//   try {
//     const reel = await reelModel.createReel(req.body);

//     res.status(201).json({
//       success: true,
//       reel,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.getAllReels = async (req, res) => {
//   try {
//     const reels = await reelModel.getAllReels();

//     res.json(reels);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.getSingleReel = async (req, res) => {
//   try {
//     const reel = await reelModel.getSingleReel(req.params.id);

//     res.json(reel);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.deleteReel = async (req, res) => {
//   try {
//     await reelModel.deleteReel(req.params.id);

//     res.json({
//       message: "Reel deleted",
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };