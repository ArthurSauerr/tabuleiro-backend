const express = require('express');
const router = express.Router();
const attributesController = require('../controller/attributesController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, attributesController.newAttribute);
router.get('/get-char-attributes', validateToken, attributesController.readAllCharAttributes);

module.exports = router;