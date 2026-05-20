const express = require("express");
const router = express.Router();

const reelController = require("../controller/reelController");

router.post("/", reelController.createReel);

router.get("/", reelController.getAllReels);

router.get("/:id", reelController.getSingleReel);

router.delete("/:id", reelController.deleteReel);

router.post("/:id/like", reelController.likeReel);

router.post("/:id/comment", reelController.commentReel);

router.post("/:id/save", reelController.saveReel);

router.post("/:id/share", reelController.shareReel);

router.post("/:id/view", reelController.viewReel);

router.post("/:id/hashtags", reelController.addHashtags);

router.get("/:id/hashtags", reelController.getReelHashtags);

module.exports = router;