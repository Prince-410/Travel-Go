/**
 * busData.js — Mock bus data generator (no backend needed)
 */

const BUS_CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mumbai'];

const BUS_OPERATORS = [
    'RedBus Express', 'SRS Travels', 'VRL Travels', 'Orange Tours',
    'NueGo', 'GSRTC', 'IntrCity SmartBus', 'Paulo Travels',
];

const BUS_TYPES = [
    { type: 'AC Sleeper', amenities: ['AC', 'Sleeper', 'Charging Point', 'Blanket', 'Water Bottle'] },
    { type: 'Non-AC Sleeper', amenities: ['Sleeper', 'Fan', 'Charging Point'] },
    { type: 'AC Semi-Sleeper', amenities: ['AC', 'Recliner Seats', 'Charging Point', 'Water Bottle'] },
    { type: 'Volvo AC', amenities: ['AC', 'Volvo', 'Push-Back Seats', 'Charging Point', 'WiFi', 'Live Tracking'] },
    { type: 'Non-AC Seater', amenities: ['Fan', 'Seater'] },
    { type: 'Volvo AC Sleeper', amenities: ['AC', 'Volvo', 'Sleeper', 'Charging Point', 'WiFi', 'Entertainment', 'Live Tracking'] },
];

const BUS_TIME_SLOTS = ['06:00', '08:30', '10:00', '13:00', '16:30', '18:00', '20:30', '22:00', '23:30'];

const BOARDING_POINTS = {
    'Ahmedabad': ['Paldi BRTS', 'Maninagar Rly Station', 'Gita Mandir Bus Stand', 'Kalupur Station'],
    'Surat': ['Surat Railway Station', 'Kapodra', 'Sachin', 'Udhna Darwaja'],
    'Vadodara': ['Baroda Railway Station', 'Alkapuri', 'Fatehgunj', 'Akota'],
    'Rajkot': ['Rajkot Bus Stand', 'Sadar Bazaar', 'Kalawad Road'],
    'Gandhinagar': ['Sector 11', 'Akshardham', 'CH Road'],
    'Mumbai': ['Dadar', 'Borivali', 'Thane', 'Kurla', 'Bandra'],
};

function srand(seed) {
    let s = (seed * 31 + 7) >>> 0;
    return () => {
        s = (Math.imul(s, 16807) + 0) >>> 0;
        return s / 4294967296;
    };
}

function pad2(n) { return String(Math.abs(Math.floor(n))).padStart(2, '0'); }

let _busCache = null;

function generateBuses() {
    if (_busCache) return _busCache;
    const buses = [];
    const today = new Date();

    for (let d = 0; d < 14; d++) {
        const date = new Date(today.getTime() + d * 86400000);
        const dateStr = date.toISOString().split('T')[0];

        for (let i = 0; i < BUS_CITIES.length; i++) {
            for (let j = 0; j < BUS_CITIES.length; j++) {
                if (i === j) continue;
                const source = BUS_CITIES[i];
                const destination = BUS_CITIES[j];
                const routeSeed = d * 100 + i * 10 + j;
                const rand = srand(routeSeed);
                const numBuses = 3 + Math.floor(rand() * 3);

                for (let k = 0; k < numBuses; k++) {
                    const r = srand(routeSeed * 50 + k * 7 + 1);
                    const operator = BUS_OPERATORS[Math.floor(r() * BUS_OPERATORS.length)];
                    const busTypeDef = BUS_TYPES[Math.floor(r() * BUS_TYPES.length)];
                    const slot = BUS_TIME_SLOTS[Math.floor(r() * BUS_TIME_SLOTS.length)];
                    const durationHrs = 3 + Math.floor(r() * 6);
                    const durationMins = Math.floor(r() * 4) * 15;
                    const depH = parseInt(slot.split(':')[0]);
                    const depM = parseInt(slot.split(':')[1]);
                    const totalMins = depH * 60 + depM + durationHrs * 60 + durationMins;
                    const arrH = Math.floor(totalMins / 60) % 24;
                    const arrM = totalMins % 60;
                    const arrTime = `${pad2(arrH)}:${pad2(arrM)}`;
                    const price = 250 + Math.floor(r() * 1200);
                    const totalSeats = busTypeDef.type.includes('Sleeper') ? 36 : 44;
                    const bookedSeats = Math.floor(r() * (totalSeats * 0.8));
                    const availableSeats = totalSeats - bookedSeats;
                    const rating = parseFloat((3.5 + r() * 1.4).toFixed(1));
                    const srcBoarding = BOARDING_POINTS[source] || [source + ' Bus Stand'];
                    const destDropping = BOARDING_POINTS[destination] || [destination + ' Bus Stand'];
                    const boardingPoint = srcBoarding[Math.floor(r() * srcBoarding.length)];
                    const droppingPoint = destDropping[Math.floor(r() * destDropping.length)];
                    const isLive = busTypeDef.amenities.includes('Live Tracking');
                    const durationStr = `${durationHrs}h${durationMins > 0 ? ' ' + durationMins + 'm' : ''}`;
                    const policy = r() > 0.5 ? 'Free cancellation up to 2 hours before departure' : 'Rs 50 cancellation fee applies';

                    buses.push({
                        _id: `bus-${dateStr}-${i}-${j}-${k}`,
                        category: 'bus',
                        operator,
                        busType: busTypeDef.type,
                        amenities: busTypeDef.amenities,
                        source,
                        destination,
                        date: dateStr,
                        departureTime: slot,
                        arrivalTime: arrTime,
                        duration: durationStr,
                        price,
                        totalSeats,
                        availableSeats,
                        bookedSeats,
                        rating,
                        boardingPoint,
                        droppingPoint,
                        isLive,
                        cancellationPolicy: policy,
                    });
                }
            }
        }
    }

    _busCache = buses;
    return buses;
}

export function searchBuses(filters = {}) {
    const all = generateBuses();
    let results = [...all];
    if (filters.source) results = results.filter(b => b.source.toLowerCase() === filters.source.toLowerCase());
    if (filters.destination) results = results.filter(b => b.destination.toLowerCase() === filters.destination.toLowerCase());
    if (filters.date) results = results.filter(b => b.date === filters.date);
    if (filters.busType && filters.busType !== 'all') {
        results = results.filter(b => b.busType.toLowerCase().includes(filters.busType.toLowerCase()));
    }
    if (filters.passengers) results = results.filter(b => b.availableSeats >= Number(filters.passengers));
    results.sort((a, b) => a.price - b.price);
    return results.slice(0, 50);
}

export function getDefaultBuses() {
    const all = generateBuses();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = all.filter(b => b.date >= today);
    const step = Math.max(1, Math.floor(upcoming.length / 10));
    return upcoming.filter((_, idx) => idx % step === 0).slice(0, 10);
}

export { BUS_CITIES, BOARDING_POINTS };
