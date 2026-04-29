const express = require("express");
const router = express.Router();

const saveController = require("../controllers/saveController");
const authMiddleware = require("../middleware/authMiddleware");

// GET SAVED POSTS
router.get("/saved", authMiddleware, saveController.getSavedPosts);

// SAVE
router.post("/:postId/save", authMiddleware, saveController.savePost);

// UNSAVE
router.delete("/:postId/unsave", authMiddleware, saveController.unsavePost);


module.exports = router;