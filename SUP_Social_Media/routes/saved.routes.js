const express = require('express');
const router = express.Router();

const ctrl = require('../controller/saved.controller');
const verifyToken = require('../middleware/auth.middleware');

// ✅ Save
// ===============================================
/**
 * @swagger
 * /api/posts/{postId}/save:
 *   post:
 *     summary: Save (bookmark) a post
 *     tags: [Saved Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Post saved successfully
 */
router.post('/posts/:postId/save', verifyToken, ctrl.savePost);
// router.post('/posts/:postId/save', verifyToken, ctrl.savePost);

// ❌ Unsave
// =====================================
/**
 * @swagger
 * /api/posts/{postId}/save:
 *   delete:
 *     summary: Unsave (remove bookmark)
 *     tags: [Saved Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 */
router.delete('/posts/:postId/save', verifyToken, ctrl.unsavePost);
router.delete('/posts/:postId/save', verifyToken, ctrl.unsavePost);

// 📥 Get my saved posts
// =====================================
/**
 * @swagger
 * /api/posts/saved/me:
 *   get:
 *     summary: Get my saved posts
 *     tags: [Saved Posts]
 *     responses:
 *       200:
 *         description: Saved posts fetched
 *         content:
 *           application/json:
 *             example:
 *               posts: []
 */
router.get('/posts/saved/me', verifyToken, ctrl.getMySavedPosts);
// router.get('/posts/saved/me', verifyToken, ctrl.getMySavedPosts);

module.exports = router;