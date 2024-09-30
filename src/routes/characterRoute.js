const express = require('express');
const router = express.Router();
const characterController = require('../controller/characterController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, characterController.newCharacter);
router.get('/list-of-characters', validateToken, characterController.readAllCharacters);
router.get('/get-character/:char_id', validateToken, characterController.readCharacterById);
router.get('/get-all-character/:char_id', validateToken, characterController.readAllInfoCharacter);
router.put('/update/:char_id', validateToken, characterController.updateCharacter);
router.delete('/delete/:char_id', validateToken, characterController.deleteCharacter);

module.exports = router;