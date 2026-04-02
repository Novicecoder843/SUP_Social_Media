const express = require('express');
const router = express.Router();
const ctrl = require('../controller/mention.controller');

// Get mentions of a post
router.get('/posts/:id/mentions', ctrl.getMentionsByPost);

// Get posts where user is mentioned
router.get('/users/:userId/mentions', ctrl.getPostsMentioningUser);

module.exports = router;