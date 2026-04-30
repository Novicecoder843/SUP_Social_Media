console.log("✅ postRoutes loaded"); 
 
 const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const  verifyToken = require("../middleware/authMiddleware");

console.log("createPost:",
    postController.createPost);
    console.log("verifyToken:",verifyToken);

//USER POST
router.get("/users/:id/posts", postController.getUserPosts);

// CREATE POST
router.post("/", verifyToken, postController.createPost);

// // GET USER POSTS
// router.get("/user/:id/", postController.getUserPosts);
router.get("/users/:id/posts", postController.getUserPosts);

// GET ALL POSTS
router.get("/", postController.getAllPosts);

// GET SINGLE POST
router.get("/:id", postController.getSinglePost);

// UPDATE POST
router.put("/:id", verifyToken, postController.updatePost);

// DELETE POST
router.delete("/:id", verifyToken, postController.deletePost);



module.exports = router;