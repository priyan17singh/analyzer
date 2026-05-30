const express = require('express');
const { analyzeAndStore, getUser } = require('../controllers/userController');
const router = express.Router();

router.post('/:username', analyzeAndStore);   // POST /api/users/octocat
router.get('/:username', getUser);            // GET  /api/users/octocat

module.exports = router;