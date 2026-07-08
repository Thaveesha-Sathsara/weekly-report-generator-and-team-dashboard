const express = require("express");
const router = express.Router();
const { 
    registerRequest,
    approveUser,
    setupPassword,
    login,
    getPendingUsers
} = require('../controllers/auth.controller');
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.post('/register', registerRequest);
router.post('/setup-password', setupPassword);
router.post('/login', login);

router.get('/pending-users', protect, managerOnly, getPendingUsers);
router.put('/approve/:userId', protect, managerOnly, approveUser);

module.exports = router;