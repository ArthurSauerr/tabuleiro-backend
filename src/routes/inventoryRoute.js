const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, inventoryController.newItem);
router.get('/get-char-inventory', validateToken, inventoryController.readAllCharItems);
router.put('/update', validateToken, inventoryController.updateInventoryItem);
router.delete('/delete/:char_id/:item_id', validateToken, inventoryController.deleteInventoryItem);

module.exports = router;