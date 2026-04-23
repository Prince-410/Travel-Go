const BookingCard = require('../models/BookingCard');

const normalizeSeatId = (seatId) => String(seatId || '').trim();
const normalizeValue = (value) => String(value || '').trim().toLowerCase();

const getBookingCardId = (details = {}) =>
  details.cardId ||
  details.flightId ||
  details.busId ||
  details.trainId ||
  details.hotelId ||
  details.holidayId ||
  details.cabId ||
  null;

const getSeatNumbers = (details = {}) => {
  const rawSeatIds = [
    ...(Array.isArray(details.seatNumbers) ? details.seatNumbers : []),
    ...(Array.isArray(details.seats) ? details.seats : []),
    details.selectedSeat
  ];

  return [...new Set(rawSeatIds.map(normalizeSeatId).filter(Boolean))];
};

const getRequestedUnits = (details = {}) => {
  const seatCount = getSeatNumbers(details).length;
  if (seatCount > 0) return seatCount;

  const candidates = [details.passengers, details.guests];
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 1;
};

const buildCategoryTokens = (details = {}) =>
  [
    details.category,
    details.classCode,
    details.classType,
    details.roomType,
    details.busType,
    details.vehicleType,
    details.cabType
  ]
    .map(normalizeValue)
    .filter(Boolean);

