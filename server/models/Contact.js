const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  employees: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  type: { type: String, enum: ['contact', 'inquiry', 'feedback', 'newsletter', 'corporate'], default: 'contact' },
  status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
