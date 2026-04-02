const express = require('express');
const router = express.Router();

const ctrl = require('../controller/saved.controller');
const verifyToken = require('../middleware/auth.middleware');

// ✅ Save
router.post('/posts/:postId/save', verifyToken, ctrl.savePost);

// ❌ Unsave
router.delete('/posts/:postId/save', verifyToken, ctrl.unsavePost);

// 📥 Get my saved posts
router.get('/posts/saved/me', verifyToken, ctrl.getMySavedPosts);

module.exports = router;