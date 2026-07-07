const express = require("express");
const router = express.Router();
const { 
    applyForAccess,
    approveUser,
    setupPassword,
    login
} = require('../controllers/auth.controller');
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.post('/apply', applyForAccess);
router.post('/setup-password', setupPassword);
router.post('/login', login);

router.put('/approve/:userId', protect, managerOnly, approveUser);

module.exports = router;