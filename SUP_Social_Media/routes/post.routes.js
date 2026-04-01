const express = require('express');
const router = express.Router();
const ctrl = require('../controller/post.controller');
const controller = require('../controller/post.controller');
const upload = require('../middleware/upload.middleware');
const verifyToken = require('../middleware/auth.middleware'); 
// Create post
router.post(
  '/',
  verifyToken,   // ✅ MUST BE HERE
  upload.array('media', 6),
  ctrl.createPost
);
// router.post(
//   '/',
//   upload.array('media', 6),
//   controller.createPost
// );

// 🔥 Specific routes FIRST
router.get('/feed', controller.getFeed);
router.get('/users/:id/posts', controller.getUserPosts);

// Then dynamic routes
router.get('/:id', controller.getPost);
router.put('/:id', controller.updatePost);
router.delete('/:id', controller.deletePost);

module.exports = router;