const entryMatchesCategory = (entry, tokens) => {
  if (!tokens.length || !entry || typeof entry !== 'object') return false;

  const entryTokens = [
    entry.code,
    entry.classCode,
    entry.classType,
    entry.category,
    entry.name,
    entry.label,
    entry.type,
    entry.roomType
  ]
    .map(normalizeValue)
    .filter(Boolean);

  return tokens.some(token => entryTokens.includes(token));
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const adjustCategoryAvailability = (card, details, delta) => {
  if (!card.features || typeof card.features !== 'object') return;

  const tokens = buildCategoryTokens(details);
  if (!tokens.length) return;

  const collections = [
    { key: 'classes', availableKey: 'availableSeats', totalKey: 'totalSeats' },
    { key: 'seatCategories', availableKey: 'availableSeats', totalKey: 'totalSeats' },
    { key: 'rooms', availableKey: 'availableRooms', totalKey: 'totalRooms' }
  ];

  for (const collection of collections) {
    const items = card.features[collection.key];
    if (!Array.isArray(items)) continue;

    let updated = false;
    card.features[collection.key] = items.map(item => {
      if (!entryMatchesCategory(item, tokens)) return item;

      const currentAvailable = Number(item[collection.availableKey] || 0);
      const currentTotal = Number(item[collection.totalKey] || currentAvailable);
      const nextAvailable =
        delta >= 0
          ? clamp(currentAvailable + delta, 0, currentTotal || currentAvailable + delta)
          : Math.max(0, currentAvailable + delta);

      updated = true;
      return { ...item, [collection.availableKey]: nextAvailable };
    });

    if (updated) {
      return;
    }
  }
};

const syncCardStatus = (card) => {
  const nextAvailable = Math.max(0, Number(card.availableSeats || 0));
  card.availableSeats = nextAvailable;

  if (nextAvailable <= 0) {
    card.status = 'sold_out';
    return;
  }

  if (card.status === 'sold_out') {
    card.status = 'active';
  }
};

const emitCardUpdate = (app, card) => {
  const io = app?.get?.('io');
  if (io) {
    io.emit('UPDATE_BOOKING_CARD', card);
    io.emit('AVAILABILITY_CHANGED', {
      cardId: card._id,
      type: card.type,
      source: card.source,
      destination: card.destination,
      date: card.date,
      availableSeats: card.availableSeats,
      status: card.status
    });
  }
};

const emitSeatUnlocks = (app, cardId, seatIds) => {
  const io = app?.get?.('io');
  if (!io) return;

  seatIds.forEach(seatId => {
    io.emit('SEAT_UPDATE', { cardId, seatId, locked: false });
  });
};

const releaseLockedSeatsByIds = async (cardId, seatIds, app) => {
  const normalizedSeatIds = [...new Set((seatIds || []).map(normalizeSeatId).filter(Boolean))];
  if (!cardId || normalizedSeatIds.length === 0) return null;

  const card = await BookingCard.findById(cardId);
  if (!card) return null;

  const currentLocks = (card.lockedSeats || []).map(normalizeSeatId);
  const nextLocks = currentLocks.filter(seatId => !normalizedSeatIds.includes(seatId));

  if (nextLocks.length === currentLocks.length) {
    return card;
  }

  card.lockedSeats = nextLocks;
  await card.save();
  emitSeatUnlocks(app, card._id, normalizedSeatIds);
  return card;
};

const applyConfirmedInventory = async (booking, app) => {
  if (booking.inventoryApplied) return null;

  const details = booking.details || {};
  const cardId = getBookingCardId(details);
  if (!cardId) return null;

  const card = await BookingCard.findById(cardId);
  if (!card) {
    throw new Error('Associated inventory item was not found.');
  }

  const seatNumbers = getSeatNumbers(details);
  const requestedUnits = getRequestedUnits(details);
  const occupiedSeats = new Set((card.occupiedSeats || []).map(normalizeSeatId));
  const conflictingSeat = seatNumbers.find(seatId => occupiedSeats.has(seatId));

  if (conflictingSeat) {
    throw new Error(`Seat ${conflictingSeat} is already occupied.`);
  }

  if (Number(card.availableSeats || 0) < requestedUnits) {
    throw new Error('Not enough seats are available in this category.');
  }

  const normalizedLocked = (card.lockedSeats || []).map(normalizeSeatId);
  card.lockedSeats = normalizedLocked.filter(seatId => !seatNumbers.includes(seatId));

  if (seatNumbers.length > 0) {
    card.occupiedSeats = [...new Set([...(card.occupiedSeats || []).map(normalizeSeatId), ...seatNumbers])];
  }

  card.availableSeats = Math.max(0, Number(card.availableSeats || 0) - requestedUnits);
  adjustCategoryAvailability(card, details, -requestedUnits);
  syncCardStatus(card);
  await card.save();

  emitSeatUnlocks(app, card._id, seatNumbers);
  emitCardUpdate(app, card);

  booking.inventoryApplied = true;
  return card;
};

const releaseConfirmedInventory = async (booking, app) => {
  if (!booking.inventoryApplied) return null;

  const details = booking.details || {};
  const cardId = getBookingCardId(details);
  if (!cardId) {
    booking.inventoryApplied = false;
    return null;
  }

  const card = await BookingCard.findById(cardId);
  if (!card) {
    booking.inventoryApplied = false;
    return null;
  }

  const seatNumbers = getSeatNumbers(details);
  const requestedUnits = getRequestedUnits(details);
  const currentTotal = Number(card.totalSeats || 0);

  if (seatNumbers.length > 0) {
    card.occupiedSeats = (card.occupiedSeats || [])
      .map(normalizeSeatId)
      .filter(seatId => !seatNumbers.includes(seatId));

    card.lockedSeats = (card.lockedSeats || [])
      .map(normalizeSeatId)
      .filter(seatId => !seatNumbers.includes(seatId));
  }

  const nextAvailable = Number(card.availableSeats || 0) + requestedUnits;
  card.availableSeats = currentTotal > 0 ? Math.min(currentTotal, nextAvailable) : nextAvailable;

  adjustCategoryAvailability(card, details, requestedUnits);
  syncCardStatus(card);
  await card.save();

  emitCardUpdate(app, card);
  booking.inventoryApplied = false;
  return card;
};

module.exports = {
  applyConfirmedInventory,
  getBookingCardId,
  getRequestedUnits,
  getSeatNumbers,
  releaseConfirmedInventory,
  releaseLockedSeatsByIds
};
