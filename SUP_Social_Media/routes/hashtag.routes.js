const express = require('express');
const router = express.Router();
const ctrl = require('../controller/hashtag.controller');


/**
 * @swagger
 * /api/hashtags:
 *   get:
 *     summary: Search hashtags
 *     tags: [Hashtags]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *           default: travel
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Hashtags fetched
 *         content:
 *           application/json:
 *             example:
 *               hashtags:
 *                 - tag: travel
 *                 - tag: food
 */
router.get('/hashtags', ctrl.searchHashtags);
// router.get('/hashtags', ctrl.searchHashtags);
/**
 * @swagger
 * /api/hashtags/trending:
 *   get:
 *     summary: Get trending hashtags
 *     tags: [Hashtags]
 *     responses:
 *       200:
 *         description: Trending hashtags
 *         content:
 *           application/json:
 *             example:
 *               hashtags:
 *                 - tag: viral
 *                   count: 100
 *                 - tag: tech
 *                   count: 80
 */
router.get('/hashtags/trending', ctrl.getTrending);
// router.get('/hashtags/trending', ctrl.getTrending);
/**
 * @swagger
 * /api/hashtags/{tag}:
 *   get:
 *     summary: Get posts by hashtag
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *           default: travel
 *     responses:
 *       200:
 *         description: Posts fetched by hashtag
 *         content:
 *           application/json:
 *             example:
 *               posts: []
 */
router.get('/hashtags/:tag', ctrl.getPostsByTag);
// router.get('/hashtags/:tag', ctrl.getPostsByTag);

module.exports = router;