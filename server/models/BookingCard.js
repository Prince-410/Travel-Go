const mongoose = require('mongoose');

const bookingCardSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['flight', 'bus', 'train', 'cab', 'hotel', 'holiday'], 
    required: true 
  },
  title: { type: String, required: true }, // e.g. "Indigo Flight Ahmedabad → Goa"
  source: { type: String },
  destination: { type: String },
  date: { type: String }, // Can be ISO date or string
  startTime: { type: String }, // Departure/Start time
  arrivalTime: { type: String }, // Arrival time
  price: { type: Number, required: true },
  
  // Seat management
  availableSeats: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 0 },
  seatMap: { type: mongoose.Schema.Types.Mixed, default: [] }, // Advanced layout
  lockedSeats: { type: [String], default: [] }, // Seats temporarily locked during booking process
  occupiedSeats: { type: [String], default: [] }, // Seats that are fully booked/paid

  features: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { wifi: true, meal: true, ac: true }
  
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'sold_out'], 
    default: 'active' 
  },
  
  // Dynamic pricing
  dynamicPricing: { type: Boolean, default: false },
  surgeMultiplier: { type: Number, default: 1.0 },

  // Admin trailing
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Media
  image: { type: String } // URL to image/logo

}, { timestamps: true });

module.exports = mongoose.model('BookingCard', bookingCardSchema);
