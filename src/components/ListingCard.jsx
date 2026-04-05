
import React from 'react';
import {
    Star, MapPin, Clock, Calendar, Users,
    Plane, Hotel, Train, Bus, Car, Palmtree,
    ArrowRight, Zap, Shield, Wifi
} from 'lucide-react';

/* ─── Category Config — Dark-theme palette ──────────────────────────────── */
const CAT_CONFIG = {
    // ✈️  Flights — Midnight Indigo / Deep Blue
    flight: {
        icon: Plane,
        accent: '#818cf8',   // vivid indigo — pops on dark
        gFrom: '#0c0b1d',   // near-black indigo
        gTo: '#1e1b4b',   // deep space blue
        label: 'Flight',
    },
    // 🏨  Hotels — Dark Teal / Deep Emerald
    hotel: {
        icon: Hotel,
        accent: '#2dd4bf',   // bright teal
        gFrom: '#030f0e',   // near-black teal
        gTo: '#0d3b37',   // deep emerald
        label: 'Hotel',
    },
    // 🚂  Trains — Dark Amber / Deep Gold
    train: {
        icon: Train,
        accent: '#fbbf24',   // bright amber
        gFrom: '#120c00',   // near-black brown
        gTo: '#3d2800',   // dark caramel
        label: 'Train',
    },
    // 🚌  Buses — Dark Forest / Deep Moss Green
    bus: {
        icon: Bus,
        accent: '#4ade80',   // bright lime-green
        gFrom: '#030f07',   // near-black green
        gTo: '#0c3318',   // deep forest green
        label: 'Bus',
    },
    // 🚕  Cabs — Dark Rust / Deep Burnt Orange
    cab: {
        icon: Car,
        accent: '#fb923c',   // bright tangerine
        gFrom: '#130600',   // near-black rust
        gTo: '#3d1200',   // dark rust brown
        label: 'Cab',
    },
    // 🌴  Holidays — Dark Rose / Deep Magenta
    holiday: {
        icon: Palmtree,
        accent: '#f472b6',   // bright hot pink
        gFrom: '#130010',   // near-black magenta
        gTo: '#420027',   // deep rose
        label: 'Holiday',
    },
};

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const fmt = (d) => d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

const seatsColor = (n) => n <= 5 ? '#f87171' : n <= 15 ? '#fb923c' : '#a3a3a3';

