const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/admin/properties (Protected Admin Route)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.propertyType = type;
    if (search) {
      query.$or = [
        { propertyName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query).sort({ submittedAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties.' });
  }
});

// PATCH /api/admin/properties/:id/status
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found.' });

    res.json({ message: `Property marked as ${status}.`, property });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status.' });
  }
});

// DELETE /api/admin/properties/:id
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json({ message: 'Property request deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property.' });
  }
});

module.exports = router;
