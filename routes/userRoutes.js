const express = require('express');
const { analyzeAndStore, getUser, getAllUsers  } = require('../controllers/userController');
const router = express.Router();

router.post('/:username', analyzeAndStore);   // POST /api/users/username
router.get('/:username', getUser);            // GET  /api/users/username
router.get('/', getAllUsers);                 // GET  /api/users

module.exports = router;