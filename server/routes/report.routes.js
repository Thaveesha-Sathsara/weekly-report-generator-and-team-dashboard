const express = require('express');
const router = express.Router();
const {
    createReport,
    getMyReports,
    updateReport,
    getAllReports,
    unlockReport,
    getReportById,
    deleteReport
} = require('../controllers/report.controller');
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.get('/me', protect, getMyReports);
router.post('/', protect, createReport);
router.get('/:id', protect, getReportById);
router.put('/:id/', protect, updateReport);
router.get('/', protect, managerOnly, getAllReports);
router.put('/:id/unlock', protect, managerOnly, unlockReport);
router.delete('/:id', protect, managerOnly, deleteReport);

module.exports = router;