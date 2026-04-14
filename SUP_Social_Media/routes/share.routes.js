const express = require('express');
const router = express.Router();

const ctrl = require('../controller/share.controller');
const verifyToken = require('../middleware/auth.middleware');

// ✅ Share / repost
/**
 * @swagger
 * /api/posts/{postId}/share:
 *   post:
 *     summary: Share / repost a post
 *     tags: [Shares]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Check this out!
 *     responses:
 *       200:
 *         description: Post shared successfully
 */
router.post('/posts/:postId/share', verifyToken, ctrl.sharePost);
// router.post('/posts/:postId/share', verifyToken, ctrl.sharePost);

// 📥 Get shares
/**
 * @swagger
 * /api/posts/{postId}/shares:
 *   get:
 *     summary: Get share count and users
 *     tags: [Shares]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Shares fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               count: 3
 *               shares:
 *                 - id: 1
 *                   email: user@test.com
 *                   comment: Nice post
 *                   created_at: "2025-01-01"
 */
router.get('/posts/:postId/shares', ctrl.getShares);
// router.get('/posts/:postId/shares', ctrl.getShares);

module.exports = router;