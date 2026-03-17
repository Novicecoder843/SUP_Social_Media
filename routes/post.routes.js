const express = require("express");
const router = express.Router();

const controller = require("../controller/post.controller");
const upload = require("../middleware/upload");

router.post("/create", controller.createPost);

// MEDIA UPLOAD
router.post("/media", upload.array("files", 5), controller.addMedia);

router.get("/user/:user_id", controller.getMyPosts);
router.get("/:id", controller.getPostById);

router.put("/archive", controller.archivePost);
router.delete("/delete", controller.deletePost);

router.post("/like", controller.createLike);
router.post("/comment", controller.createComment);
router.post("/save", controller.savePost);
router.post("/share", controller.sharePost);

module.exports = router;