const Report = require('../models/report.model');

// create a weekly report
exports.createReport = async (req, res) => {
    try {
        const report = new Report({
            ...req.body,
            userId: req.user.id,
            status: req.body.status || 'submitted',
            submittedAt: req.body.status === 'submitted' ? Date.now() : null
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Error creating report', error: error.message });
    }
};

// get logged in users reports
exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id })
            .populate('projectId', 'name')
            .sort({ weekStartDate: -1 }); //newest first
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// update a report
exports.updateReport = async (req, res) => {
    try {
        let report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        // team members cannot edit a submitted report
        if (report.status === 'submitted' && req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Cannot edit a submitted report' });
        }

        // Only allow the owner of the report to update it
        if (report.userId.toString() !== req.user.id && req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Not authorized to update this report' });
        }

        const updatedData = { ...req.body };
        if (req.body.status === 'submitted' && report.status !== 'submitted') {
            updatedData.submittedAt = Date.now();
        }

        report = await Report.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Error updating report', error: error.message });
    }
};

// get all reports
exports.getAllReports = async (req, res) => {
    try {
        const { userId, projectId, status, startDate, endDate } = req.query;

        // dynamic filter
        let filter = {};
        if (userId) filter.userId = userId;
        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;

        if (startDate && endDate) {
            filter.weekStartDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const reports = await Report.find(filter)
            .populate('userId', 'fullName email')
            .populate('projectId', 'name')
            .sort({ weekStartDate: -1 });
        
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// manager unlocks a report for editing
exports.unlockReport = async (req, res) => {
    try {
        let report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.status = 'draft';
        report.submittedAt = null; // clear the submission stamp
        await report.save();

        res.status(200).json({ message: 'Report unlocked for editing', report });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('projectId', 'name')

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // only the owner or a manager can view the report
        if (report.userId.toString() !== req.user.id && req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Not authorized to view this report' });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};