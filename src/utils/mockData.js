/**
 * mockData.js  — hardcoded static data (no backend needed)
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

const HEADER_NAV = [
    { path: '/flights', label: 'Flights', icon: 'Plane' },
    { path: '/hotels', label: 'Hotels', icon: 'Hotel' },
    { path: '/trains', label: 'Trains', icon: 'Train' },
    { path: '/buses', label: 'Buses', icon: 'Bus' },
    { path: '/cabs', label: 'Cabs', icon: 'Car' },
    { path: '/holidays', label: 'Holidays', icon: 'Umbrella' },
];

const FOOTER_LINKS = [
    {
        title: 'Company',
        links: [
            { path: '/about', label: 'About Us' },
            { path: '/careers', label: 'Careers' },
            { path: '/press', label: 'Press' },
            { path: '/blog', label: 'Blog' },
        ],
    },
    {
        title: 'Support',
        links: [
            { path: '/contact', label: 'Contact Us' },
            { path: '/faqs', label: 'FAQs' },
            { path: '/refund', label: 'Refund Policy' },
            { path: '/privacy', label: 'Privacy Policy' },
        ],
    },
    {
        title: 'Services',
        links: [
            { path: '/corporate-travel', label: 'Corporate Travel' },
            { path: '/gift-cards', label: 'Gift Cards' },
            { path: '/refer-earn', label: 'Refer & Earn' },
            { path: '/travel-insurance', label: 'Travel Insurance' },
            { path: '/list-property', label: 'List Your Property' },
        ],
    },
];

// ─── Cities ───────────────────────────────────────────────────────────────────

const CITIES = {
    flight: ['Ahmedabad', 'Surat', 'Bangalore', 'Delhi', 'Chennai', 'Mumbai'],
    train: ['Gandhinagar', 'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara'],
    bus: ['Gandhinagar', 'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara'],
    hotel: ['Ahmedabad', 'Gandhinagar'],
    holiday: ['Dubai', 'Singapore', 'Thailand', 'Bali', 'Paris', 'London', 'Maldives', 'Turkey', 'Switzerland', 'Malaysia', 'Japan', 'Canada'],
    cab: ['Ahmedabad', 'Gandhinagar'],
};

// ─── Offers ───────────────────────────────────────────────────────────────────

const OFFERS = {
    flight: [
        { title: 'Student Discount', desc: 'Extra 10% off + free meal for students.', color: '#f3e5f5' },
        { title: 'Early Bird Deal', desc: 'Book 30 days ahead & save up to 25%.', color: '#e3f2fd' },
        { title: 'Weekend Flash Sale', desc: 'Flat ₹500 off on weekend departures.', color: '#fff3e0' },
    ],
    hotel: [
        { title: 'Long Stay Discount', desc: 'Stay 3+ nights and get 15% off.', color: '#e8f5e9' },
        { title: 'Couple Special', desc: 'Candlelight dinner + spa voucher included.', color: '#fce4ec' },
        { title: 'Last Minute Deal', desc: 'Book today & save 20% on select hotels.', color: '#e3f2fd' },
    ],
    train: [
        { title: 'Senior Citizen', desc: '40% fare concession for senior citizens.', color: '#fff3e0' },
        { title: 'Tatkal Offer', desc: 'Instant booking with Tatkal quota.', color: '#f3e5f5' },
        { title: 'Group Booking', desc: 'Book 10+ tickets and get special group fare.', color: '#e8f5e9' },
    ],
    bus: [
        { title: 'Ladies Special', desc: 'Extra 10% off for women travellers.', color: '#fce4ec' },
        { title: 'Night Bus Deal', desc: 'Save up to 20% on overnight journeys.', color: '#e3f2fd' },
        { title: 'First Ride Offer', desc: 'Use code BUSGO for ₹100 off your first ride.', color: '#fff3e0' },
    ],
    cab: [
        { title: 'Airport Transfer', desc: 'Flat ₹200 off on airport cab bookings.', color: '#e8f5e9' },
        { title: 'Outstation Deal', desc: 'Book outstation cab and save 15%.', color: '#f3e5f5' },
        { title: 'Corporate Cab', desc: 'GST invoice available for all corporate rides.', color: '#e3f2fd' },
    ],
    holiday: [
        { title: 'Honeymoon Special', desc: 'Complimentary room upgrade for newlyweds.', color: '#fce4ec' },
        { title: 'Family Package', desc: 'Kids stay & eat free on family packages.', color: '#e8f5e9' },
        { title: 'Adventure Deal', desc: 'Free adventure activity on select packages.', color: '#fff3e0' },
    ],
};

// ─── Mock Flight Generator ────────────────────────────────────────────────────

const AIRLINES = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'Akasa Air'];
const AIRCRAFTS = ['Airbus A320', 'Boeing 737', 'Airbus A350', 'Boeing 787'];
const FLIGHT_CITIES = ['Ahmedabad', 'Surat', 'Bangalore', 'Delhi', 'Chennai', 'Mumbai'];
const TIME_SLOTS = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

// Seeded random helper for reproducible data
function seededRand(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

let _flightCache = null;

function generateFlights() {
    if (_flightCache) return _flightCache;
    const flights = [];
    const today = new Date();
    let seedCounter = 1;

    for (let d = 0; d < 30; d++) {
        const date = new Date(today.getTime() + d * 86400000);
        const dateStr = date.toISOString().split('T')[0];

        for (let i = 0; i < FLIGHT_CITIES.length; i++) {
            for (let j = 0; j < FLIGHT_CITIES.length; j++) {
                if (i === j) continue;
                const source = FLIGHT_CITIES[i];
                const destination = FLIGHT_CITIES[j];

                for (let k = 0; k < TIME_SLOTS.length; k++) {
                    const rand = seededRand(++seedCounter);
                    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
                    const aircraftType = AIRCRAFTS[Math.floor(rand() * AIRCRAFTS.length)];
                    const stops = rand() > 0.7 ? 1 : 0;
                    const durationHrs = stops === 1 ? 4 : 2;
                    const depHour = parseInt(TIME_SLOTS[k].split(':')[0]);
                    const arrHour = (depHour + durationHrs) % 24;
                    const arrTime = `${String(arrHour).padStart(2, '0')}:00`;
                    const flightNumber = `${airline.substring(0, 2).toUpperCase()}-${1000 + Math.floor(rand() * 8000)}`;
                    const econPrice = 3000 + Math.floor(rand() * 2000);
                    const bizPrice = 8000 + Math.floor(rand() * 3000);
                    const firstPrice = 15000 + Math.floor(rand() * 5000);
                    const econSeats = 90 + Math.floor(rand() * 60);
                    const bizSeats = 20 + Math.floor(rand() * 20);
                    const firstSeats = 5 + Math.floor(rand() * 5);

                    flights.push({
                        _id: `${dateStr}-${source}-${destination}-${k}`,
                        category: 'flight',
                        flightNumber,
                        airline,
                        source,
                        destination,
                        date: dateStr,
                        departureTime: TIME_SLOTS[k],
                        arrivalTime: arrTime,
                        duration: `${durationHrs}h 00m`,
                        stops,
                        aircraftType,
                        baggageOptions: { cabin: '7kg', checkin: '15kg' },
                        seats: [
                            { classType: 'Economy', totalSeats: 150, availableSeats: econSeats, price: econPrice },
                            { classType: 'Business', totalSeats: 40, availableSeats: bizSeats, price: bizPrice },
                            { classType: 'First', totalSeats: 10, availableSeats: firstSeats, price: firstPrice },
                        ],
                    });
                }
            }
        }
    }

    _flightCache = flights;
    return flights;
}

export function searchFlights(filters = {}) {
    const all = generateFlights();
    let results = [...all];

    if (filters.source) results = results.filter(f => f.source.toLowerCase() === filters.source.toLowerCase());
    if (filters.destination) results = results.filter(f => f.destination.toLowerCase() === filters.destination.toLowerCase());
    if (filters.date) results = results.filter(f => f.date === filters.date);
    if (filters.classType) {
        results = results.filter(f => f.seats.some(s => s.classType === filters.classType));
    }
    if (filters.availableSeats) {
        const needed = Number(filters.availableSeats);
        results = results.filter(f => f.seats.some(s =>
            (!filters.classType || s.classType === filters.classType) && s.availableSeats >= needed
        ));
    }

    // Sort by lowest Economy price
    results.sort((a, b) => {
        const priceA = Math.min(...a.seats.map(s => s.price));
        const priceB = Math.min(...b.seats.map(s => s.price));
        return priceA - priceB;
    });

    return results.slice(0, 60);
}

// Return a small sample of upcoming flights (no filter)
export function getDefaultFlights() {
    const all = generateFlights();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = all.filter(f => f.date >= today);
    // pick 12 spread flights
    const step = Math.max(1, Math.floor(upcoming.length / 12));
    return upcoming.filter((_, idx) => idx % step === 0).slice(0, 12);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const getHeaderNav = async () => HEADER_NAV;
export const getFooterLinks = async () => FOOTER_LINKS;
export const getCities = async (type) => type ? CITIES[type] : ['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Dubai'];
export const getOffers = async (type) => OFFERS[type] || [
    { title: 'Special Deal', desc: 'Enjoy unique savings on your next trip.', color: '#e3f2fd' },
];
