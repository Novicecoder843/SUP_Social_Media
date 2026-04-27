const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validators/user.validation");
const { uploadprofile, uploadpost } = require("../middlewares/upload.middleware");

router.get("/me", authMiddleware, userController.getMe);

router.put(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateMe
);

// POSTS
router.post(
  "/posts/create",
  authMiddleware,
  uploadpost.array("images", 5),
  userController.createPost
);

router.get("/posts/my", authMiddleware, userController.getMyPosts);
router.get("/posts/:id", authMiddleware, userController.getPostById);

router.post("/posts/comment", authMiddleware, userController.addComment);
router.get("/posts/:postId/comments", userController.getComments);

router.post("/posts/save/:postId", authMiddleware, userController.savePost);
router.delete("/posts/save/:postId", authMiddleware, userController.unsavePost);

router.get("/profile/:id", userController.getUserById);
router.post("/follow/:id", authMiddleware, userController.follow);
router.post("/unfollow/:id", authMiddleware, userController.unfollow);
router.post("/block/:id", authMiddleware, userController.block);

router.post(
  "/upload-profile",
  authMiddleware,
 uploadprofile.single("image"),
  userController.updateProfileImage
);


router.post("/like/:postId", authMiddleware, userController.likePost);
router.post("/unlike/:postId", authMiddleware, userController.unlikePost);
router.post("/comment/:postId", authMiddleware, userController.commentPost);
router.delete("/post/:postId", authMiddleware, userController.deletePost);
router.post("/share/:postId", authMiddleware, userController.sharePost);
router.get("/:id", userController.getUserById);
module.exports = router;