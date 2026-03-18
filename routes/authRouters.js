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
router.get("/user/posts", postControler.AllPosts);
router.get("/posts/:id", postControler.getPostById);
router.delete("/deletepost:id", auth, postControler.deletePost);

// post like,comment,share,status //

router.post("/posts/:id/like", auth, postControler.likePost);
router.post("/posts/:id/comment", auth, postControler.commentPost);
router.post("/posts/:id/share", auth, postControler.sharePost);
router.get("/posts/:id/stats", auth, postControler.getPostStats);


//     comment section ///

// replay comment  reply (multi-level) //
router.post("/comment/:commentId/replies", auth ,postControler.replyComment);
// get post comment //

router.post("/post/:postId/comments", auth ,postControler.getPostComments);

// like / unlike
router.post("/comment_like/:id/like", auth, postControler.toggleLikeComment);

// edit comment
router.put("/update_comment/:id", auth, postControler.editComment);

// delete comment
router.delete("/delete_comment/:id", auth, postControler.deleteComments);

// get hashtags of a post
router.get("/:postId/hashtags", postControler.getPostHashtags);






module.exports = router;


