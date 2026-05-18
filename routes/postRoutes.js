const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const upload = require("../middleware/uploadS3");
const Validation = require("../middleware/validate");
const verifyToken = require("../middleware/authMiddleware");

const { createPostSchema,
    updatePostSchema,
    postIdSchema,
    userIdSchema
 } = require("../validations/postValidation");

console.log("createPost:",
    postController.createPost);
 console.log("verifyToken:",verifyToken);

// CREATE POST
router.post("/", verifyToken, upload.array("files", 10), Validation(createPostSchema), postController.createPost);

// GET ALL POSTS
router.get("/", postController.getAllPosts);

// GET SINGLE POST
router.get("/:id", verifyToken, Validation(postIdSchema), postController.getSinglePost);

// UPDATE POST
router.put("/:id", verifyToken, Validation(updatePostSchema), postController.updatePost);

// DELETE POST
router.delete("/:id", verifyToken,Validation(postIdSchema), postController.deletePost);

// GET USER POSTS
router.get("/users/:id/posts",Validation(userIdSchema), postController.getUserPosts);

module.exports = router;