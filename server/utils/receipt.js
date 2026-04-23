const { getSeatNumbers, getRequestedUnits } = require('./bookingInventory');

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(value);

const formatTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(value);

const resolveJourneyDate = (details = {}) =>
  details.journeyDate || details.date || details.checkIn || '';

const buildReceiptSnapshot = (booking, user = null) => {
  const createdAt = booking.createdAt ? new Date(booking.createdAt) : new Date();
  const details = booking.details || {};
  const seats = getSeatNumbers(details);
  const units = Math.max(1, getRequestedUnits(details));
  const totalAmount = Number(booking.totalAmount ?? booking.amount ?? 0);
  const tax = Number(booking.tax ?? Math.round(totalAmount * 0.05));
  const extraCharges = Number(booking.extraCharges ?? 0);
  const finalAmount = Number(booking.finalAmount ?? totalAmount + tax + extraCharges);
  const pricePerSeat = Number(booking.pricePerSeat ?? Math.round(totalAmount / units));

  return {
    bookingId: booking.bookingId || booking.invoiceNumber || String(booking._id || ''),
    user: user?.name || booking.userName || 'Guest',
    type: booking.type,
    source: booking.source || details.source || '',
    destination: booking.destination || details.destination || '',
    journeyDate: booking.journeyDate || resolveJourneyDate(details),
    bookingDate: booking.bookingDate || formatDate(createdAt),
    bookingTime: booking.bookingTime || formatTime(createdAt),
    seats,
    pricePerSeat,
    totalAmount,
    tax,
    extraCharges,
    finalAmount,
    paymentStatus: booking.paymentStatus,
    status: booking.status
  };
};

module.exports = { buildReceiptSnapshot, formatDate, formatTime };

