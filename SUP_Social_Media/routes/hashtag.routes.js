const express = require('express');
const router = express.Router();
const ctrl = require('../controller/hashtag.controller');

router.get('/hashtags', ctrl.searchHashtags);
router.get('/hashtags/trending', ctrl.getTrending);
router.get('/hashtags/:tag', ctrl.getPostsByTag);

module.exports = router;