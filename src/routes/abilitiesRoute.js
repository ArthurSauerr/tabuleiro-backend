const express = require('express');
const router = express.Router();
const abilitiesController = require('../controller/abilitiesController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, abilitiesController.newAbility);
router.get('/get-all-abilities', validateToken, abilitiesController.readAllAbilities);
router.put('/update', validateToken, abilitiesController.updateAbility);

module.exports = router;