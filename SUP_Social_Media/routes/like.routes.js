const express = require('express');
const router = express.Router();
const ctrl = require('../controller/like.controller');
const verifyToken = require('../middleware/auth.middleware');

// router.post('/posts/:id/like', verifyToken, ctrl.likePost);
// router.post('/posts/:id/unlike', verifyToken, ctrl.unlikePost);
router.post('/comments/:id/like', verifyToken, ctrl.likeComment);
router.post('/comments/:id/unlike', verifyToken, ctrl.unlikeComment);
module.exports = router;