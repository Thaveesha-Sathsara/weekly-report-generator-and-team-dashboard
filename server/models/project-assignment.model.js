const mognoose = require('mongoose');

const projectAssignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Type.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mognoose.Schema.Type.ObjectId,
        ref: 'Project',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.module('PorjectAssignment', projectAssignmentSchema);