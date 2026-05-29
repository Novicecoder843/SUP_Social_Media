const express = require("express")

const router = express.Router();
const controller = require("../controllers/reelsController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadReelMiddleware");

router.post("/upload/", auth, upload.single("video"), controller.uploadReel);
router.get("/feed/", auth, controller.getReelsFeed);
router.get("/getMyReels", auth,controller.getMyReel);

router.post("/:id/like", auth, controller.likeReel);

router.post("/:id/view", auth, controller.viewReel);
router.post("/:id/comment", auth, controller.commentReel);

router.post("/save" , auth, controller.toggleSaveReel);
router.get("/savedReels" , auth , controller.getSavedReels);

router.get("/download/:id" , auth , controller.downloadReel);


// SHARE REEL
router.post("/:id/share" , auth, controller.shareReel);

router.post("/report" , auth, controller.reportReel );

router.delete("/:id/delete", auth, controller.deleteReel);




module.exports = router;