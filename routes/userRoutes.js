// router.post("/createUsers", controller.createUsers);
// router.get("/fatchAllUser", controller.fatchAllUser);
// router.get("/fatchUser/:id", controller.fatchUserById);
// router.put("/updateUser/:id", controller.updateUser);
// router.delete("/deleteUser/:id", controller.deleteUser);

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const blockController = require("../controller/blockController");
const upload = require("../config/multer");

router.post("/register", userController.registerUser);
router.get("/users", userController.getAllUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

router.get("/me", auth, userController.getMyProfile); 

router.put("/update/", auth, upload.fields([ {name: "profile_image", maxCount: 1 },
    {name: "background_image", maxcount: 1 }
]), userController.updateMyProfile);
   
router.post("/:id/follow", auth, followController.followUnfollow);
router.get("/:username", auth, userController.getUserProfileByUsername);
router.post("/:id/block", auth, blockController.blockUnblockUser);
   
module.exports = router;
