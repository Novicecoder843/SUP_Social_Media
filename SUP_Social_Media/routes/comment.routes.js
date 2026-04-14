const express = require('express');
const router = express.Router();
const ctrl = require('../controller/comment.controller');
const verifyToken = require('../middleware/auth.middleware');
// /**
//  * @swagger
//  * /api/posts/{id}/comment:
//  *   post:
//  *     summary: Add comment to a post
//  *     tags: [Comments]
//  *     parameters:
//  *       - $ref: '#/components/parameters/PostGenericId'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               content:
//  *                 type: string
//  *                 example: Nice post!
//  *     responses:
//  *       200:
//  *         description: Comment added successfully
//  */
// router.post('/posts/:id/comment', verifyToken, ctrl.addComment);
// router.post('/posts/:id/comment', verifyToken, ctrl.addComment);
// /**
//  * @swagger
//  * /api/posts/{id}/comments:
//  *   get:
//  *     summary: Get comments of a post
//  *     tags: [Comments]
//  *     parameters:
//  *       - $ref: '#/components/parameters/PostGenericId'
//  *     responses:
//  *       200:
//  *         description: Comments fetched successfully
//  *         content:
//  *           application/json:
//  *             example:
//  *               comments: []
//  */
// router.get('/posts/:id/comments', ctrl.getComments);
// router.get('/posts/:id/comments', ctrl.getComments);
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - $ref: '#/components/parameters/CommentId'
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/comments/:id', verifyToken, ctrl.deleteComment);
// router.delete('/comments/:id', verifyToken, ctrl.deleteComment);

module.exports = router;