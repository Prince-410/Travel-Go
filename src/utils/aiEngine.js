// ─── AI Travel Recommendation Engine ─────────────────────────────────────────
// Client-side AI engine that provides smart recommendations, price predictions,
// and personalized suggestions based on search patterns.

// Price prediction: simulates ML-based fare forecasting
export function predictPrice(type, from, to, date) {
  const seed = (from + to + (date || '')).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const trend = seed % 5;
  const confidence = 65 + (seed % 30);

  if (trend === 0) return { trend: 'drop', label: '📉 Price likely to drop in 3 days', color: '#4ade80', advice: 'Wait before booking — prices expected to decrease', confidence };
  if (trend === 1) return { trend: 'rise', label: '📈 Price rising soon — book now!', color: '#f87171', advice: 'Book immediately — prices are trending upward', confidence };
  if (trend === 2) return { trend: 'stable', label: '📊 Prices are stable', color: '#94a3b8', advice: 'Prices are consistent — safe to book anytime', confidence };
  if (trend === 3) return { trend: 'lowest', label: '🎯 This is the lowest price!', color: '#818cf8', advice: 'Great deal! This is the cheapest we\'ve seen', confidence: 92 };
  return { trend: 'seasonal', label: '🌊 Off-season pricing available', color: '#fbbf24', advice: 'Take advantage of off-season rates', confidence };
}

// Smart travel recommendations: given a route, suggest complete itinerary
export function getSmartRecommendations(from, to) {
  const routes = {
    'Ahmedabad-Goa': {
      flights: [
        { airline: 'IndiGo', price: 3200, duration: '1h 45m', tip: '🏆 Cheapest direct flight' },
        { airline: 'Air India', price: 4100, duration: '1h 40m', tip: '✅ Best on-time record' }
      ],
      hotels: [
        { name: 'Taj Fort Aguada', price: 8500, rating: 4.8, tip: '🌊 Beachfront luxury' },
        { name: 'OYO Calangute', price: 1200, rating: 4.1, tip: '💰 Budget-friendly' },
        { name: 'W Goa', price: 15000, rating: 4.9, tip: '👑 Premium resort' }
      ],
      cabs: [
        { type: 'Airport Sedan', price: 800, tip: '🚗 Airport to hotel' },
        { type: 'Full Day SUV', price: 2500, tip: '🏖️ Beach hopping' }
      ],
      activities: [
        '🏖️ Baga Beach water sports — ₹800',
        '🏰 Fort Aguada sunset tour — ₹300',
        '🍽️ Saturday night market — Free',
        '🚤 Dolphin watching trip — ₹1,500',
        '🌅 Chapora Fort sunrise trek — Free'
      ],
      totalEstimate: 15200,
      savingsPercent: 22
    },
    'Delhi-Manali': {
      flights: [
        { airline: 'SpiceJet', price: 4500, duration: '1h 20m to Kullu', tip: '✈️ Closest airport' }
      ],
      hotels: [
        { name: 'The Himalayan', price: 6000, rating: 4.7, tip: '🏔️ Mountain view' },
        { name: 'Zostel Manali', price: 800, rating: 4.3, tip: '🎒 Backpacker special' }
      ],
      cabs: [
        { type: 'Kullu to Manali SUV', price: 1500, tip: '🏔️ Scenic mountain drive' }
      ],
      activities: [
        '🏔️ Rohtang Pass — ₹2,000 (incl. permit)',
        '🎿 Solang Valley paragliding — ₹3,500',
        '♨️ Vashisht Hot Springs — Free',
        '🏕️ Camping in Sethan — ₹1,500'
      ],
      totalEstimate: 18800,
      savingsPercent: 18
    },
    'Mumbai-Dubai': {
      flights: [
        { airline: 'Air India Express', price: 12000, duration: '3h 30m', tip: '💰 Most affordable' },
        { airline: 'Emirates', price: 22000, duration: '3h 15m', tip: '👑 Premium experience' }
      ],
      hotels: [
        { name: 'Atlantis The Palm', price: 25000, rating: 4.9, tip: '🌟 Iconic resort' },
        { name: 'Rove Downtown', price: 5500, rating: 4.4, tip: '💰 Budget meets location' }
      ],
      cabs: [
        { type: 'Airport Transfer', price: 2000, tip: '🚗 Meet & greet service' }
      ],
      activities: [
        '🏙️ Burj Khalifa At The Top — ₹3,500',
        '🏜️ Desert Safari — ₹4,000',
        '🛍️ Dubai Mall — Free entry',
        '🚤 Dhow Cruise dinner — ₹3,000'
      ],
      totalEstimate: 52000,
      savingsPercent: 15
    }
  };

  const key = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;

  if (routes[key]) return routes[key];
  if (routes[reverseKey]) return routes[reverseKey];

  // Generate generic recommendations for unknown routes
  const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    flights: [
      { airline: 'IndiGo', price: 2500 + (seed % 5000), duration: `${1 + (seed % 3)}h ${10 + (seed % 50)}m`, tip: '💰 Best value' },
      { airline: 'Air India', price: 3500 + (seed % 6000), duration: `${1 + (seed % 3)}h ${(seed % 40)}m`, tip: '✅ Reliable choice' }
    ],
    hotels: [
      { name: `${to} Grand Hotel`, price: 3000 + (seed % 8000), rating: 4.2 + (seed % 8) / 10, tip: '⭐ Top rated' },
      { name: `Budget Stay ${to}`, price: 800 + (seed % 1500), rating: 3.8 + (seed % 5) / 10, tip: '💰 Budget option' }
    ],
    cabs: [
      { type: 'Airport Transfer', price: 500 + (seed % 1500), tip: '🚗 Convenient pickup' }
    ],
    activities: [
      `🏛️ ${to} city tour — ₹${500 + (seed % 2000)}`,
      `🍽️ Local food walk — ₹${300 + (seed % 800)}`,
      `📸 Photography spots — Free`,
    ],
    totalEstimate: 8000 + (seed % 20000),
    savingsPercent: 10 + (seed % 20)
  };
}

