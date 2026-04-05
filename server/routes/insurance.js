const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Insurance = require('../models/Insurance');
const User = require('../models/User');

// POST /api/insurance/purchase
router.post('/purchase', auth, async (req, res) => {
  try {
    const { planId, planName, price } = req.body;

    if (!planId || !planName || !price) {
      return res.status(400).json({ message: 'Plan details and price are required.' });
    }

    // 1. Create Insurance Record
    const insurance = new Insurance({
       userId: req.userId,
       userName: req.user.name,
       planId,
       planName,
       price: Number(price)
    });
    await insurance.save();

    // 2. Add to User's activeInsurance array (Embedded)
    req.user.activeInsurance.push({
       planId,
       planName,
       price: Number(price),
       status: 'active'
    });
    await req.user.save();

    // 3. Emit Socket event for Admin Panel real-time tracking
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_INSURANCE_PURCHASE', {
        user: req.user.name,
        plan: planName,
        price: Number(price),
        timestamp: new Date()
      });
    }

    res.status(201).json({ message: `Successfully insured under the ${planName} plan!`, insurance });
  } catch (error) {
    console.error('Insurance purchase error:', error);
    res.status(500).json({ message: error.message || 'Purchase failed. Please try again.' });
  }
});

// GET /api/insurance/admin/all
const { adminAuth } = require('../middleware/auth');
router.get('/admin/all', auth, adminAuth, async (req, res) => {
    try {
        const insurances = await Insurance.find().sort({ createdAt: -1 }).limit(100);
        res.json(insurances);
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch insurance records.' });
    }
});

module.exports = router;
