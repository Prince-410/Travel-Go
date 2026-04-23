const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: String, unique: true, index: true },
  userName: { type: String },

  type: {
    type: String,
    enum: ['flight', 'bus', 'train', 'hotel', 'cab', 'holiday'],
    required: true
  },

  // Flexible details object per booking type
  details: {
    cardId: String,
    flightId: String,
    busId: String,
    trainId: String,
    hotelId: String,
    cabId: String,
    holidayId: String,

    // Common
    source: String,
    destination: String,
    date: String,
    passengers: Number,
    category: String,
    selectedSeat: String,
    seatNumbers: [String],

    // Flight-specific
    airline: String,
    flightNumber: String,
    classType: String,
    seatNumbers: [String],

    // Bus-specific
    operator: String,
    busType: String,
    boardingPoint: String,
    droppingPoint: String,

    // Train-specific
    trainName: String,
    trainNumber: String,
    pnr: String,
    coach: String,

    // Hotel-specific
    hotelName: String,
    roomType: String,
    checkIn: String,
    checkOut: String,
    guests: Number,

    // Cab-specific
    vehicleType: String,
    cabType: String,
    driverName: String,
    distance: String,

    // Holiday-specific
    packageName: String,
    duration: String,
    inclusions: [String],

    departureTime: String,
    arrivalTime: String,
    duration: String
  },

  // Payment
  amount: { type: Number, required: true },
  pricePerSeat: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  extraCharges: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'] },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },

  // Status
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed', 'pending'], default: 'pending' },
  inventoryApplied: { type: Boolean, default: false },

  // Invoice
  invoiceNumber: String,
  source: { type: String, default: '' },
  destination: { type: String, default: '' },
  journeyDate: { type: String, default: '' },
  bookingDate: { type: String, default: '' },
  bookingTime: { type: String, default: '' },
  seats: { type: [String], default: [] },

  // Refund
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, enum: ['none', 'requested', 'processing', 'completed'], default: 'none' },
  refundId: String
}, { timestamps: true });

// Auto-generate invoice number
bookingSchema.pre('save', function () {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'TG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
