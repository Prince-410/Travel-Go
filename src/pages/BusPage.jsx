import React, { useState, useEffect, useRef } from 'react';
import {
    Bus, MapPin, Calendar, Users, ArrowRight, ChevronDown,
    Star, Wifi, Zap, CheckCircle2, X, Navigation, Radio,
    Clock, Shield, Gift, Luggage, Map, AlertCircle, Check, ShieldCheck
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { BOARDING_POINTS } from '../utils/busData';
import { useUI } from '../context/UIContext';
import BookingReceipt from '../components/BookingReceipt';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';

// ─── Accent colour ──────────────────────────────────────────────────────────
const ACC = '#4ade80'; // green accent for buses

// ─── Bus type meta ──────────────────────────────────────────────────────────
const BUS_TYPE_FILTERS = [
    { value: 'all',        label: '🚌 All Buses' },
    { value: 'AC Sleeper', label: '❄️ AC Sleeper' },
    { value: 'Non-AC Sleeper', label: '🛏️ Non-AC Sleeper' },
    { value: 'AC Semi',    label: '💺 AC Semi-Sleeper' },
    { value: 'Volvo',      label: '🏆 Volvo AC' },
    { value: 'Non-AC Seat',label: '🪑 Non-AC Seater' },
];

const AMENITY_ICONS = { AC: '❄️', WiFi: '📶', Sleeper: '🛏️', Charging: '🔌', Blanket: '🛌', Entertainment: '🎬', Volvo: '🏆' };
function amenityIcon(a) {
    for (const [k, v] of Object.entries(AMENITY_ICONS)) if (a.includes(k)) return v;
    return '✓';
}

// ─── City dropdown ──────────────────────────────────────────────────────────
const CityDrop = ({ value, onChange, placeholder, exclude, availableCities }) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const ref = useRef();
    useEffect(() => { const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
    const list = (availableCities || []).filter(c => c !== exclude && c.toLowerCase().includes((q||'').toLowerCase()));
    
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: `1px solid ${open ? ACC : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '10px 14px', transition: 'border-color .2s' }}>
                <MapPin size={15} color={ACC} />
                <span style={{ flex: 1, fontSize: '0.95rem', color: value ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: value ? 600 : 400 }}>{value || placeholder}</span>
                <ChevronDown size={13} color={ACC} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </div>
            {open && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search city..." style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }} />
                    </div>
                    {list.length === 0 && <div style={{ padding: '10px', color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>No active bus routes</div>}
                    {list.map(c => (
                        <div key={c} onClick={() => { onChange(c); setOpen(false); setQ(''); }} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = `rgba(74,222,128,0.1)`}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <MapPin size={12} color={ACC} /><span style={{ fontWeight: 600 }}>{c}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Seat Selection Modal ───────────────────────────────────────────────────
// ─── Seat Selection Modal ───────────────────────────────────────────────────
const BusSeatModal = ({ bus, onClose, setCurrentBooking }) => {
    const { addLocalBooking, authFetch, user } = useAuth();
    const { bookingCards } = useAdminConfig();
    const { showToast } = useUI();
    const liveBus = bookingCards.find(card => card._id === bus._id) || bus;
    const type = liveBus.busType || liveBus.features?.busType || 'Sleeper';
    const isSleeper = type.toLowerCase().includes('sleeper');
    
    // Handle body scroll lock
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    const defaultSeatMap = Array.from({ length: 10 }, (_, i) => [
        `${i + 1}A`, `${i + 1}B`, '', `${i + 1}C`, `${i + 1}D`
    ]);
    const seatMap = (liveBus.seatMap && liveBus.seatMap.length > 0) ? liveBus.seatMap : defaultSeatMap;
    
    const isDeadlinePassed = () => {
        const departureTime = liveBus.departureTime || liveBus.startTime;
        if (!liveBus.date || !departureTime) return false;
        try {
            const [h, m] = departureTime.split(':');
            const [minutes, ampm] = m.split(' ');
            let hour = parseInt(h);
            if (ampm?.toLowerCase() === 'pm' && hour < 12) hour += 12;
            if (ampm?.toLowerCase() === 'am' && hour === 12) hour = 0;
            
            const departure = new Date(liveBus.date);
            departure.setHours(hour, parseInt(minutes), 0, 0);
            return new Date() > departure;
        } catch (e) { return false; }
    };

    const isLocked = isDeadlinePassed() || liveBus.status === 'inactive' || liveBus.status === 'sold_out';

    const [selected, setSelected] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const selectedRef = useRef([]);
    
    const unavailable = [...new Set([...(liveBus.lockedSeats || []), ...(liveBus.occupiedSeats || [])])];
    const booked = new Set(unavailable);

    const releaseSeats = async (seatIds) => {
        const normalizedSeatIds = [...new Set((seatIds || []).filter(Boolean))];
        if (normalizedSeatIds.length === 0) return;

        try {
            await fetch(`/api/admin/cards/${liveBus._id}/unlock-seat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatIds: normalizedSeatIds })
            });
        } catch (err) {
            console.error('Failed to unlock seats', err);
        }
    };

    useEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    useEffect(() => () => {
        if (selectedRef.current.length > 0) {
            releaseSeats(selectedRef.current);
        }
    }, [liveBus._id]);

    const toggle = async (id) => {
        if ((booked.has(id) && !selected.includes(id)) || isLocked) return;
        
        if (selected.includes(id)) {
            setSelected(s => s.filter(x => x !== id));
            releaseSeats([id]);
        } else {
            if (selected.length < 6) {
                setSelected(s => [...s, id]);
                
                try {
                    const res = await fetch(`/api/admin/cards/${liveBus._id}/lock-seat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ seatId: id })
                    });
                    if (!res.ok) {
                        const errData = await res.json();
                        showToast(`Failed to lock seat: ${errData.message}`, 'error');
                        setSelected(prev => prev.filter(s => s !== id));
                    }
                } catch (err) {
                    console.error('Failed to lock seat', err);
                    setSelected(prev => prev.filter(s => s !== id));
                }
            } else {
                showToast('Maximum 6 seats can be selected at once.', 'warning');
            }
        }
    };

    const seatStyle = (id, c) => {
        if (!c) return null;
        const isSel = selected.includes(id), isBooked = booked.has(id);
        return {
            width: isSleeper ? 50 : 38, height: isSleeper ? 24 : 38,
            borderRadius: isSleeper ? 6 : '10px 10px 6px 6px',
            background: isBooked ? 'rgba(255,255,255,0.03)' : isSel ? 'linear-gradient(135deg, #4ade80, #16a34a)' : 'rgba(255,255,255,0.06)',
            border: isBooked ? '1px solid transparent' : isSel ? `1px solid #4ade80` : '1px solid rgba(255,255,255,0.15)',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 800, color: isSel ? '#000' : (isBooked ? 'transparent' : 'rgba(255,255,255,0.7)'),
            transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isSel ? '0 4px 15px rgba(74, 222, 128, 0.4)' : 'none'
        };
    };

    const totalPrice = selected.length * liveBus.price;

    const [bookingLoading, setBookingLoading] = useState(false);
    const handleConfirmBooking = async () => {
        if (selected.length === 0 || bookingLoading) return;
        setBookingLoading(true);
        
        const bookingData = {
            userId: user?._id,
            type: 'bus',
            amount: totalPrice || liveBus.price,
            status: 'confirmed',
            paymentStatus: 'completed',
            details: {
                cardId: liveBus._id,
                busId: liveBus._id,
                operator: liveBus.operator,
                source: liveBus.source,
                destination: liveBus.destination,
                date: liveBus.date,
                busType: liveBus.busType,
                seatNumbers: selected
            }
        };

        try {
            const response = await authFetch('/booking', {
                method: 'POST',
                body: JSON.stringify(bookingData)
            });

            const finalBooking = response.booking || {
                ...bookingData,
                _id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                invoiceNumber: 'INV-' + Math.floor(100000 + Math.random() * 900000),
                createdAt: new Date().toISOString()
            };

            addLocalBooking(finalBooking);
            onClose();
            setCurrentBooking(finalBooking);
            showToast('Bus booking confirmed!', 'success');
        } catch (err) {
            console.error('Bus booking failed:', err);
            showToast(err.message || 'Failed to book bus', 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <>
            <div className="premium-modal-overlay" onClick={onClose} />
            <div className="premium-modal-container">
                <div style={{ background: 'linear-gradient(145deg, #0b1120 0%, #064e3b 100%)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 28, width: '100%', maxHeight: '90vh', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.8), 0 0 40px rgba(74,222,128,0.1)', animation: 'scaleIn 0.3s ease' }}>
                    {/* Left: Bus diagram */}
                    <div style={{ flex: 1, padding: 36, overflowY: 'auto', borderRight: '1px solid rgba(74,222,128,0.1)', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234ade80\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Choose Your Seats</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{liveBus.operator} · {liveBus.busType}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 25, fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.15)` }} /> Available
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'linear-gradient(135deg, #4ade80, #16a34a)', boxShadow: '0 0 8px rgba(74,222,128,0.5)' }} /> Selected
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} /> Booked
                            </span>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '60px 60px 30px 30px', padding: '40px 20px 30px', border: '1px solid rgba(74,222,128,0.08)', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.3)', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '40px', marginBottom: 30 }}>
                                <div style={{ width: 40, height: 40, border: '2px solid rgba(74,222,128,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,0.05)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>👨‍✈️</span>
                                </div>
                            </div>
                            {!isLocked ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                                    {seatMap.map((rowArr, rIdx) => (
                                        <div key={rIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <span style={{ width: 18, fontSize: '0.65rem', color: '#64748b', textAlign: 'right', fontWeight: 800 }}>{rIdx + 1}</span>
                                            {rowArr.map((seatId, cIdx) => (
                                                seatId === '' ? <div key={cIdx} style={{ width: 38 }} /> : (
                                                    <div 
                                                        key={seatId} 
                                                        onClick={() => toggle(seatId)} 
                                                        style={{
                                                            ...seatStyle(seatId, true),
                                                            background: selected.includes(seatId) ? 'linear-gradient(135deg, #4ade80, #16a34a)' : (booked.has(seatId) ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'),
                                                            border: selected.includes(seatId) ? '1px solid #4ade80' : (booked.has(seatId) ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)'),
                                                            transform: selected.includes(seatId) ? 'scale(1.05)' : 'none',
                                                            boxShadow: selected.includes(seatId) ? '0 0 15px rgba(74,222,128,0.3)' : 'none',
                                                            width: 40, height: 40,
                                                            cursor: (booked.has(seatId) || isLocked) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {selected.includes(seatId) ? <Check size={14} color="#000" strokeWidth={3} /> : (booked.has(seatId) ? '' : seatId)}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(248,113,113,0.2)', maxWidth: '350px', margin: '0 auto' }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>⏳</div>
                                    <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem', marginBottom: 12 }}>Booking Closed</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>This journey has already commenced or the booking window has closed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right: Summary */}
                    <div style={{ width: 340, padding: 36, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                            <button onClick={onClose} style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ marginBottom: 30 }}>
                            <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Journey Details</div>
                            <div style={{ fontWeight: 800, fontSize: '1.4rem', margin: '0 0 4px 0', color: '#fff' }}>{liveBus.source} → {liveBus.destination}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{liveBus.date} · {liveBus.startTime || liveBus.departureTime || liveBus.time}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Selected Seats ({selected.length}/6)</div>
                            {selected.length === 0 ? (
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>No seats selected yet.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {selected.map(s => (
                                        <div key={s} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 10, padding: '8px 16px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{s}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Fare</span>
                                <span style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem' }}>₹{(totalPrice || liveBus.price).toLocaleString('en-IN')}</span>
                            </div>
                            <button disabled={selected.length === 0 || bookingLoading}
                                onClick={handleConfirmBooking}
                                style={{ width: '100%', padding: '16px', background: (selected.length > 0 && !bookingLoading) ? `linear-gradient(135deg,${ACC},#16a34a)` : 'rgba(255,255,255,0.05)', color: (selected.length > 0 && !bookingLoading) ? '#000' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1.05rem', cursor: (selected.length > 0 && !bookingLoading) ? 'pointer' : 'not-allowed' }}>
                                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Live Tracking Modal ────────────────────────────────────────────────────
const LiveTrackModal = ({ bus, onClose }) => {
    const [progress, setProgress] = useState(22);
    
    // Handle body scroll lock
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    useEffect(() => { const t = setInterval(() => setProgress(p => Math.min(p + 1, 98)), 800); return () => clearInterval(t); }, []);
    return (
        <>
            <div className="premium-modal-overlay" onClick={onClose} />
            <div className="premium-modal-container">
                <div style={{ background: 'linear-gradient(135deg,#0b1120,#021008)', border: `1px solid rgba(74,222,128,0.25)`, borderRadius: 24, width: '100%', padding: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', animation: 'scaleIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: ACC }} /><span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Live Tracking</span></div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                    </div>
                    <div style={{ background: 'rgba(74,222,128,0.06)', border: `1px solid rgba(74,222,128,0.15)`, borderRadius: 14, padding: '14px 18px', marginBottom: 24 }}>
                        <div style={{ fontWeight: 800 }}>{bus.operator}</div>
                        <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{bus.source} → {bus.destination}</div>
                    </div>
                    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${ACC},#16a34a)`, borderRadius: 4 }} />
                    </div>
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Estimated Arrival: {bus.arrivalTime}</p>
                </div>
            </div>
        </>
    );
};

// ─── Boarding Point Modal ───────────────────────────────────────────────────
const BoardingModal = ({ bus, onClose }) => {
    // Handle body scroll lock
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    const bps = (BOARDING_POINTS && BOARDING_POINTS[bus.source]) || [bus.boardingPoint || bus.source + ' Bus Stand'];
    return (
        <>
            <div className="premium-modal-overlay" onClick={onClose} />
            <div className="premium-modal-container">
                <div style={{ background: 'linear-gradient(135deg,#0c1a1a,#0b1120)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 24, width: '100%', padding: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', animation: 'scaleIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Map size={20} color={ACC} /><span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Boarding Points</span></div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                    </div>
                    {bps.map(bp => (
                        <div key={bp} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{bp}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// ─── Bus Card ───
const BusCard = ({ bus, onBook, onTrack, onBoarding }) => {
    const [exp, setExp] = useState(false);
    return (
        <div style={{ background: 'linear-gradient(135deg, #06110a 0%, #0d1e14 100%)', border: `1px solid rgba(74,222,128,0.15)`, borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 140 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{bus.operator}</div>
                    <div style={{ fontSize: '0.72rem', color: ACC, fontWeight: 700 }}>{bus.busType}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{bus.startTime || bus.time}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{bus.source}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}><ArrowRight size={14} color={ACC} /></div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{bus.arrivalTime}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{bus.destination}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: ACC }}>₹{bus.price.toLocaleString('en-IN')}</div>
                    <button onClick={() => onBook(bus)} style={{ background: `linear-gradient(135deg,${ACC},#16a34a)`, color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 800, cursor: 'pointer', marginTop: 6 }}>Book</button>
                </div>
            </div>
            <div style={{ padding: '0 20px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setExp(!exp)} style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px 0', fontSize: '0.72rem', fontWeight: 700 }}>{exp ? 'Hide Details' : 'View Details'}</button>
                {exp && (
                    <div style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
                        <button onClick={() => onBoarding(bus)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, padding: 8, color: '#94a3b8', fontSize: '0.72rem', cursor: 'pointer' }}>Boarding Points</button>
                        <button onClick={() => onTrack(bus)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, padding: 8, color: '#94a3b8', fontSize: '0.72rem', cursor: 'pointer' }}>Live Track</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main BusPage ───────────────────────────────────────────────────────────
const BusPage = () => {
    const { bookingCards } = useAdminConfig(); 
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [bookingBus, setBookingBus] = useState(null);
    const [trackingBus, setTrackingBus] = useState(null);
    const [boardingBus, setBoardingBus] = useState(null);

    const liveBuses = bookingCards.filter(c => c.type === 'bus' && c.status === 'active');
    const liveCities = [...new Set(liveBuses.map(c => [c.source, c.destination]).flat())].filter(Boolean);

    useEffect(() => {
        setResults(liveBuses);
    }, [bookingCards]);

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const res = liveBuses.filter(c => {
                if (from && c.source.toLowerCase() !== from.toLowerCase()) return false;
                if (to && c.destination.toLowerCase() !== to.toLowerCase()) return false;
                if (date && c.date !== date) return false;
                return true;
            });
            setResults(res);
            setLoading(false);
        }, 300);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: '#030d07', fontFamily: "'Outfit',sans-serif", color: '#fff', paddingBottom: 60 }}>
            <div style={{ position: 'relative', padding: '80px 20px 40px', background: 'linear-gradient(rgba(3, 15, 7, 0.85), rgba(3, 15, 7, 0.85)), url("/images/bus.png")', backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid rgba(74,222,128,0.12)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><Bus size={28} color={ACC} /><span style={{ fontSize: '0.8rem', color: ACC, fontWeight: 700, textTransform: 'uppercase' }}>Bus Booking</span></div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Book Buses</h1>
                </div>
            </div>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                <div style={{ background: 'rgba(15,30,20,0.95)', border: `1px solid rgba(74,222,128,0.18)`, borderRadius: 20, padding: '28px 32px', marginTop: -24, marginBottom: 28 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                        <CityDrop value={from} onChange={setFrom} placeholder="From" availableCities={liveCities} />
                        <CityDrop value={to} onChange={setTo} placeholder="To" availableCities={liveCities} />
                        <ModernDatePicker value={date} onChange={setDate} placeholder="Date" accentColor={ACC} />
                        <button onClick={handleSearch} style={{ background: `linear-gradient(135deg,${ACC},#16a34a)`, color: '#000', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 800, cursor: 'pointer' }}>Search</button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {results.map(bus => <BusCard key={bus._id} bus={bus} onBook={setBookingBus} onTrack={setTrackingBus} onBoarding={setBoardingBus} />)}
                </div>
                <Offers type="bus" />
            </div>
            {bookingBus  && <BusSeatModal bus={bookingBus} onClose={() => setBookingBus(null)} setCurrentBooking={setCurrentBooking} />}
            {trackingBus && <LiveTrackModal bus={trackingBus} onClose={() => setTrackingBus(null)} />}
            {boardingBus && <BoardingModal bus={boardingBus} onClose={() => setBoardingBus(null)} />}
            {currentBooking && <BookingReceipt booking={currentBooking} onClose={() => setCurrentBooking(null)} />}
        </div>
    );
};
export default BusPage;
