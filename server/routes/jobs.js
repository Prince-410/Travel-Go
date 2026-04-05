const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { auth, adminAuth } = require('../middleware/auth');

// ─── User Routes ─────────────────────────────────────────────────────────────

// Apply for a job
router.post('/apply', auth, async (req, res) => {
    try {
        const { jobTitle, experience, education, resumeUrl, coverLetter, portfolioUrl } = req.body;
        
        if (!jobTitle || !experience || !education || !resumeUrl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const application = new JobApplication({
            user: req.user._id,
            jobTitle,
            experience,
            education,
            resumeUrl,
            coverLetter,
            portfolioUrl,
            status: 'pending'
        });

        await application.save();

        // Emit socket event for admin real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('NEW_JOB_APPLICATION', {
                jobTitle,
                applicant: req.user.name,
                timestamp: new Date()
            });
        }

        res.status(201).json({ message: 'Application submitted successfully!', application });
    } catch (err) {
        console.error('Job application error:', err);
        res.status(500).json({ message: 'Failed to submit application' });
    }
});

// Get user's applications
router.get('/my-applications', auth, async (req, res) => {
    try {
        const applications = await JobApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Admin Routes ────────────────────────────────────────────────────────────

// Get all applications
router.get('/admin/all', auth, adminAuth, async (req, res) => {
    try {
        const applications = await JobApplication.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update application status
router.put('/admin/update/:id', auth, adminAuth, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const application = await JobApplication.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes },
            { new: true }
        ).populate('user', 'name email');

        if (!application) return res.status(404).json({ message: 'Application not found' });

        res.json({ message: 'Application status updated', application });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an application
router.delete('/admin/:id', auth, adminAuth, async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Job application record deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

module.exports = router;
