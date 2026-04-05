const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const GiftCard = require('../models/GiftCard');
const Insurance = require('../models/Insurance');
const Booking = require('../models/Booking');

// GET /api/admin/stats/dashboard
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const giftCardRevenue = await GiftCard.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const insuranceRevenue = await Insurance.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // Top Referrers sorted correctly by referral count using aggregation
    const topReferrers = await User.aggregate([
      { $match: { 'referralHistory.0': { $exists: true } } },
      { $addFields: { historyCount: { $size: '$referralHistory' } } },
      { $sort: { historyCount: -1 } },
      { $limit: 10 },
      { $project: { name: 1, email: 1, referralCode: 1, referralHistory: 1 } }
    ]);

    res.json({
      users: totalUsers,
      bookings: totalBookings,
      revenue: totalRevenue[0]?.total || 0,
      giftCardRevenue: giftCardRevenue[0]?.total || 0,
      insuranceRevenue: insuranceRevenue[0]?.total || 0,
      topReferrers
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Stats calculation failed.' });
  }
});

// GET /api/admin/stats/gift-cards
router.get('/gift-cards', auth, adminAuth, async (req, res) => {
    try {
        const giftCards = await GiftCard.find().sort({ createdAt: -1 }).limit(50);
        res.json(giftCards);
    } catch (err) {
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;
