const mongoose = require('mongoose');

const pressReleaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  },
  category: {
    type: String,
    required: true,
    enum: ['Company News', 'Product Launch', 'Partnership', 'Awards', 'Events'],
    default: 'Company News'
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('PressRelease', pressReleaseSchema);
