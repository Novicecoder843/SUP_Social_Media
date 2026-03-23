const express = require('express');
const router = express.Router();
const ctrl = require('../controller/comment.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/posts/:id/comment', verifyToken, ctrl.addComment);
router.get('/posts/:id/comments', ctrl.getComments);

module.exports = router;