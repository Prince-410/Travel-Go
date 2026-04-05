const express = require('express');
const router = express.Router();
const BookingCard = require('../models/BookingCard');
const { auth, adminAuth } = require('../middleware/auth');
const { releaseLockedSeatsByIds } = require('../utils/bookingInventory');

// Generic route to fetch all cards/inventory based on search filters
router.get('/', async (req, res) => {
  try {
    const { type, source, destination, status, limit=100 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (source) filter.source = new RegExp(source, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (status) filter.status = status;

    const cards = await BookingCard.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ cards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new booking card (dynamic logic) 
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const cardData = { ...req.body };
    // Optionally default available seats if empty
    if (!cardData.availableSeats && cardData.totalSeats) {
        cardData.availableSeats = cardData.totalSeats;
    }

    const newCard = new BookingCard(cardData);
    await newCard.save();

    console.log(`[Admin] Created new ${newCard.type} listing: ${newCard.title}`);
    
    // Broadcast instantly to all frontends
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_BOOKING_CARD', newCard);
    }

    res.status(201).json({ message: 'Card created', card: newCard });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update specific fields (Pricing/Seat updates broadcast independently)
router.patch('/:id', auth, adminAuth, async (req, res) => {
  try {
    const card = await BookingCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!card) return res.status(404).json({ message: 'Card not found' });

    console.log(`[Admin] Updated ${card.type} listing: ${card.title}`);

    // If only pricing specifically updated, log & emit specialized EVENT
    const io = req.app.get('io');
    if (io) {
        if (req.body.price !== undefined || req.body.surgeMultiplier !== undefined) {
             io.emit('PRICE_UPDATE', card);
        } else {
             io.emit('UPDATE_BOOKING_CARD', card);
        }
    }

    res.json({ message: 'Card updated', card });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update particular seat (e.g. lock it when a user is booking)
router.post('/:id/lock-seat', async (req, res) => {
    try {
        const { seatId } = req.body;
        if (!seatId) {
            return res.status(400).json({ message: 'seatId is required' });
        }

        const card = await BookingCard.findById(req.params.id);
        
        if (!card) return res.status(404).json({ message: 'Card not found' });
        if (card.status === 'inactive' || card.status === 'sold_out' || Number(card.availableSeats || 0) <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }
        if ((card.occupiedSeats || []).includes(seatId)) {
            return res.status(400).json({ message: 'Seat already occupied' });
        }
        
        if (card.lockedSeats.includes(seatId)) {
            return res.status(400).json({ message: 'Seat already locked' });
        }
        
        card.lockedSeats.push(seatId);
        await card.save();

        const io = req.app.get('io');
        if (io) io.emit('SEAT_UPDATE', { cardId: card._id, seatId, locked: true });

        res.json({ message: 'Seat locked', card });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/unlock-seat', async (req, res) => {
  try {
    const seatIds = Array.isArray(req.body.seatIds)
      ? req.body.seatIds
      : [req.body.seatId].filter(Boolean);

    if (seatIds.length === 0) {
      return res.status(400).json({ message: 'seatId or seatIds is required' });
    }

    const card = await releaseLockedSeatsByIds(req.params.id, seatIds, req.app);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Seat lock released', card });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking card completely
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const card = await BookingCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    console.log(`[Admin] Deleted ${card.type} listing: ${card.title}`);

    const io = req.app.get('io');
    if (io) {
      io.emit('DELETE_BOOKING_CARD', { id: card._id, type: card.type });
    }

    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
