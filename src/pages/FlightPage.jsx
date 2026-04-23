import React, { useState, useEffect, useRef } from 'react';
import {
    Plane, MapPin, Calendar, Users, ArrowRight, X, ChevronDown,
    Zap, Star, TrendingDown, Luggage, Clock, CheckCircle2,
    AlertCircle, Gift, Shield
} from 'lucide-react';
import SeatSelectionModal from '../components/SeatSelectionModal';
import { useAdminConfig } from '../context/AdminConfigContext';
import { searchFlights } from '../utils/mockData';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import '../App.css';

/* ─── Static Data ──────────────────────────────────────────────────────── */
const CITIES = ['Ahmedabad', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Surat'];
const AIRLINES = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'Akasa Air'];

// AI price prediction mock — purely visual, using live DB ID
function aiPricePrediction(flight) {
    const seed = flight._id ? flight._id.charCodeAt(0) + flight._id.charCodeAt(flight._id.length-1) : 42;
    const trend = seed % 3; // 0=drop, 1=rise, 2=stable
    if (trend === 0) return { label: 'Price likely to drop', color: '#4ade80', icon: 'down' };
    if (trend === 1) return { label: 'Price rising soon', color: '#f87171', icon: 'up' };
    return { label: 'Price is stable', color: '#cbd5e1', icon: 'stable' };
}

