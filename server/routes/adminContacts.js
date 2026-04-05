const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/admin/contacts - list all contact requests securely
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/contacts/:id/status - Update message lifecycle stage
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/contacts/:id
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact successfully deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
