const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const auth = require("../middleware/authMiddleware");

router.post("/posts", auth, postController.createPost);

module.exports = router;