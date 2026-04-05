const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully! Welcome to TravelGo.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful! Welcome back.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile.' });
  }
});

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json({ message: 'Profile updated.', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not update profile.' });
  }
});

// ─── SAVE TRIP ───────────────────────────────────────────────────────────────
router.post('/saved-trips', auth, async (req, res) => {
  try {
    const { type, details } = req.body;
    req.user.savedTrips.push({ type, details });
    await req.user.save();
    res.json({ message: 'Trip saved!', user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not save trip.' });
  }
});

// ─── DELETE SAVED TRIP ───────────────────────────────────────────────────────
router.delete('/saved-trips/:id', auth, async (req, res) => {
  try {
    req.user.savedTrips = req.user.savedTrips.filter(t => t._id.toString() !== req.params.id);
    await req.user.save();
    res.json({ message: 'Trip removed.', user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not remove trip.' });
  }
});

// ─── WISHLIST ────────────────────────────────────────────────────────────────
router.post('/wishlist', auth, async (req, res) => {
  try {
    const { type, itemId, details } = req.body;
    const exists = req.user.wishlist.find(w => w.itemId === itemId);
    if (exists) {
      req.user.wishlist = req.user.wishlist.filter(w => w.itemId !== itemId);
      await req.user.save();
      return res.json({ message: 'Removed from wishlist.', user: req.user.toJSON() });
    }
    req.user.wishlist.push({ type, itemId, details });
    await req.user.save();
    res.json({ message: 'Added to wishlist!', user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not update wishlist.' });
  }
});

// ─── PAYMENT METHODS ─────────────────────────────────────────────────────────
router.post('/payment-methods', auth, async (req, res) => {
  try {
    const { type, label, last4, isDefault } = req.body;
    if (isDefault) {
      req.user.paymentMethods.forEach(pm => pm.isDefault = false);
    }
    req.user.paymentMethods.push({ type, label, last4, isDefault });
    await req.user.save();
    res.json({ message: 'Payment method added.', user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not add payment method.' });
  }
});

router.delete('/payment-methods/:id', auth, async (req, res) => {
  try {
    req.user.paymentMethods = req.user.paymentMethods.filter(pm => pm._id.toString() !== req.params.id);
    await req.user.save();
    res.json({ message: 'Payment method removed.', user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Could not remove payment method.' });
  }
});

// ─── REFERRAL INVITE ─────────────────────────────────────────────────────────
router.post('/referral/invite', auth, async (req, res) => {
  try {
    const { friendEmail } = req.body;
    if (!friendEmail) return res.status(400).json({ message: 'Friend email is required.' });

    // Track in user history
    const alreadyInvited = req.user.referralHistory.find(h => h.email === friendEmail);
    if (!alreadyInvited) {
      req.user.referralHistory.push({ email: friendEmail, status: 'invited' });
      await req.user.save();
    }

    // Emit for Admin Panel real-time tracking
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_REFERRAL_INVITE', {
        sender: req.user.name,
        senderEmail: req.user.email,
        receiverEmail: friendEmail,
        timestamp: new Date()
      });
    }

    res.json({ message: `Invite sent to ${friendEmail}! We'll track their signup.`, history: req.user.referralHistory });
  } catch (error) {
    res.status(500).json({ message: 'Could not send invite.' });
  }
});

// ─── CHECK EMAIL (Publicly for Gift Cards, etc.) ──────────────────────
router.get('/check/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      return res.json({ exists: true, name: user.name });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email.' });
  }
});

module.exports = router;