// Personalized suggestions based on search history
export function getPersonalizedSuggestions(searchHistory = []) {
  const destinations = [
    { city: 'Goa', tag: '🏖️ Beach', score: 95, reason: 'Perfect weather right now' },
    { city: 'Manali', tag: '🏔️ Hills', score: 91, reason: 'Snow season departing soon' },
    { city: 'Jaipur', tag: '🏰 Heritage', score: 88, reason: 'Festival season offers' },
    { city: 'Dubai', tag: '🌆 Luxury', score: 85, reason: 'Expo deals available' },
    { city: 'Bali', tag: '🌴 Tropical', score: 82, reason: 'Honeymoon favorite' },
    { city: 'Udaipur', tag: '🏰 Romance', score: 80, reason: 'City of Lakes experience' },
    { city: 'Andaman', tag: '🤿 Diving', score: 78, reason: 'Crystal clear waters' },
    { city: 'Shimla', tag: '❄️ Winter', score: 75, reason: 'Colonial charm' }
  ];

  // Boost based on history
  if (searchHistory.length > 0) {
    const beachSearches = searchHistory.filter(s => ['Goa', 'Bali', 'Andaman'].includes(s));
    if (beachSearches.length > 0) {
      destinations.forEach(d => {
        if (['🏖️ Beach', '🌴 Tropical', '🤿 Diving'].includes(d.tag)) d.score += 10;
      });
    }
  }

  return destinations.sort((a, b) => b.score - a.score).slice(0, 6);
}

// Dynamic pricing analysis
export function analyzePricing(type, basePrice) {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const factors = [];

  // Time-based
  if (hour >= 1 && hour <= 5) {
    factors.push({ factor: 'Late night booking', impact: -8, color: '#4ade80' });
  } else if (hour >= 18 && hour <= 22) {
    factors.push({ factor: 'Peak browsing hours', impact: +5, color: '#f87171' });
  }

  // Day-based
  if (day === 0 || day === 6) {
    factors.push({ factor: 'Weekend pricing', impact: +12, color: '#f87171' });
  } else if (day === 2 || day === 3) {
    factors.push({ factor: 'Mid-week discount', impact: -10, color: '#4ade80' });
  }

  // Type-based
  if (type === 'flight') {
    factors.push({ factor: 'Advance booking (30+ days)', impact: -15, color: '#4ade80' });
  } else if (type === 'hotel') {
    factors.push({ factor: 'Last-minute deal possible', impact: -20, color: '#4ade80' });
  }

  const totalImpact = factors.reduce((a, f) => a + f.impact, 0);
  const adjustedPrice = Math.round(basePrice * (1 + totalImpact / 100));

  return {
    basePrice,
    adjustedPrice,
    factors,
    totalImpact,
    recommendation: totalImpact < 0 ? 'Good time to book!' : totalImpact > 10 ? 'Consider waiting for better prices' : 'Prices are fair',
    color: totalImpact < 0 ? '#4ade80' : totalImpact > 10 ? '#f87171' : '#fbbf24'
  };
}

