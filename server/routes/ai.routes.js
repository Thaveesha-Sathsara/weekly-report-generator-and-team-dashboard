const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/ai.controller')
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.post('/ai', protect, managerOnly, handleChat);

module.exports = router;