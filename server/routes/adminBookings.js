const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const { applyConfirmedInventory, releaseConfirmedInventory } = require('../utils/bookingInventory');

// GET /api/admin/bookings — list all bookings with user info
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    // If search query, filter in-memory by user name/email or invoice
    let results = bookings;
    if (search) {
      const q = search.toLowerCase();
      results = bookings.filter(b =>
        b.userId?.name?.toLowerCase().includes(q) ||
        b.userId?.email?.toLowerCase().includes(q) ||
        b.invoiceNumber?.toLowerCase().includes(q) ||
        b.details?.source?.toLowerCase().includes(q) ||
        b.details?.destination?.toLowerCase().includes(q)
      );
    }

    res.json({ bookings: results, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bookings/stats — booking statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });
    const completed = await Booking.countDocuments({ status: 'completed' });

    // Revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // By type
    const byType = await Booking.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, revenue: { $sum: '$amount' } } }
    ]);

    res.json({ total, confirmed, pending, cancelled, completed, totalRevenue, byType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/bookings — create booking manually
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { userId, type, details, amount, status, paymentStatus } = req.body;

    // If no userId provided, use a placeholder or find by email
    let resolvedUserId = userId;
    if (!resolvedUserId && req.body.userEmail) {
      const user = await User.findOne({ email: req.body.userEmail });
      if (user) resolvedUserId = user._id;
      else return res.status(400).json({ message: 'User not found with that email.' });
    }
    if (!resolvedUserId) return res.status(400).json({ message: 'userId or userEmail is required.' });

    const booking = new Booking({
      userId: resolvedUserId,
      type: type || 'flight',
      details: details || {},
      amount: amount || 0,
      status: status || 'confirmed',
      paymentStatus: paymentStatus || 'completed',
    });

    if (booking.paymentStatus === 'completed' || booking.status === 'confirmed') {
      await applyConfirmedInventory(booking, req.app);
    }

    await booking.save();

    const populated = await Booking.findById(booking._id).populate('userId', 'name email phone');

    const io = req.app.get('io');
    if (io) io.emit('booking:created', populated);

    res.status(201).json({ message: 'Booking created.', booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/bookings/:id — update booking
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const allowed = ['status', 'paymentStatus', 'amount', 'type', 'details', 'refundStatus', 'refundAmount'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    if ((booking.status === 'cancelled' || booking.paymentStatus === 'refunded') && booking.inventoryApplied) {
      await releaseConfirmedInventory(booking, req.app);
    } else if ((booking.status === 'confirmed' || booking.paymentStatus === 'completed') && !booking.inventoryApplied) {
      await applyConfirmedInventory(booking, req.app);
    }

    await booking.save();

    const populated = await Booking.findById(booking._id).populate('userId', 'name email phone');

    const io = req.app.get('io');
    if (io) io.emit('booking:updated', populated);

    res.json({ message: 'Booking updated.', booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/bookings/:id — delete booking
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (booking.inventoryApplied) {
      await releaseConfirmedInventory(booking, req.app);
    }

    await booking.deleteOne();

    const io = req.app.get('io');
    if (io) io.emit('booking:deleted', { id: req.params.id });

    res.json({ message: 'Booking deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/bookings/:id/status — quick status change
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'cancelled' ? { refundStatus: 'requested' } : {}) },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (status === 'cancelled' && booking.inventoryApplied) {
      await releaseConfirmedInventory(booking, req.app);
      await booking.save();
    }

    const io = req.app.get('io');
    if (io) io.emit('booking:updated', booking);

    res.json({ message: `Booking ${status}.`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
