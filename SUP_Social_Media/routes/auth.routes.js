// const express = require('express');
// const router = express.Router();
// const auth = require('../controller/auth.controller');

// router.post('/register', auth.register);
// router.post('/login', auth.login);
// router.post('/logout', auth.logout);
// router.post('/refresh-token', auth.refreshToken);

// module.exports = router;
const router = require('express').Router();
const auth = require('../controller/auth.controller');

router.post('/register', auth.register);
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               accessToken: your_jwt_token
 *               user:
 *                 id: 1
 *                 email: user@test.com
 */
router.post('/login', auth.login);
// router.post('/login', auth.login);
router.post('/refresh-token', auth.refreshToken);
router.post('/logout', auth.logout);
router.post('/verify-email', auth.verifyEmail);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

module.exports = router;




