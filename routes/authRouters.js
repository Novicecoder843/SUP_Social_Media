const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControler");
const auth = require("../middleware/authMiddleware");
const upload = require ("../middleware/uploadMiddleware")

const uploadMedia = require("../middleware/postUploadMiddleware");
const postControler =require ("../controllers/postController");




router.post("/register", authController.register);
router.get("/allRegister", authController.getAllUsers);
router.get("/GetRegister/:id", authController.getUserById);
router.put("/Updateregister/:id", authController.updateUser);
router.delete("/deleteregister/:id", authController.deleteUser);



router.post("/verify-login-otp", authController.verifyLoginOtp);
router.post("/login", authController.login);
router.post("/logout",auth , authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


// router.put("/updateme",auth,upload , authController.updateMe);

router.put("/updateme",auth,  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
  ]), authController.updateMe);

  
router.get("/me",auth, authController.getMe);
router.get("/:id",auth, authController.getUserById);


router.post("/follow/:id",auth, authController.follow);
router.post("/unfollow/:id",auth, authController.unfollow);
router.post("/block/:id",auth, authController.block);



// router post -- upload image,video

router.post("/upload",auth ,uploadMedia ,postControler.createPost );
// router.get("/Allpost", postControler.getAllPosts);
// router.get("/postsById:id", postControler.getPostById);

router.get("/posts", postControler.getAllPosts);
router.get("/posts/:id", postControler.getPostById);
router.delete("/deletepost:id", auth, postControler.deletePost);
module.exports = router;


