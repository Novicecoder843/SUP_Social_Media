const express = require("express");
const router = express.Router();

const saveController = require("../controller/saveController");
const verifyToken = require("../middleware/authMiddleware");

// save post
router.post("/posts/:id/save", verifyToken, saveController.savePost);

// unsave post
router.delete("/posts/:id/save", verifyToken, saveController.unsavePost);

// get saved posts
router.get("/users/:id/saved-posts", verifyToken, saveController.getSaved);

module.exports = router;