const ListingCard = ({ item, onSelectSeats }) => {
    const cfg = CAT_CONFIG[item.category] || CAT_CONFIG.flight;
    const Icon = cfg.icon;

    // Determine the primary display price
    const displayPrice = item.basePrice || item.price || (item.seats && item.seats.length > 0 ? Math.min(...item.seats.map(s => s.price)) : (item.rooms?.[0]?.price || 500));

    return (
        <div className="lc-card" style={{ '--accent': cfg.accent, '--gFrom': cfg.gFrom, '--gTo': cfg.gTo }}>

            {/* ── Top gradient header ────────────────────────────────────── */}
            <div className="lc-header">
                {/* Category icon circle */}
                <div className="lc-icon-circle">
                    <Icon size={22} color="#fff" />
                </div>

                {/* Title block */}
                <div className="lc-title-block">
                    <span className="lc-category-label">{cfg.label}</span>
                    <h3 className="lc-title">
                        {item.airline ? `${item.airline} ${item.flightNumber}` : (item.name || item.title || `${item.source?.city || item.source || 'Origin'} to ${item.destination?.city || item.destination || 'Destination'}`)}
                    </h3>
                    <p className="lc-subtitle">
                        {item.category === 'hotel'
                            ? `${item.location?.city || ''}, ${item.location?.country || ''}`
                            : `${item.source?.city || item.currentLocation?.city || item.source || ''} → ${item.destination?.city || item.destination || (item.category === 'cab' ? 'Anywhere' : '')}`}
                    </p>
                </div>

                {/* Badge if it's the fastest / cheapest */}
                {displayPrice < 1500 && <span className="lc-badge">Great Value</span>}
                {item.category === 'flight' && displayPrice < 4000 && <span className="lc-badge" style={{background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80'}}>Cheapest Day</span>}
                {item.category === 'flight' && Math.random() > 0.5 && <span className="lc-badge" style={{background: 'rgba(244, 114, 182, 0.2)', color: '#f472b6'}}><Zap size={10} style={{display: 'inline'}}/> AI: Price may drop</span>}
            </div>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <div className="lc-body">

                {/* Time row: dep → arr + duration */}
                {item.departureTime && (
                    <div className="lc-time-row">
                        <div className="lc-time-block">
                            <span className="lc-time-value">{item.departureTime}</span>
                            <span className="lc-time-label">Depart</span>
                        </div>

                        <div className="lc-duration-block">
                            <div className="lc-duration-line">
                                <span className="lc-dot" />
                                <span className="lc-line" />
                                <span className="lc-dot" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {item.duration && <span className="lc-duration-text">{item.duration}</span>}
                                {item.category === 'flight' && (
                                    <span style={{ fontSize: '0.65rem', color: item.stops === 0 ? '#4ade80' : '#fbbf24', fontWeight: '600' }}>
                                        {item.stops === 0 ? 'Non-stop' : `${item.stops} Stop${item.stops > 1 ? 's' : ''}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        {item.arrivalTime && (
                            <div className="lc-time-block" style={{ textAlign: 'right' }}>
                                <span className="lc-time-value">{item.arrivalTime}</span>
                                <span className="lc-time-label">Arrive</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Pills row */}
                <div className="lc-pills">
                    {item.pill1 && <span className="lc-pill">{item.pill1}</span>}
                    {item.pill2 && <span className="lc-pill">{item.pill2}</span>}
                    {item.category === 'flight' && item.aircraftType && <span className="lc-pill"><Plane size={10} style={{display: 'inline', marginRight: '4px'}}/>{item.aircraftType}</span>}
                    {item.category === 'flight' && item.baggageOptions && (
                        <span className="lc-pill">
                            <span style={{marginRight: '6px'}}>🎒 {item.baggageOptions.cabin}</span>
                            <span>🧳 {item.baggageOptions.checkin}</span>
                        </span>
                    )}
                </div>

                {/* Meta row: date · seats */}
                <div className="lc-meta-row">
                    {(item.date || item.startDate) && (
                        <span className="lc-meta-chip">
                            <Calendar size={11} /> {fmt(item.date || item.startDate)}
                        </span>
                    )}
                    {(item.source?.city || item.currentLocation?.city || item.location?.city || item.source) && (
                        <span className="lc-meta-chip">
                            <MapPin size={11} /> {item.source?.city || item.currentLocation?.city || item.location?.city || item.source}
                        </span>
                    )}
                    {(item.destination?.city || item.destination) && (
                        <span className="lc-meta-chip">
                            <MapPin size={11} /> {item.destination?.city || item.destination}
                        </span>
                    )}

                    {/* Sum of remaining seats mappings automatically */}
                    {item.seats && (
                        <span className="lc-meta-chip" style={{ color: seatsColor(item.seats.reduce((acc, curr) => acc + curr.availableSeats, 0)) }}>
                            <Users size={11} /> {item.seats.reduce((acc, curr) => acc + curr.availableSeats, 0)} left
                        </span>
                    )}
                    {item.rooms && (
                        <span className="lc-meta-chip" style={{ color: seatsColor(item.rooms.reduce((acc, curr) => acc + curr.availableRooms, 0)) }}>
                            <Hotel size={11} /> {item.rooms.reduce((acc, curr) => acc + curr.availableRooms, 0)} left
                        </span>
                    )}
                </div>
            </div>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <div className="lc-footer">
                <div className="lc-price-block">
                    <span className="lc-price" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                        ₹{displayPrice}
                    </span>
                    {item.category === 'flight' && <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>per adult</span>}
                </div>

                <div className="lc-footer-right">
                    <div className="lc-rating">
                        <Star size={12} fill="currentColor" /> {4.5}
                    </div>
                    {item.category === 'flight' ? (
                        <button className="lc-book-btn" onClick={(e) => { e.stopPropagation(); onSelectSeats && onSelectSeats(); }}>
                            Select Seats <ArrowRight size={14} />
                        </button>
                    ) : (
                        <button className="lc-book-btn">
                            Book <ArrowRight size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Decorative accent glow blur */}
            <div className="lc-glow" />
        </div>
    );
};

export default ListingCard;
