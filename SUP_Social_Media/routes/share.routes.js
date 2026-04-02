const express = require('express');
const router = express.Router();

const ctrl = require('../controller/share.controller');
const verifyToken = require('../middleware/auth.middleware');

// ✅ Share / repost
router.post('/posts/:postId/share', verifyToken, ctrl.sharePost);

// 📥 Get shares
router.get('/posts/:postId/shares', ctrl.getShares);

module.exports = router;