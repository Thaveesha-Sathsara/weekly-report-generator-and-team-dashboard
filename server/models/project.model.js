const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Archived'],
        default: 'Active',
    },
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);