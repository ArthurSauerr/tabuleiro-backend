const express = require('express');
const router = express.Router();
const skillsController = require('../controller/skillsController');
const { validateToken } = require('../security/auth');

router.post('/create', validateToken, skillsController.newSkill);
router.put('/update', validateToken, skillsController.updateSkill);
router.delete('/delete/:char_id/:skill_id', validateToken, skillsController.deleteSkill);

module.exports = router;