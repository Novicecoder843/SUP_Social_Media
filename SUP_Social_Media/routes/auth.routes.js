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
router.post('/login', auth.login);
router.post('/refresh-token', auth.refreshToken);
router.post('/logout', auth.logout);
router.post('/verify-email', auth.verifyEmail);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

module.exports = router;




