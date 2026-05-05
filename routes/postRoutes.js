const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const upload = require("../middleware/uploadS3");

const verifyToken = require("../middleware/authMiddleware");

console.log("createPost:",
    postController.createPost);
    console.log("verifyToken:",verifyToken);

// CREATE POST
router.post("/", verifyToken, upload.array("files", 10), postController.createPost);

// GET ALL POSTS
router.get("/", postController.getAllPosts);

// GET SINGLE POST
router.get("/:id", postController.getSinglePost);

// UPDATE POST
router.put("/:id", verifyToken, postController.updatePost);

// DELETE POST
router.delete("/:id", verifyToken, postController.deletePost);

// GET USER POSTS
router.get("/users/:id/posts", postController.getUserPosts);

module.exports = router;