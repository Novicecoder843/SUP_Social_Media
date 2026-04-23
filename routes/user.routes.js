const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validators/user.validation");
const upload = require("../middlewares/upload.middleware");


console.log("User routes loaded");

router.get("/me", authMiddleware, userController.getMe);

router.put(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateMe
);
const postUpload = require("../middlewares/upload.middleware");

router.post(
  "/create",
  authMiddleware,
  postUpload.array("images", 5),
  userController.createPost
);
router.get("/my-posts", authMiddleware, userController.getMyPosts);

router.get("/:id", userController.getUserById);

router.post("/follow/:id", authMiddleware, userController.follow);
router.post("/unfollow/:id", authMiddleware, userController.unfollow);
router.post("/block/:id", authMiddleware, userController.block);

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  userController.updateProfileImage
);

router.post("/post", authMiddleware, upload.single("image"), userController.createPost);
router.post("/like/:postId", authMiddleware, userController.likePost);
router.post("/unlike/:postId", authMiddleware, userController.unlikePost);
router.post("/comment/:postId", authMiddleware, userController.commentPost);
router.delete("/post/:postId", authMiddleware, userController.deletePost);
router.post("/share/:postId", authMiddleware, userController.sharePost);
router.get("/:id", userController.getUserById);
module.exports = router;