

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Validation = require("../middleware/validate");
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const blockController = require("../controller/blockController");
const upload = require("../middleware/upload");

const {
    registerUserSchema,
    updateUserSchema,
    userIdSchema,
    usernameSchema
} = require("../validations/userValidation");

router.post("/register", Validation(registerUserSchema), userController.registerUser);
router.get("/getusers", userController.getAllUsers);
router.put("/updateusers/:id", Validation(updateUserSchema), userController.updateUser);
router.delete("/deleteusers/:id", Validation(userIdSchema),userController.deleteUser);

router.get("/me", auth, userController.getMyProfile);
router.put("/me", auth, upload.fields([ {name: "profile_image", maxCount: 1 },
    {name: "background_image", maxCount:1 }
]), Validation(updateUserSchema), userController.updateMyProfile);

router.post("/:id/follow", auth, Validation(userIdSchema), followController.followUnfollow);
router.get("/:username", auth, Validation(usernameSchema), userController.getUserProfileByUsername);
router.post("/:id/block", auth, Validation(userIdSchema), blockController.blockUnblockUser);

module.exports = router;