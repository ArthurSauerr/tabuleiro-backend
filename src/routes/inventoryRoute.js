const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, inventoryController.newItem);
router.get('/get-char-inventory', validateToken, inventoryController.readAllCharItems);

module.exports = router;