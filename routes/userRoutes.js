// router.post("/createUsers", controller.createUsers);
// router.get("/fatchAllUser", controller.fatchAllUser);
// router.get("/fatchUser/:id", controller.fatchUserById);
// router.put("/updateUser/:id", controller.updateUser);
// router.delete("/deleteUser/:id", controller.deleteUser);
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Validation = require("../middleware/validate");
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const blockController = require("../controller/blockController");
const upload = require("../config/multer");
const uploads = require("../middleware/uploadS3");

const {
    registerUserSchema,
    updateUserSchema,
    userIdSchema,
    usernameSchema
} = require("../validations/userValidation");

router.post("/register", Validation(registerUserSchema), userController.registerUser);
router.get("/users", userController.getAllUsers);
router.put("/users/:id",Validation(updateUserSchema), userController.updateUser);
router.delete("/users/:id", Validation(userIdSchema), userController.deleteUser);

router.get("/me", auth, userController.getMyProfile);
router.put("/me", auth, uploads.fields([ { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 }
]), Validation(updateUserSchema), userController.updateMyProfile);
router.post("/:id/follow", auth, Validation(userIdSchema), followController.followUnfollow);
router.get("/:username", auth, Validation(usernameSchema), userController.getUserProfileByUsername);
router.post("/:id/block", auth, Validation(userIdSchema), blockController.blockUnblockUser);

module.exports = router;