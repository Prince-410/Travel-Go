const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact — publicly expose endpoint to store inquiries/feedback form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, employees, subject, message, type } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    const newContact = new Contact({ 
        name, 
        email, 
        phone,
        company,
        employees,
        subject: subject || 'No Subject', 
        message, 
        type: type || 'contact' 
    });
    await newContact.save();

    // Emit socket event for admin real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_FEEDBACK', {
        name,
        email,
        phone,
        company,
        type: type || 'contact',
        timestamp: new Date()
      });
    }

    res.status(201).json({ message: 'Message securely recorded in our system. Thank you!' });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ message: err.message || 'Failed to process inquiry. Please check the backend.' });
  }
});

module.exports = router;
