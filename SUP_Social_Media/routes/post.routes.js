const express = require('express');
const router = express.Router();
const ctrl = require('../controller/post.controller');
const controller = require('../controller/post.controller');
const upload = require('../middleware/upload.middleware');
const verifyToken = require('../middleware/auth.middleware'); 
const analyticsCtrl = require('../controller/analytics.controller');
const reportCtrl = require('../controller/report.controller');
// Create post
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (with media upload)
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello world
 *               visibility:
 *                 type: string
 *                 example: public
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post created successfully
 */
router.post(
  '/',
  verifyToken,
  upload.array('media', 6),
  ctrl.createPost
);
// router.post(
//   '/',
//   verifyToken,   // ✅ MUST BE HERE
//   upload.array('media', 6),
//   ctrl.createPost
// );
// // router.post(
// //   '/',
// //   upload.array('media', 6),
// //   controller.createPost
// // );

// 🔥 Specific routes FIRST
/**
 * @swagger
 * /api/posts/feed:
 *   get:
 *     summary: Get feed posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Feed fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               posts: []
 */
router.get('/feed', controller.getFeed);
// router.get('/feed', controller.getFeed);
/**
 * @swagger
 * /api/posts/users/{id}/posts:
 *   get:
 *     summary: Get posts by user
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: User posts fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               posts: []
 */
router.get('/users/:id/posts', controller.getUserPosts);
// router.get('/users/:id/posts', controller.getUserPosts);


// // // Then dynamic routes
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get single post
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               content: "Hello world"
 */
 router.get('/:id', controller.getPost);
// // router.get('/:id', controller.getPost);
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update post
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:id', controller.updatePost);
// router.put('/:id', controller.updatePost);
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:id', controller.deletePost);
// router.delete('/:id', controller.deletePost);
// // //  🔟 Analytics
/**
 * @swagger
 * /api/posts/{postId}/analytics:
 *   get:
 *     summary: Get post analytics
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               likes: 10
 *               comments: 5
 *               shares: 2
 *               saves: 3
 */
router.get('/:postId/analytics', verifyToken, analyticsCtrl.getPostAnalytics);

// // router.get('/:postId/analytics', verifyToken, analyticsCtrl.getPostAnalytics);

// 🚨 Report post
/**
 * @swagger
 * /api/posts/{postId}/report:
 *   post:
 *     summary: Report a post
 *     tags: [Report]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportPost'
 *     responses:
 *       200:
 *         description: Post reported successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Report submitted
 */
router.post('/:postId/report', verifyToken, reportCtrl.reportPost);
//router.post('/:postId/report', verifyToken, reportCtrl.reportPost);
module.exports = router;

