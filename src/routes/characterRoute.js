const express = require('express');
const router = express.Router();
const characterController = require('../controller/characterController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, characterController.newCharacter);
router.get('/list-of-characters', validateToken, characterController.readAllCharacters);
router.get('/get-character', validateToken, characterController.readCharacterById);
router.get('/get-all-character', validateToken, characterController.readAllInfoCharacter);
router.put('/update', validateToken, characterController.updateCharacter);
router.delete('/delete', validateToken, characterController.deleteCharacter);

module.exports = router;