// Cheapest day
function isCheapestDay(flights, flight) {
    if (!flight.date) return false;
    const sameRoute = flights.filter(f => f.source === flight.source && f.destination === flight.destination);
    const prices = sameRoute.map(f => f.price);
    return prices.length > 1 && flight.price === Math.min(...prices);
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

const CityDropdown = ({ value, onChange, placeholder, exclude }) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = CITIES.filter(c => c !== exclude && c.toLowerCase().includes(q.toLowerCase()));

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div onClick={() => setOpen(!open)} style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', transition: 'border-color 0.2s',
                borderColor: open ? '#818cf8' : 'rgba(255,255,255,0.1)'
            }}>
                <MapPin size={16} color="#818cf8" />
                <span style={{ flex: 1, fontSize: '0.95rem', color: value ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: value ? 600 : 400 }}>
                    {value || placeholder}
                </span>
                <ChevronDown size={14} color="#818cf8" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden'
                }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <input autoFocus value={q} onChange={e => setQ(e.target.value)}
                            placeholder="Search city..."
                            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }} />
                    </div>
                    {filtered.map(city => (
                        <div key={city} onClick={() => { onChange(city); setOpen(false); setQ(''); }}
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <MapPin size={13} color="#818cf8" />
                            <span style={{ fontWeight: 600 }}>{city}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SelectDropdown = ({ value, onChange, options, placeholder, icon: Icon }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div onClick={() => setOpen(!open)} style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', transition: 'border-color 0.2s',
                borderColor: open ? '#818cf8' : 'rgba(255,255,255,0.1)'
            }}>
                {Icon && <Icon size={16} color="#818cf8" />}
                <span style={{ flex: 1, fontSize: '0.95rem', color: selected ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: selected ? 600 : 400 }}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown size={14} color="#818cf8" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden'
                }}>
                    {options.map(opt => (
                        <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                            style={{
                                padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                background: value === opt.value ? 'rgba(129,140,248,0.15)' : 'transparent',
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = 'rgba(129,140,248,0.08)'; }}
                            onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}>
                            {value === opt.value && <CheckCircle2 size={13} color="#818cf8" />}
                            <span style={{ fontWeight: 600, color: value === opt.value ? '#818cf8' : '#e2e8f0' }}>{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Cheapest Day Bar ──────────────────────────────────────────────────── */
const CheapestDayBar = ({ from, to, onSelectDate }) => {
    if (!from || !to) return null;
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today.getTime() + i * 86400000);
        const ds = d.toISOString().split('T')[0];
        const results = searchFlights({ source: from, destination: to, date: ds });
        const minPrice = results.length > 0 ? Math.min(...results.map(f => Math.min(...f.seats.map(s => s.price)))) : null;
        return { date: ds, day: d.toLocaleDateString('en-IN', { weekday: 'short' }), dayNum: d.getDate(), price: minPrice };
    });
    const validDays = days.filter(d => d.price !== null);
    if (validDays.length === 0) return null;
    const minPrice = Math.min(...validDays.map(d => d.price));

    return (
        <div style={{
            background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 20
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingDown size={15} color="#4ade80" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Cheapest Days — {from} → {to}
                </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {days.map(d => (
                    <button key={d.date} onClick={() => onSelectDate(d.date)}
                        disabled={!d.price}
                        style={{
                            flex: 1, minWidth: 70, padding: '10px 8px', borderRadius: 10, border: 'none',
                            background: d.price === minPrice ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                            cursor: d.price ? 'pointer' : 'not-allowed',
                            outline: d.price === minPrice ? '1.5px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
                            transition: 'all 0.2s'
                        }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{d.day}</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{d.dayNum}</div>
                        <div style={{ fontSize: '0.72rem', color: d.price === minPrice ? '#4ade80' : '#94a3b8', fontWeight: 700, marginTop: 2 }}>
                            {d.price ? `₹${d.price.toLocaleString('en-IN')}` : '—'}
                        </div>
                        {d.price === minPrice && <div style={{ fontSize: '0.6rem', color: '#4ade80', marginTop: 2 }}>LOWEST</div>}
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ─── Flight Card ───────────────────────────────────────────────────────── */
const FlightCard = ({ flight, allFlights, onSelectSeats }) => {
    const displayPrice = flight.price;
    const totalSeats = flight.availableSeats || 0;
    const seatsUrgent = totalSeats > 0 && totalSeats < 15;
    const ai = aiPricePrediction(flight);
    const cheapest = isCheapestDay(allFlights, flight);
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0c0b1d 0%, #1a1833 100%)',
            border: '1px solid rgba(129,140,248,0.15)',
            borderRadius: 16, overflow: 'hidden',
            transition: 'transform 0.25s, box-shadow 0.25s',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(129,140,248,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; }}>

            {/* Badges row */}
            <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', flexWrap: 'wrap' }}>
                {flight.dynamicPricing && (
                    <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(74,222,128,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        LIVE PRICE
                    </span>
                )}
                <span style={{
                    background: ai.icon === 'down' ? 'rgba(74,222,128,0.1)' : ai.icon === 'up' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)',
                    color: ai.color, fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                    border: `1px solid ${ai.color}30`, display: 'flex', alignItems: 'center', gap: 4
                }}>
                    <Zap size={9} /> {ai.label}
                </span>
                {seatsUrgent && (
                    <span style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(248,113,113,0.25)' }}>
                        ⚡ Filling Fast
                    </span>
                )}
            </div>

            {/* Main content */}
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

                {/* Airline */}
                <div style={{ minWidth: 130 }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: 2 }}>AIRLINE</div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{flight.title.split(' ')[0] || flight.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>{flight.source?.substring(0,3).toUpperCase()} - {flight.destination?.substring(0,3).toUpperCase()}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{flight.startTime || flight.time || '--:--'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>{flight.source}</div>
                </div>

                {/* Duration / Stops */}
                <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(90deg, #818cf8, rgba(129,140,248,0.2))' }} />
                        <Plane size={14} color="#818cf8" />
                        <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(90deg, rgba(129,140,248,0.2), #818cf8)' }} />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 5 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8' }}>{flight.date || 'Scheduled'}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80' }}>
                            Direct Flight
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{flight.arrivalTime || '--:--'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>{flight.destination}</div>
                </div>

                {/* Aircraft & Baggage */}
                <div style={{ flex: 1, minWidth: 130 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>AIRCRAFT & BAGGAGE</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: 2 }}>✈ {flight.features?.aircraft || 'A320/B737'}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>🎒 7kg cabin</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>🧳 {flight.features?.baggage || '15kg check-in'}</span>
                    </div>
                </div>

                {/* Price + Seat availability */}
                <div style={{ textAlign: 'right', minWidth: 140 }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>FROM</div>
                    <div style={{
                        fontSize: '1.9rem', fontWeight: 900, lineHeight: 1.1,
                        background: 'linear-gradient(135deg, #fff 30%, #818cf8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>
                        ₹{displayPrice.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>per adult</div>
                    <div style={{ fontSize: '0.72rem', color: totalSeats === 0 ? '#f87171' : '#64748b', fontWeight: 600, marginTop: 3 }}>
                        {totalSeats > 0 ? `${totalSeats} seats left` : 'Sold Out'}
                    </div>
                    <button onClick={() => onSelectSeats(flight)}
                        disabled={totalSeats === 0}
                        style={{
                            marginTop: 10, background: totalSeats > 0 ? 'linear-gradient(135deg, #818cf8, #6366f1)' : '#334155',
                            color: totalSeats > 0 ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10, padding: '9px 18px',
                            fontWeight: 700, fontSize: '0.85rem', cursor: totalSeats > 0 ? 'pointer' : 'not-allowed',
                            boxShadow: totalSeats > 0 ? '0 4px 15px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: 6
                        }}
                        onMouseEnter={e => { if(totalSeats > 0) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.5)'; } }}
                        onMouseLeave={e => { if(totalSeats > 0) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; } }}>
                        {totalSeats > 0 ? <><Plane size={14} /> Select Seats</> : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Multi-city Leg ────────────────────────────────────────────────────── */
const MultiCityLeg = ({ leg, index, onChange, onRemove, canRemove }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end', marginBottom: 12 }}>
        <div>
            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Flight {index + 1} — From</label>
            <CityDropdown value={leg.from} onChange={v => onChange(index, 'from', v)} placeholder="From City" exclude={leg.to} />
        </div>
        <div>
            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>To</label>
            <CityDropdown value={leg.to} onChange={v => onChange(index, 'to', v)} placeholder="To City" exclude={leg.from} />
        </div>
        <div>
            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Date</label>
            <ModernDatePicker value={leg.date} onChange={d => onChange(index, 'date', d)} placeholder="Select Date" accentColor="#818cf8" />
        </div>
        {canRemove && (
            <button onClick={() => onRemove(index)}
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer', color: '#f87171' }}>
                <X size={16} />
            </button>
        )}
    </div>
);

/* ─── Main FlightPage ───────────────────────────────────────────────────── */
const FlightPage = () => {
    const { bookingCards } = useAdminConfig(); // CONNECTED TO REAL-TIME DB

    const [tripType, setTripType] = useState('oneWay'); // oneWay | roundTrip | multiCity
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [classType, setClassType] = useState('Economy');
    const [passengers, setPassengers] = useState(1);
    const [multiLegs, setMultiLegs] = useState([{ from: '', to: '', date: '' }, { from: '', to: '', date: '' }]);

    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState('');
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [sortBy, setSortBy] = useState('price'); // price | duration | departure

    const resultsRef = useRef();

    // Fetch live flights strictly from WebSockets/DB
    useEffect(() => {
        const liveFlights = bookingCards.filter(c => c.type === 'flight' && c.status === 'active');
        if (!searched) {
            setResults(liveFlights);
            setResultMsg(`Showing ${liveFlights.length} popular flights from live inventory`);
        }
    }, [bookingCards, searched]);

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const liveFlights = bookingCards.filter(c => c.type === 'flight' && c.status === 'active');
            let allResults = [];
            
            if (tripType === 'multiCity') {
                multiLegs.forEach(leg => {
                    if (leg.from && leg.to) {
                        const r = liveFlights.filter(c => 
                            c.source.toLowerCase() === leg.from.toLowerCase() && 
                            c.destination.toLowerCase() === leg.to.toLowerCase() &&
                            (!leg.date || c.date === leg.date)
                        );
                        allResults = [...allResults, ...r];
                    }
                });
            } else {
                allResults = liveFlights.filter(c => {
                    if (from && c.source.toLowerCase() !== from.toLowerCase()) return false;
                    if (to && c.destination.toLowerCase() !== to.toLowerCase()) return false;
                    if (date && c.date !== date) return false;
                    return true;
                });
            }

            setResults(allResults);
            setSearched(true);
            setLoading(false);

            const dateLabel = date ? ` on ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : '';
            setResultMsg(`Found ${allResults.length} real-time flight${allResults.length !== 1 ? 's' : ''}${dateLabel}`);

            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }, 500);
    };

    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'departure') return (a.time || '').localeCompare(b.time || '');
        return 0;
    });

    const handleMultiLegChange = (idx, field, val) => {
        const updated = [...multiLegs];
        updated[idx] = { ...updated[idx], [field]: val };
        setMultiLegs(updated);
    };

    const swapCities = () => { const tmp = from; setFrom(to); setTo(tmp); };

    const tripTabs = [
        { id: 'oneWay', label: 'One Way' },
        { id: 'roundTrip', label: 'Round Trip' },
        { id: 'multiCity', label: 'Multi-City' },
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: 'transparent', fontFamily: "'Outfit', sans-serif", color: '#fff', paddingBottom: 60 }}>
            {/* Hero Banner */}
            <div style={{
                position: 'relative', padding: '80px 20px 40px',
                background: 'rgba(5, 5, 20, 0.5)',
                borderBottom: '1px solid rgba(129,140,248,0.15)',
                overflow: 'hidden'
            }}>
                {/* Decorative glows */}
                <div style={{ position: 'absolute', top: -100, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 0, right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
                    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Plane size={28} color="#818cf8" />
                        <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Flight Booking</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 8, lineHeight: 1.1 }}>
                        Book Flights at the{' '}
                        <span style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Lowest Fares
                        </span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>AI-powered price prediction • 6 Indian cities • Real-time seat tracking</p>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

                {/* ─── Search Card ─────────────────────────────────────── */}
                <div style={{
                    background: 'rgba(30,41,59,0.9)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(129,140,248,0.2)', borderRadius: 20,
                    padding: '28px 32px', marginTop: -24, marginBottom: 28,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
                }}>
                    {/* Trip type tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                        {tripTabs.map(tab => (
                            <button key={tab.id} onClick={() => setTripType(tab.id)} style={{
                                padding: '8px 20px', borderRadius: 50, border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
                                background: tripType === tab.id ? 'linear-gradient(135deg, #818cf8, #6366f1)' : 'rgba(255,255,255,0.05)',
                                color: tripType === tab.id ? '#fff' : '#94a3b8',
                                boxShadow: tripType === tab.id ? '0 4px 15px rgba(99,102,241,0.4)' : 'none'
                            }}>{tab.label}</button>
                        ))}
                    </div>

                    {/* Search Fields */}
                    {tripType === 'multiCity' ? (
                        <>
                            {multiLegs.map((leg, i) => (
                                <MultiCityLeg key={i} leg={leg} index={i}
                                    onChange={handleMultiLegChange}
                                    onRemove={(idx) => setMultiLegs(multiLegs.filter((_, j) => j !== idx))}
                                    canRemove={multiLegs.length > 2} />
                            ))}
                            {multiLegs.length < 4 && (
                                <button onClick={() => setMultiLegs([...multiLegs, { from: '', to: '', date: '' }])}
                                    style={{ background: 'rgba(129,140,248,0.1)', border: '1px dashed rgba(129,140,248,0.35)', borderRadius: 10, padding: '9px 20px', color: '#818cf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginBottom: 16 }}>
                                    + Add another city
                                </button>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: 12, marginBottom: 16, alignItems: 'end' }}>
                            <div>
                                <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>From</label>
                                <CityDropdown value={from} onChange={setFrom} placeholder="Departure City" exclude={to} />
                            </div>
                            <button onClick={swapCities} style={{
                                background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)',
                                borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s', marginBottom: 2, flexShrink: 0
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.25)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.12)'}>
                                <ArrowRight size={16} color="#818cf8" />
                            </button>
                            <div>
                                <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>To</label>
                                <CityDropdown value={to} onChange={setTo} placeholder="Destination City" exclude={from} />
                            </div>
                            <div style={{ zIndex: 100 }}>
                                <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Departure Date</label>
                                <ModernDatePicker value={date} onChange={setDate} placeholder="Add Departure" accentColor="#818cf8" />
                            </div>
                        </div>
                    )}

                    {tripType === 'roundTrip' && (
                        <div style={{ marginBottom: 16, maxWidth: 300, zIndex: 90 }}>
                            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Return Date</label>
                            <ModernDatePicker value={returnDate} onChange={setReturnDate} placeholder="Add Return" accentColor="#818cf8" />
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                        <div>
                            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Class</label>
                            <SelectDropdown value={classType} onChange={setClassType}
                                options={[
                                    { value: 'Economy', label: '💺 Economy' },
                                    { value: 'Business', label: '🛋️ Business' },
                                    { value: 'First', label: '👑 First Class' },
                                ]}
                                placeholder="Select Class" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Passengers</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
                                <Users size={16} color="#818cf8" />
                                <input type="number" min={1} max={9} value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: 40 }} />
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>adult{passengers > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <button onClick={handleSearch} disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff',
                                border: 'none', borderRadius: 12, padding: '12px 36px',
                                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(99,102,241,0.4)', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}>
                            {loading ? '⏳ Searching…' : <><Plane size={16} /> Search Flights</>}
                        </button>
                    </div>
                </div>

                {/* Cheapest Day Bar (only when from+to chosen) */}
                {from && to && tripType !== 'multiCity' && (
                    <CheapestDayBar from={from} to={to} onSelectDate={(d) => { setDate(d); }} />
                )}

                {/* ─── Results ─────────────────────────────────────────── */}
                <div ref={resultsRef}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                {searched ? 'Search Results' : 'Popular Flights'}
                            </h2>
                            {resultMsg && (
                                <p style={{ color: '#818cf8', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 600 }}>{resultMsg}</p>
                            )}
                        </div>
                        {results.length > 0 && (
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[{ id: 'price', label: 'Cheapest' }, { id: 'duration', label: 'Non-stop first' }, { id: 'departure', label: 'Earliest' }].map(s => (
                                    <button key={s.id} onClick={() => setSortBy(s.id)} style={{
                                        padding: '7px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                                        background: sortBy === s.id ? 'rgba(129,140,248,0.2)' : 'rgba(255,255,255,0.05)',
                                        color: sortBy === s.id ? '#818cf8' : '#94a3b8',
                                        outline: sortBy === s.id ? '1px solid rgba(129,140,248,0.4)' : 'none'
                                    }}>{s.label}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'spin 1s linear infinite' }}>✈️</div>
                            <p style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.1rem' }}>Searching for the best fares…</p>
                            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : sortedResults.length === 0 && searched ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                            <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No flights found</p>
                            <p style={{ color: '#64748b' }}>Try a different route, date, or remove class filter.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {sortedResults.map(flight => (
                                <FlightCard
                                    key={flight._id}
                                    flight={flight}
                                    allFlights={results}
                                    onSelectSeats={(selected) => setSelectedFlight({
                                        ...selected,
                                        selectedClassType: classType || selected.features?.class || 'Economy'
                                    })}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Offers */}
            <Offers type="flight" />

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginTop: 40 }}>
                    {[
                        { icon: <Shield size={20} color="#818cf8" />, title: 'Secure Booking', desc: 'PCI-compliant payment' },
                        { icon: <Gift size={20} color="#4ade80" />, title: 'Best Price Guarantee', desc: 'We match any fare' },
                        { icon: <Clock size={20} color="#fbbf24" />, title: '24/7 Support', desc: 'Always here for you' },
                        { icon: <CheckCircle2 size={20} color="#f472b6" />, title: 'Free Cancellation', desc: 'On select fares' },
                    ].map((b, i) => (
                        <div key={i} style={{
                            background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12
                        }}>
                            <div style={{ flexShrink: 0 }}>{b.icon}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seat Selection Modal */}
            {selectedFlight && (
                <SeatSelectionModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
            )}
        </div>
    );
};

export default FlightPage;
