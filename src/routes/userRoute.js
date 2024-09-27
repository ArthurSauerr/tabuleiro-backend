const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/read', userController.readUser);
router.post('/logout', userController.logout);

module.exports = router;