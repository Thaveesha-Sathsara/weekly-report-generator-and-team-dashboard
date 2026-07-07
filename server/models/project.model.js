const mongoose = required('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);