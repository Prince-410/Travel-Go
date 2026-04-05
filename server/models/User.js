const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // User features
  savedTrips: [{
    type: { type: String, enum: ['flight', 'bus', 'train', 'hotel', 'cab', 'holiday'] },
    details: mongoose.Schema.Types.Mixed,
    savedAt: { type: Date, default: Date.now }
  }],

  wishlist: [{
    type: { type: String, enum: ['flight', 'bus', 'train', 'hotel', 'cab', 'holiday'] },
    itemId: String,
    details: mongoose.Schema.Types.Mixed,
    addedAt: { type: Date, default: Date.now }
  }],

  paymentMethods: [{
    type: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'] },
    label: String, // e.g. "HDFC Visa ending 4242"
    last4: String,
    isDefault: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],

  preferences: {
    seatPreference: { type: String, default: 'window' },
    mealPreference: { type: String, default: 'veg' },
    classPreference: { type: String, default: 'Economy' },
    notifications: { type: Boolean, default: true }
  },

  // Added: Wallet & Gift Cards Management
  walletBalance: { type: Number, default: 0 },
  gifts: [{
    senderName: String,
    senderEmail: String,
    amount: Number,
    message: String,
    receivedAt: { type: Date, default: Date.now }
  }],

  // Added: Referral System
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralHistory: [{
    name: String,
    email: String,
    status: { type: String, enum: ['invited', 'joined', 'completed'], default: 'invited' },
    date: { type: Date, default: Date.now }
  }],

  // Added: Insurance
  activeInsurance: [{
    planId: String,
    planName: String,
    price: Number,
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
  }]
}, { timestamps: true });

// Pre-save for hashing and referral code
userSchema.pre('save', async function (next) {
  // Hash password
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate unique referral code if missing
  if (!this.referralCode) {
    this.referralCode = 'TG' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
