const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    weekStartDate: {
        type: Date,
        required: true,
    },
    weekEndDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'late'],
        default: 'pending',
    },
    tasksCompleted: {
        type: String,
        reuqired: true,
    },
    tasksPlanned: {
        type: String,
        required: true,
    },
    blockers: {
        type: String,
    },
    hoursWorked: {
        type: Number,
    },
    notes: {
        type: String,
    },
    submittedAt: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);