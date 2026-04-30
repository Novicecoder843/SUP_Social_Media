const express = require("express");
const router = express.Router();

const saveController = require("../controller/saveController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/posts/:id/save", verifyToken, saveController.savePost);

router.delete("/posts/:id/save", verifyToken, saveController.unsavePost);

router.get("/saved-posts", verifyToken, saveController.getSaved);

module.exports = router;