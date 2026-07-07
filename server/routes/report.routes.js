const express = require('express');
const router = express.Router();
const {
    createReport,
    getMyReports,
    updateReport,
    getAllReports
} = require('../controllers/report.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/me', protect, getMyReports);
router.post('/', protect, createReport);
router.put('/:id', protect, updateReport);
router.get('/', protect, adminOnly, getAllReports);

module.exports = router;