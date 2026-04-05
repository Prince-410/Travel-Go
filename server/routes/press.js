const express = require('express');
const router = express.Router();
const PressRelease = require('../models/PressRelease');
const { auth, adminAuth } = require('../middleware/auth');

// ─── Public Routes ───────────────

// Get all press releases
router.get('/', async (req, res) => {
    try {
        const releases = await PressRelease.find().sort({ createdAt: -1 });
        res.json(releases);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single press release
router.get('/:id', async (req, res) => {
    try {
        const release = await PressRelease.findById(req.params.id);
        if (!release) return res.status(404).json({ message: 'Not found' });
        res.json(release);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Admin Routes ───────────────

// Create a press release
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const release = new PressRelease(req.body);
        await release.save();
        res.status(201).json(release);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a press release
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const release = await PressRelease.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!release) return res.status(404).json({ message: 'Not found' });
        res.json(release);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a press release
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const release = await PressRelease.findByIdAndDelete(req.params.id);
        if (!release) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
