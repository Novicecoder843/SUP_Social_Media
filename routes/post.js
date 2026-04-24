const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../uploads/upload");

// CREATE POST
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

// GET ALL POSTS
router.get("/", authMiddleware, postController.getPosts);

// GET SINGLE POST
router.get("/:id", authMiddleware, postController.getPost);

// UPDATE POST
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  postController.updatePost
);

// DELETE POST
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;