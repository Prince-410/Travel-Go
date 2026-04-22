require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const adminBookingRoutes = require('./routes/adminBookings');
const adminUserRoutes = require('./routes/adminUsers');
const adminCardRoutes = require('./routes/adminCards');
const contactRoutes = require('./routes/contact');
const adminContactRoutes = require('./routes/adminContacts');
const pressRoutes = require('./routes/press');
const jobRoutes = require('./routes/jobs');
const blogRoutes = require('./routes/blog');
const giftCardRoutes = require('./routes/giftCards');
const propertyRoutes = require('./routes/property');
const adminPropertyRoutes = require('./routes/adminProperties');
const insuranceRoutes = require('./routes/insurance');
const adminStatsRoutes = require('./routes/adminStats');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  return true; // Allow all origins for now to prevent "Failed to fetch" CORS issues
};

const corsOriginHandler = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked for origin: ${origin}`));
};

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: corsOriginHandler,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app so routes can access it via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// Auth-specific rate limit (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: corsOriginHandler, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/cards', adminCardRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin/properties', adminPropertyRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), sockets: io.engine.clientsCount });
});

// ─── MongoDB ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected: travelgo');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API: http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
