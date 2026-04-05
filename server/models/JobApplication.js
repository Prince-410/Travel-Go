const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    portfolioUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
