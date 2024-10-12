const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { validateToken } = require('../security/auth');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/read', userController.readUser);
router.post('/logout', userController.logout);
router.get('/check-auth', validateToken, userController.checkAuth);

module.exports = router;