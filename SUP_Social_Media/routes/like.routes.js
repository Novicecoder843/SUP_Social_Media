const express = require('express');
const router = express.Router();
const ctrl = require('../controller/like.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/posts/:id/like', verifyToken, ctrl.likePost);
router.post('/posts/:id/unlike', verifyToken, ctrl.unlikePost);

module.exports = router;