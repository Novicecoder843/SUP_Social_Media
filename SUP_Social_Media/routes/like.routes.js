const express = require('express');
const router = express.Router();
const ctrl = require('../controller/like.controller');
const verifyToken = require('../middleware/auth.middleware');

// /**
//  * @swagger
//  * /api/posts/{id}/like:
//  *   post:
//  *     summary: Like a post
//  *     tags: [Likes]
//  *     parameters:
//  *       - $ref: '#/components/parameters/PostGenericId'
//  *     responses:
//  *       200:
//  *         description: Post liked successfully
//  */
// router.post('/posts/:id/like', verifyToken, ctrl.likePost);
// router.post('/posts/:id/like', verifyToken, ctrl.likePost);
// /**
//  * @swagger
//  * /api/posts/{id}/unlike:
//  *   post:
//  *     summary: Unlike a post
//  *     tags: [Likes]
//  *     parameters:
//  *       - $ref: '#/components/parameters/PostGenericId'
//  *     responses:
//  *       200:
//  *         description: Post unliked successfully
//  */
// router.post('/posts/:id/unlike', verifyToken, ctrl.unlikePost);
// router.post('/posts/:id/unlike', verifyToken, ctrl.unlikePost);
/**
 * @swagger
 * /api/comments/{id}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Likes]
 *     parameters:
 *       - $ref: '#/components/parameters/CommentId'
 *     responses:
 *       200:
 *         description: Comment liked successfully
 */
router.post('/comments/:id/like', verifyToken, ctrl.likeComment);
/**
 * @swagger
 * /api/comments/{id}/unlike:
 *   post:
 *     summary: Unlike a comment
 *     tags: [Likes]
 *     parameters:
 *       - $ref: '#/components/parameters/CommentId'
 *     responses:
 *       200:
 *         description: Comment unliked successfully
 */
router.post('/comments/:id/unlike', verifyToken, ctrl.unlikeComment);
// router.post('/comments/:id/unlike', verifyToken, ctrl.unlikeComment);
module.exports = router;