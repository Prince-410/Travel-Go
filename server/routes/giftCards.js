const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const GiftCard = require('../models/GiftCard');

// POST /api/gift-cards/purchase
router.post('/purchase', auth, async (req, res) => {
  try {
    const { recipientEmail, amount, message } = req.body;

    if (!recipientEmail || !amount) {
      return res.status(400).json({ message: 'Recipient email and amount are required.' });
    }

    // 1. Find recipient
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found. They must be registered first.' });
    }

    // 2. Create the GiftCard record (History)
    const transactionId = 'TG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const giftCard = new GiftCard({
      senderId: req.userId,
      senderName: req.user.name,
      receiverEmail: recipientEmail,
      receiverId: recipient._id,
      amount: Number(amount),
      message: message || 'Enjoy your travel!',
      transactionId,
      status: 'delivered'
    });
    await giftCard.save();

    // 3. CREDIT THE RECIPIENT WALLET & SYSTEM NOTIFICATION
    recipient.walletBalance += Number(amount);
    recipient.gifts.push({
      senderName: req.user.name,
      senderEmail: req.user.email,
      amount: Number(amount),
      message: message || 'Enjoy your travel!'
    });
    await recipient.save();

    // 4. MOCK SUCCESSFUL EMAIL DELIVERY & Real-time Admin Alert
    console.log(`[OFFICIAL MAIL SENT] To: ${recipientEmail} | Content: Hey ${recipient.name}, ${req.user.name} sent you a ₹${amount} gift card!`);
    
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_GIFTCARD', {
        sender: req.user.name,
        receiver: recipient.name,
        amount: Number(amount),
        timestamp: new Date()
      });
    }

    res.status(200).json({ 
      message: `Success! Gift card of ₹${amount} sent to ${recipient.name}. They will receive an official confirmation mail shortly.`,
      transactionId,
      newWalletBalance: recipient.walletBalance // Optional info for trace
    });

  } catch (error) {
    console.error('GiftCard purchase error:', error);
    res.status(500).json({ message: 'Transaction failed. Please try again.' });
  }
});

// GET /api/gift-cards/history (sender history)
router.get('/history', auth, async (req, res) => {
    try {
        const history = await GiftCard.find({ senderId: req.userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch gifting history.' });
    }
});

module.exports = router;
