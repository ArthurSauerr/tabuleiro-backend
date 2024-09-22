const express = require('express');
const router = express.Router();
const spellsController = require('../controller/spellsController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, spellsController.newSpell);
router.get('/get-spells', validateToken, spellsController.readAllSpells);
router.put('/update', validateToken, spellsController.updateSpell);
router.delete('/delete', validateToken, spellsController.deleteSpell);

module.exports = router;