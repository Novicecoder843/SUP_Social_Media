const express = require('express');
// const router = express.Router();
// const UserController = require('../controller/user.controller');
// router.post('/users', UserController.createUser);
// router.get('/users', UserController.getAllUsers);
// router.get('/users/:id', UserController.getUserById);
// router.put('/users/:id', UserController.updateUser);
// router.delete('/users/:id', UserController.deleteUser);
// module.exports = router;
// const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.get('/:id', auth, userController.getUserById);
router.post('/follow/:id', auth, userController.followUser);
router.post('/unfollow/:id', auth, userController.unfollowUser);
router.post('/block/:id', auth, userController.blockUser);

// // router.get('/me', authMiddleware, userController.getMe);
// router.get('/me', authMiddleware, userController.getMe);
// router.put('/me', authMiddleware, userController.updateMe);
// router.get('/:id', authMiddleware, userController.getUserById);
// router.get('/me', authMiddleware, getMe);
// router.put('/me', authMiddleware, updateMe);
// router.get('/:id', authMiddleware, getUserById);

module.exports = router;





