const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const BookingCard = require('../models/BookingCard');
const { auth } = require('../middleware/auth');
const { applyConfirmedInventory, getRequestedUnits, getSeatNumbers } = require('../utils/bookingInventory');
const { buildReceiptSnapshot, formatDate, formatTime } = require('../utils/receipt');

router.get('/search', async (req, res) => {
  try {
    const { source, destination, date, type } = req.query;
    if (!source || !destination || !date || !type) {
      return res.status(400).json({ message: 'source, destination, date and type are required.' });
    }

    const cards = await BookingCard.find({
      source,
      destination,
      date,
      type,
      status: 'active',
      availableSeats: { $gt: 0 }
    }).sort({ price: 1, createdAt: -1 });

    if (cards.length === 0) {
      return res.status(404).json({
        message: 'No bookings available for selected date',
        cards: []
      });
    }

    return res.json({ cards });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to search availability.' });
  }
});

/**
 * @route   POST /api/booking
 * @desc    Create a confirmed booking instantly (Real-time flow)
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { type, details, amount } = req.body;

    if (!type || !details || !amount) {
      return res.status(400).json({ message: 'Missing booking details or amount.' });
    }

    // 1. Check Availability & Inventory
    const cardId = details.cardId || details.flightId || details.busId || details.trainId;
    if (!cardId) {
      return res.status(400).json({ message: 'Missing associated service ID.' });
    }

    const card = await BookingCard.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ message: 'This service is no longer available for booking.' });
    }

    // 2. Create Booking Record (Status: Confirmed, Payment: Completed for instant flow)
    const now = new Date();
    const requestedUnits = getRequestedUnits(details);
    const seatIds = getSeatNumbers(details);
    const totalAmount = Number(amount || 0);
    const tax = Number(details.tax ?? Math.round(totalAmount * 0.05));
    const extraCharges = Number(details.extraCharges ?? 0);
    const finalAmount = totalAmount + tax + extraCharges;
    const pricePerSeat = requestedUnits > 0 ? Math.round(totalAmount / requestedUnits) : totalAmount;

    const booking = new Booking({
      userId: req.userId,
      userName: req.user?.name || '',
      type,
      details,
      amount,
      totalAmount,
      tax,
      extraCharges,
      finalAmount,
      pricePerSeat,
      source: details.source || card.source || '',
      destination: details.destination || card.destination || '',
      journeyDate: details.journeyDate || details.date || card.date || '',
      bookingDate: formatDate(now),
      bookingTime: formatTime(now),
      seats: seatIds,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    // 3. Update Seats & Apply Inventory (Real-time check)
    try {
      await applyConfirmedInventory(booking, req.app);
    } catch (inventoryError) {
      return res.status(409).json({ message: inventoryError.message });
    }

    // 4. Save Booking
    await booking.save();

    // 5. Populate and Emit Real-time update (Done within applyConfirmedInventory via socket)
    const populatedBooking = await Booking.findById(booking._id).populate('userId', 'name email phone');

    // 6. Broadcast to specific users or admins if needed
    const io = req.app.get('io');
    if (io) {
      io.emit('BOOKING_CREATED', populatedBooking);
      io.emit('AVAILABILITY_CHANGED', {
        cardId: card._id,
        type: card.type,
        source: card.source,
        destination: card.destination,
        date: card.date,
        availableSeats: card.availableSeats,
        status: card.status
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully.',
      booking: populatedBooking,
      receipt: buildReceiptSnapshot(populatedBooking, populatedBooking.userId)
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Internal server error during booking.' });
  }
});

/**
 * @route   GET /api/booking/availability
 * @desc    Check live availability for a service
 */
router.get('/availability/:cardId', async (req, res) => {
    try {
        const card = await BookingCard.findById(req.params.cardId);
        if (!card) return res.status(404).json({ message: 'Not found' });
        
        res.json({
            availableSeats: card.availableSeats,
            occupiedSeats: card.occupiedSeats,
            lockedSeats: card.lockedSeats,
            status: card.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
