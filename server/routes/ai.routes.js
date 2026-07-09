const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/ai.controller')
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.post('/chat', protect, managerOnly, handleChat);

module.exports = router;