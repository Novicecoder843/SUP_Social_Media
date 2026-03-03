const express = require('express');
const router = express.Router();
const controller = require('../controller/post.controller');
const upload = require('../middleware/upload.middleware');

// Create post
router.post(
  '/',
  upload.array('media', 6),
  controller.createPost
);

// 🔥 Specific routes FIRST
router.get('/feed', controller.getFeed);
router.get('/users/:id/posts', controller.getUserPosts);

// Then dynamic routes
router.get('/:id', controller.getPost);
router.put('/:id', controller.updatePost);
router.delete('/:id', controller.deletePost);

module.exports = router;