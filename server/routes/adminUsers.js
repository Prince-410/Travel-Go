const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/admin/users — list all users with pagination and search
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    
    if (search) {
      const q = new RegExp(search, 'i');
      filter.$or = [{ name: q }, { email: q }, { phone: q }];
    }

    const users = await User.find(filter)
      .select('-password -savedTrips -wishlist -paymentMethods')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users/stats — basic user stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({ totalCount, adminCount, userCount, newThisMonth });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users — create a new user manually
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = new User({
      name,
      email,
      phone,
      password: password || 'Travelgo@123', // Default strong password
      role: role || 'user'
    });
    
    await user.save();
    
    const io = req.app.get('io');
    if (io) io.emit('user:created', user);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id — update a user
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phone, role } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;

    // password update (optional)
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    const io = req.app.get('io');
    if (io) io.emit('user:updated', user);

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id — delete a user
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    // Check if trying to delete the only admin (optional safety check)
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user.' });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) io.emit('user:deleted', { id: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
