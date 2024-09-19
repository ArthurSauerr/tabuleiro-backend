const express = require('express');
const router = express.Router();
const characterController = require('../controller/characterController');
const { validateToken } = require('../security/auth');

router.post('/new-char', validateToken, characterController.newCharacter);
router.get('/list-of-characters', validateToken, characterController.readAllCharacters);
router.get('/get-character', validateToken, characterController.readCharacterById);

module.exports = router;