// Chatbot responses
export function getChatbotResponse(message) {
  const msg = message.toLowerCase().trim();

  // Route-based queries
  const routeMatch = msg.match(/(?:from\s+)?(\w+)\s*(?:to|→|->)\s*(\w+)/i);
  if (routeMatch) {
    const [, from, to] = routeMatch;
    const recs = getSmartRecommendations(from.charAt(0).toUpperCase() + from.slice(1), to.charAt(0).toUpperCase() + to.slice(1));
    return {
      type: 'recommendation',
      text: `Here's what I found for ${from} → ${to}:`,
      data: recs
    };
  }

  // Keyword responses
  if (msg.includes('cheap') || msg.includes('budget')) {
    return { type: 'text', text: '💰 For budget travel, I recommend:\n\n• Book flights on Tues/Wed for lowest fares\n• Choose AC Sleeper buses for overnight journeys\n• Try 3-star hotels with breakfast included\n• Book 30+ days in advance for best prices\n\nWant me to search for a specific route?' };
  }

  if (msg.includes('hotel') || msg.includes('stay')) {
    return { type: 'text', text: '🏨 Hotel tips:\n\n• Udaipur & Jaipur have amazing heritage stays\n• Goa has great beach resorts from ₹2,000/night\n• Use "Price Match" filter for guaranteed best rates\n• Consider homestays for authentic experiences\n\nTell me your destination!' };
  }

  if (msg.includes('flight') || msg.includes('fly')) {
    return { type: 'text', text: '✈️ Flight tips:\n\n• Tuesday & Wednesday have cheapest fares\n• Book 3-4 weeks ahead for domestic flights\n• Early morning flights are usually cheaper\n• Use our AI Price Predictor to find the best time\n\nWhere are you flying to?' };
  }

  if (msg.includes('goa')) {
    return { type: 'text', text: '🏖️ Goa Travel Guide:\n\n• Best time: Nov-Feb (perfect weather)\n• Budget: ₹15k-25k for 3D2N\n• Must do: Baga Beach, Fort Aguada, Saturday Market\n• Food: Try Xacuti & Vindaloo\n• Stay: North Goa for parties, South for peace\n\nShall I search flights to Goa?' };
  }

  if (msg.includes('manali') || msg.includes('shimla') || msg.includes('hill')) {
    return { type: 'text', text: '🏔️ Hill Station Guide:\n\n• Manali: Adventure & snow (best: Dec-Feb)\n• Shimla: Colonial charm (best: Mar-Jun)\n• Budget: ₹12k-20k for 4D3N\n• Must do: Rohtang Pass, Solang Valley\n• Pro tip: Volvo buses from Delhi are comfortable & affordable!\n\nWant me to plan your trip?' };
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return { type: 'text', text: '👋 Hello! I\'m your AI Travel Assistant.\n\nI can help you with:\n• 🔍 Find cheapest routes (try "Ahmedabad to Goa")\n• 💰 Budget travel tips\n• 🏨 Hotel recommendations\n• ✈️ Flight deals\n• 🗺️ Complete trip planning\n\nJust tell me where you want to go!' };
  }

  if (msg.includes('thank')) {
    return { type: 'text', text: '😊 You\'re welcome! Happy travels! Let me know if you need anything else.' };
  }

  return { type: 'text', text: '🤖 I can help you plan your perfect trip!\n\nTry asking:\n• "Ahmedabad to Goa" — for complete route suggestions\n• "Cheap flights" — for budget tips\n• "Hotels in Jaipur" — for stay recommendations\n• "Best time for Manali" — for travel advice\n\nWhat would you like to explore?' };
}
