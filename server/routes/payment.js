const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { applyConfirmedInventory, releaseConfirmedInventory } = require('../utils/bookingInventory');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ─── CREATE ORDER ────────────────────────────────────────────────────────────
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, type, details } = req.body;

    // Create booking record
    const booking = new Booking({
      userId: req.userId,
      type,
      details,
      amount,
      status: 'pending',
      paymentStatus: 'pending'
    });
    await booking.save();

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: 'INR',
      receipt: booking.invoiceNumber,
      notes: {
        bookingId: booking._id.toString(),
        type,
        userId: req.userId.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      message: 'Order created.',
      orderId: order.id,
      bookingId: booking._id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Could not create payment order.' });
  }
});

// ─── VERIFY PAYMENT ──────────────────────────────────────────────────────────
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';

    try {
      await applyConfirmedInventory(booking, req.app);
    } catch (inventoryError) {
      booking.status = 'pending';
      await booking.save();
      return res.status(409).json({
        message: inventoryError.message || 'Payment captured, but the selected seat is no longer available.'
      });
    }

    await booking.save();

    res.json({
      message: 'Payment verified! Booking confirmed.',
      booking: booking.toJSON()
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
});

// ─── GET BOOKINGS ────────────────────────────────────────────────────────────
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch bookings.' });
  }
});

// ─── GET SINGLE BOOKING ──────────────────────────────────────────────────────
router.get('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch booking.' });
  }
});

// ─── REQUEST REFUND ──────────────────────────────────────────────────────────
router.post('/refund/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, userId: req.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund incomplete payment.' });
    }
    if (booking.refundStatus !== 'none') {
      return res.status(400).json({ message: 'Refund already requested.' });
    }

    // Initiate Razorpay refund
    try {
      const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
        amount: Math.round(booking.amount * 100),
        notes: { bookingId: booking._id.toString() }
      });

      booking.refundStatus = 'processing';
      booking.refundAmount = booking.amount;
      booking.refundId = refund.id;
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      await releaseConfirmedInventory(booking, req.app);
      await booking.save();

      res.json({ message: 'Refund initiated. Amount will be credited within 5-7 business days.', booking });
    } catch (rzpError) {
      // Simulate refund for test mode
      booking.refundStatus = 'processing';
      booking.refundAmount = booking.amount;
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      await releaseConfirmedInventory(booking, req.app);
      await booking.save();
      res.json({ message: 'Refund request submitted.', booking });
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Could not process refund.' });
  }
});

// ─── GENERATE INVOICE ────────────────────────────────────────────────────────
router.get('/invoice/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, userId: req.userId }).populate('userId', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const invoice = {
      invoiceNumber: booking.invoiceNumber,
      date: booking.createdAt,
      customer: {
        name: booking.userId.name,
        email: booking.userId.email,
        phone: booking.userId.phone
      },
      booking: {
        type: booking.type,
        details: booking.details,
        status: booking.status
      },
      payment: {
        amount: booking.amount,
        currency: booking.currency,
        method: booking.paymentMethod,
        status: booking.paymentStatus,
        transactionId: booking.razorpayPaymentId
      },
      refund: {
        amount: booking.refundAmount,
        status: booking.refundStatus
      }
    };

    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Could not generate invoice.' });
  }
});

module.exports = router;
