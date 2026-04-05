const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional until verified or linked
  amount: { type: Number, required: true },
  message: { type: String, default: 'Enjoy your travel!' },
  status: { type: String, enum: ['pending', 'delivered', 'redeemed', 'expired'], default: 'delivered' },
  transactionId: { type: String, unique: true },
  deliveryEmailSent: { type: Boolean, default: true } // Mock as successfully sent
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);
