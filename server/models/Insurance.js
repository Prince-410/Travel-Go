const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Insurance', insuranceSchema);
