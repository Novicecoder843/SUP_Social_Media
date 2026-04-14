const express = require('express');
const router = express.Router();
const ctrl = require('../controller/mention.controller');

// Get mentions of a post
// ========================================
/**
 * @swagger
 * /api/posts/{id}/mentions:
 *   get:
 *     summary: Get users mentioned in a post
 *     tags: [Mentions]
 *     parameters:
 *       - $ref: '#/components/parameters/PostGenericId'
 *     responses:
 *       200:
 *         description: Mentions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               mentions:
 *                 - id: 2
 *                   email: user2@test.com
 */
router.get('/posts/:id/mentions', ctrl.getMentionsByPost);
// router.get('/posts/:id/mentions', ctrl.getMentionsByPost);

// Get posts where user is mentioned
// =================================================
/**
 * @swagger
 * /api/users/{userId}/mentions:
 *   get:
 *     summary: Get posts where user is mentioned
 *     tags: [Mentions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               posts: []
 */
router.get('/users/:userId/mentions', ctrl.getPostsMentioningUser);
// router.get('/users/:userId/mentions', ctrl.getPostsMentioningUser);

module.exports = router;