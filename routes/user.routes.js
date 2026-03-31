const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validators/user.validation");
router.get("/me", authMiddleware, userController.getMe);
router.put(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateMe
);
router.get("/:id", userController.getUserById);
router.post("/follow/:id", authMiddleware, userController.follow);
router.post("/unfollow/:id", authMiddleware, userController.unfollow);
router.post("/block/:id", authMiddleware, userController.block);
module.exports = router;