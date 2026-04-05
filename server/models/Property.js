const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: { type: String, enum: ['hotel', 'resort', 'villa', 'hostel'], required: true },
  propertyName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  rooms: { type: Number },
  description: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });


module.exports = mongoose.model('Property', propertySchema);
