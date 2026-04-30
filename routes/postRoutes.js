console.log("postRoutes loaded");

const express = require("express");
const router = express.Router();

const postController = require("../controller/postController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer"); // ✅ IMPORTANT ADD

console.log("createPost:", postController.createPost);
console.log("verifyToken:", verifyToken);

// CREATE POST (with image upload)
router.post(
  "/",
  verifyToken,
  upload.single("image"),   // ✅ IMPORTANT FIX
  postController.createPost
);

// GET ALL POSTS
router.get("/", postController.getAllPosts);

// GET SINGLE POST
router.get("/:id", postController.getSinglePost);

// UPDATE POST
router.put("/:id", verifyToken, postController.updatePost);

// DELETE POST
router.delete("/:id", verifyToken, postController.deletePost);

// GET USER POSTS
router.get("/user/:id", postController.getUserPosts);

// alternative route
router.get("/users/:id/posts", postController.getUserPosts);

module.exports = router;