

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const blockController = require("../controller/blockController");
const upload = require("../middleware/upload");

router.post("/register", userController.registerUser);
router.get("/getusers", userController.getAllUsers);
router.put("/updateusers/:id", userController.updateUser);
router.delete("/deleteusers/:id", userController.deleteUser);

router.get("/me", auth, userController.getMyProfile);

router.put("/update/", auth, upload.fields([ {name: "profile_image", maxCount: 1 },
    {name: "background_image", maxCount:1 }
]), userController.updateMyProfile);

router.post("/:id/follow", auth, followController.followUnfollow);
router.get("/:username", auth, userController.getUserProfileByUsername);
router.post("/:id/block", auth, blockController.blockUnblockUser);

module.exports = router;