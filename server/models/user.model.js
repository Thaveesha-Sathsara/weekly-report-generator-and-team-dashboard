const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['Team Member', 'Manager'],
        default: 'Team Member',
        required: true,
    },
    accountStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Active'],
        default: 'Pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);