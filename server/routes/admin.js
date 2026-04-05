const express = require('express');
const router = express.Router();
const AdminConfig = require('../models/AdminConfig');
const { auth, adminAuth } = require('../middleware/auth');

// GET  /api/admin/config – return full config
router.get('/config', async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT  /api/admin/services/:service – toggle / update a single service
router.put('/services/:service', auth, adminAuth, async (req, res) => {
  try {
    const { service } = req.params;
    const validServices = ['flights', 'buses', 'trains', 'cabs', 'hotels', 'holidays'];
    if (!validServices.includes(service)) {
      return res.status(400).json({ message: `Invalid service: ${service}` });
    }
    const config = await AdminConfig.getConfig();
    const updates = req.body; // { enabled, cities, surgePricing, discount, … }
    Object.assign(config.services[service], updates);
    await config.save();

    // Emit real-time update (socket attached in index.js)
    const io = req.app.get('io');
    if (io) io.emit('config:update', config);

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT  /api/admin/features – update feature toggles
router.put('/features', auth, adminAuth, async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    Object.assign(config.features, req.body);
    await config.save();

    const io = req.app.get('io');
    if (io) io.emit('config:update', config);

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/injected-features – add new injected feature
router.post('/injected-features', auth, adminAuth, async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    const feature = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      ...req.body,
    };
    config.injectedFeatures.push(feature);
    await config.save();

    const io = req.app.get('io');
    if (io) io.emit('config:update', config);

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/injected-features/:id – remove injected feature
router.delete('/injected-features/:id', auth, adminAuth, async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    config.injectedFeatures = config.injectedFeatures.filter(f => f.id !== req.params.id);
    await config.save();

    const io = req.app.get('io');
    if (io) io.emit('config:update', config);

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/injected-features/:id/toggle – toggle active state
router.put('/injected-features/:id/toggle', auth, adminAuth, async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    const feat = config.injectedFeatures.find(f => f.id === req.params.id);
    if (!feat) return res.status(404).json({ message: 'Feature not found' });
    feat.active = !feat.active;
    await config.save();

    const io = req.app.get('io');
    if (io) io.emit('config:update', config);

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
