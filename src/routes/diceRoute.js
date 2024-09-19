const express = require('express');
const router = express.Router();
const diceController = require('../controller/diceController');
const { validateToken } = require('../security/auth');

router.post('/roll', validateToken, diceController.rollDice);

module.exports = router;