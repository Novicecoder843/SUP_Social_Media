const express = require('express');
const router = express.Router();

const UserController = require('../controller/userController');

/* =========================
   USER ROUTES
========================= */

// Get users
router.get('/users', UserController.getUser);

// Create user
router.post('/users', UserController.createUser);

module.exports = router;
