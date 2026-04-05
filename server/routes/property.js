const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// POST /api/properties (Public submission)
router.post('/', async (req, res) => {
  try {
    const { propertyType, propertyName, ownerName, email, phone, address, city, rooms, description } = req.body;
 
    if (!propertyType || !propertyName || !ownerName || !email || !phone) {
      return res.status(400).json({ message: 'All mandatory fields must be filled.' });
    }
 
    const newProperty = new Property({
      propertyType,
      propertyName,
      ownerName,
      email,
      phone,
      address,
      city,
      rooms,
      description
    });


    await newProperty.save();
    
    // Emit socket event for admin real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_PROPERTY_APPLICATION', {
        type: propertyType,
        name: propertyName,
        owner: ownerName,
        timestamp: new Date()
      });
    }

    res.status(201).json({ 
      message: 'Property registration submitted successfully! Our partnership team will review and contact you shortly.',
      propertyId: newProperty._id
    });
    
  } catch (error) {
    console.error('Property registration error:', error);
    res.status(500).json({ message: 'Failed to submit registration. Please try again later.' });
  }
});

module.exports = router;
