const express = require("express");
const router = express.Router();

const saveController = require("../controller/saveController");
const verifyToken = require("../middleware/authMiddleware");const validate = require("../middleware/validate");
validations = require("../middleware/validate");

const {
    postIdSchema,
  userIdSchema
} = require("../validations/saveValidation");

// save post
router.post("/posts/:id/save", verifyToken, validations(postIdSchema), saveController.savePost);

// unsave post
router.delete("/posts/:id/save", verifyToken, validations(postIdSchema), saveController.unsavePost);

// get saved posts
router.get("/users/:id/saved-posts", verifyToken, validations(userIdSchema), saveController.getSaved);

module.exports = router;