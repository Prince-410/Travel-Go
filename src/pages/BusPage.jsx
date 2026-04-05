import React, { useState, useEffect, useRef } from 'react';
import {
    Bus, MapPin, Calendar, Users, ArrowRight, ChevronDown,
    Star, Wifi, Zap, CheckCircle2, X, Navigation, Radio,
    Clock, Shield, Gift, Luggage, Map, AlertCircle, Check, ShieldCheck
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { BOARDING_POINTS } from '../utils/busData';
import { useUI } from '../context/UIContext';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import PaymentModal from '../components/PaymentModal';

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
    const list = availableCities.filter(c => c !== exclude && c.toLowerCase().includes(q.toLowerCase()));
    
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
const BusSeatModal = ({ bus, onClose }) => {
    const { bookingCards } = useAdminConfig();
    const { showToast, showConfirm } = useUI();
    const liveBus = bookingCards.find(card => card._id === bus._id) || bus;
    const type = liveBus.busType || liveBus.features?.busType || 'Sleeper';
    const isSleeper = type.toLowerCase().includes('sleeper');
    
    // Fallback default seat map if admin hasn't defined one
    const defaultSeatMap = Array.from({ length: 10 }, (_, i) => [
        `${i + 1}A`, `${i + 1}B`, '', `${i + 1}C`, `${i + 1}D`
    ]);
    const seatMap = (liveBus.seatMap && liveBus.seatMap.length > 0) ? liveBus.seatMap : defaultSeatMap;
    
    // Check if deadline is gone or bus is running
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
    
    // Real-time unavailable seats from the Global Context (updated via WebSocket)
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
                
                // Emit to backend to lock globally across all active users
                try {
                    const res = await fetch(`/api/admin/cards/${liveBus._id}/lock-seat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ seatId: id })
                    });
                    if (!res.ok) {
                        const errData = await res.json();
                        showToast(`Failed to lock seat: ${errData.message}`, 'error');
                        // Revert local optimistic update
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

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ background: 'linear-gradient(145deg, #0b1120 0%, #064e3b 100%)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 28, width: '100%', maxWidth: 860, maxHeight: '92vh', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.8), 0 0 40px rgba(74,222,128,0.1)' }}>
                {/* Left: Bus diagram */}
                <div style={{ flex: 1, padding: 36, overflowY: 'auto', borderRight: '1px solid rgba(74,222,128,0.1)', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234ade80\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Choose Your Seats</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{liveBus.operator} · {liveBus.busType}</p>
                    </div>
                    {/* Legend */}
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
                    {/* Bus frame */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '60px 60px 30px 30px', padding: '40px 20px 30px', border: '1px solid rgba(74,222,128,0.08)', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.3)', position: 'relative' }}>
                        {/* Driver area */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '40px', marginBottom: 30 }}>
                            <div style={{ width: 40, height: 40, border: '2px solid rgba(74,222,128,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,0.05)' }}>
                                <span style={{ fontSize: '1.2rem' }}>👨‍✈️</span>
                            </div>
                        </div>
                        {/* Seat grid */}
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
                                                    onMouseEnter={(e)=>{ if(!selected.includes(seatId) && !booked.has(seatId) && !isLocked) { e.currentTarget.style.transform='scale(1.1) translateY(-2px)'; e.currentTarget.style.borderColor='#4ade80'; } }}
                                                    onMouseLeave={(e)=>{ e.currentTarget.style.transform=selected.includes(seatId) ? 'scale(1.05)' : 'none'; e.currentTarget.style.borderColor=selected.includes(seatId) ? '#4ade80' : (booked.has(seatId) ? 'transparent' : 'rgba(255,255,255,0.15)'); }}
                                                >
                                                    {selected.includes(seatId) ? <Check size={14} color="#000" strokeWidth={3} /> : (booked.has(seatId) ? '' : seatId)}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* THE "ADMIN DECIDES" STATE */
                            <div style={{ padding: '60px 40px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(248,113,113,0.2)', maxWidth: '350px', margin: '0 auto' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: 20, animation: 'pulse 2s infinite' }}>⏳</div>
                                <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem', marginBottom: 12 }}>Booking Closed</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
                                    This journey has already commenced or the booking window has closed. Online selection is restricted.
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(248,113,113,0.05)', borderRadius: 12, border: '1px solid rgba(248,113,113,0.1)' }}>
                                    <ShieldCheck size={18} color="#f87171" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f87171', textTransform: 'uppercase' }}>Deadline Reached</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right: Summary */}
                <div style={{ width: 340, padding: 36, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                        <button onClick={onClose} style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                            onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}><X size={18} /></button>
                    </div>
                    <div style={{ marginBottom: 30 }}>
                        <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Journey Details</div>
                        <div style={{ fontWeight: 800, fontSize: '1.4rem', margin: '0 0 4px 0', color: '#fff' }}>{liveBus.source} <span style={{color: '#64748b', margin: '0 4px'}}>→</span> {liveBus.destination}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>{liveBus.date} · {liveBus.startTime || liveBus.departureTime || liveBus.time} — {liveBus.arrivalTime}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Selected Seats ({selected.length}/6)</div>
                        {selected.length === 0 ? (
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>No seats selected yet. Click on the map to choose.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {selected.map(s => (
                                    <div key={s} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 10, padding: '8px 16px', fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center' }}>
                                        {s}
                                        <span style={{ fontSize: '0.7rem', color: ACC, marginLeft: 8, background: 'rgba(74,222,128,0.15)', padding: '2px 8px', borderRadius: 20 }}>Stnd</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Boarding info */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px', marginTop: 16, marginBottom: 24 }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>BOARDING & DROPPING</div>
                        
                        <div style={{ position: 'relative', paddingLeft: 18 }}>
                            <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}></div>
                            
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, position: 'relative' }}>
                                <div style={{ position: 'absolute', left: -19, top: 4, width: 10, height: 10, borderRadius: '50%', background: ACC, boxShadow: `0 0 6px ${ACC}` }} />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{liveBus.boardingPoint}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pickup Location</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
                                <div style={{ position: 'absolute', left: -19, top: 4, width: 10, height: 10, borderRadius: '50%', background: '#f87171', boxShadow: `0 0 6px #f87171` }} />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{liveBus.droppingPoint}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Drop Location</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Price summary */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Total Fare</span>
                            <span style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem' }}>₹{(totalPrice || liveBus.price).toLocaleString('en-IN')}</span>
                        </div>
                        <button disabled={selected.length === 0}
                            onClick={() => {
                                showConfirm('Booking Requested', `Your seat reservation (${selected.join(', ')}) for ${liveBus.operator} has been received. Our team will contact you shortly to confirm the pickup timing at ${liveBus.boardingPoint}.`, null, 'alert');
                                onClose();
                            }}
                            onMouseEnter={e => { if(selected.length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { if(selected.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}
                            style={{ width: '100%', padding: '16px', background: selected.length > 0 ? `linear-gradient(135deg,${ACC},#16a34a)` : 'rgba(255,255,255,0.05)', color: selected.length > 0 ? '#000' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1.05rem', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', transition: 'all .3s', boxShadow: selected.length > 0 ? '0 10px 25px rgba(74, 222, 128, 0.4)' : 'none', transform: selected.length > 0 ? 'translateY(0)' : 'none' }}>
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    amount={totalPrice}
                    type="bus"
                    details={{
                        cardId: liveBus._id,
                        busId: liveBus._id,
                        operator: liveBus.operator,
                        busType: liveBus.busType,
                        source: liveBus.source,
                        destination: liveBus.destination,
                        departureTime: liveBus.departureTime || liveBus.startTime,
                        arrivalTime: liveBus.arrivalTime,
                        passengers: selected.length,
                        seatNumbers: selected,
                        boardingPoint: liveBus.boardingPoint,
                        droppingPoint: liveBus.droppingPoint
                    }}
                    onSuccess={() => {
                        selectedRef.current = [];
                        setSelected([]);
                        onClose();
                    }}
                />
            )}
        </div>
    );
};

// ─── Live Tracking Modal ────────────────────────────────────────────────────
const LiveTrackModal = ({ bus, onClose }) => {
    const [progress, setProgress] = useState(22);
    useEffect(() => { const t = setInterval(() => setProgress(p => Math.min(p + 1, 98)), 800); return () => clearInterval(t); }, []);
    const stops = [bus.source, 'En-Route Checkpoint', bus.destination];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'linear-gradient(135deg,#0b1120,#021008)', border: `1px solid rgba(74,222,128,0.25)`, borderRadius: 24, width: '100%', maxWidth: 540, padding: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACC, boxShadow: `0 0 8px ${ACC}`, animation: 'pulse 1.5s infinite' }} />
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Live Tracking</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

                {/* Bus info */}
                <div style={{ background: 'rgba(74,222,128,0.06)', border: `1px solid rgba(74,222,128,0.15)`, borderRadius: 14, padding: '14px 18px', marginBottom: 24 }}>
                    <div style={{ fontWeight: 800 }}>{bus.operator}</div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{bus.busType} · {bus.source} → {bus.destination}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: '0.8rem' }}>
                        <span>🕐 Departed: {bus.startTime || bus.departureTime || bus.time}</span>
                        <span>🏁 Arrives: {bus.arrivalTime}</span>
                    </div>
                </div>

                {/* Progress bar route */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        {stops.map((s, i) => (
                            <div key={i} style={{ textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left', flex: 1 }}>
                                <div style={{ fontSize: '0.68rem', color: i === 0 ? ACC : i === 2 ? '#f87171' : '#818cf8', fontWeight: 700 }}>{i === 0 ? '✅ DEPARTED' : i === 2 ? '🏁 ARRIVING' : '📍 EN-ROUTE'}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 2 }}>{s}</div>
                            </div>
                        ))}
                    </div>
                    {/* Track */}
                    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${ACC},#16a34a)`, borderRadius: 4, transition: 'width .8s' }} />
                        {/* Bus icon on track */}
                        <div style={{ position: 'absolute', top: '50%', left: `${progress}%`, transform: 'translate(-50%,-50%)', fontSize: '1rem', transition: 'left .8s' }}>🚌</div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.78rem', color: '#64748b' }}>
                        {progress < 50 ? `~${Math.round((bus.duration ? parseInt(bus.duration) : 5) * (1 - progress / 100))}h remaining` : 'Nearing destination…'}
                    </div>
                </div>

                {/* Map stub */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 0, overflow: 'hidden', height: 160, position: 'relative' }}>
                    {/* Fake map grid */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
                        {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} style={{ position: 'absolute', left: `${i * 14}%`, top: 0, bottom: 0, width: 1, background: '#fff' }} />
                        ))}
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} style={{ position: 'absolute', top: `${i * 17}%`, left: 0, right: 0, height: 1, background: '#fff' }} />
                        ))}
                    </div>
                    {/* Route line */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 160">
                        <path d="M30,130 C100,60 300,100 370,30" stroke={ACC} strokeWidth="2" strokeDasharray="6,3" fill="none" opacity="0.5" />
                        {/* Bus dot */}
                        <circle cx={30 + (370 - 30) * progress / 100} cy={130 - (100) * progress / 100} r="7" fill={ACC} />
                        {/* Start / End markers */}
                        <circle cx="30" cy="130" r="5" fill="#4ade80" />
                        <circle cx="370" cy="30" r="5" fill="#f87171" />
                    </svg>
                    <div style={{ position: 'absolute', bottom: 10, left: 14, fontSize: '0.68rem', color: ACC }}>{bus.source}</div>
                    <div style={{ position: 'absolute', top: 10, right: 14, fontSize: '0.68rem', color: '#f87171' }}>{bus.destination}</div>
                    <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.7rem', color: ACC, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: ACC, animation: 'pulse 1.5s infinite' }} /> LIVE
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Boarding Point Modal ───────────────────────────────────────────────────
const BoardingModal = ({ bus, onClose }) => {
    const bps = (BOARDING_POINTS && BOARDING_POINTS[bus.source]) || [bus.boardingPoint || bus.source + ' Bus Stand'];
    const dps = (BOARDING_POINTS && BOARDING_POINTS[bus.destination]) || [bus.droppingPoint || bus.destination + ' Bus Stand'];
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'linear-gradient(135deg,#0c1a1a,#0b1120)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 24, width: '100%', maxWidth: 560, padding: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Map size={20} color={ACC} /><span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Boarding & Dropping Points</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACC }} /> Boarding — {bus.source}
                        </div>
                        {bps.map(bp => (
                            <div key={bp} style={{ background: bp === bus.boardingPoint ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${bp === bus.boardingPoint ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8, cursor: 'pointer' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: bp === bus.boardingPoint ? ACC : '#e2e8f0' }}>{bp}</div>
                                {bp === bus.boardingPoint && <div style={{ fontSize: '0.68rem', color: ACC, marginTop: 3 }}>✓ Your boarding point</div>}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} /> Dropping — {bus.destination}
                        </div>
                        {dps.map(dp => (
                            <div key={dp} style={{ background: dp === bus.droppingPoint ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${dp === bus.droppingPoint ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: dp === bus.droppingPoint ? '#f87171' : '#e2e8f0' }}>{dp}</div>
                                {dp === bus.droppingPoint && <div style={{ fontSize: '0.68rem', color: '#f87171', marginTop: 3 }}>✓ Your dropping point</div>}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Mini map */}
                <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MapPin size={18} color={ACC} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{bus.features?.boardingPoint || 'Central Bus Station'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>Show on Google Maps · Walk-in allowed till departure</div>
                    </div>
                    <button style={{ marginLeft: 'auto', background: `rgba(74,222,128,0.12)`, border: `1px solid rgba(74,222,128,0.3)`, borderRadius: 8, padding: '7px 14px', color: ACC, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(bus.boardingPoint + ' ' + bus.source)}`, '_blank')}>
                        Open Map ↗
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Bus Card (Dynamic logic injected via Live BookingCard schema) ───
const BusCard = ({ bus, onBook, onTrack, onBoarding }) => {
    const [exp, setExp] = useState(false);
    
    // Safety check fallback
    const operatorName = bus.title.split(' ')[0] || bus.title;
    const busType = bus.features?.busType || 'Volvo AC Sleeper';
    
    // Derived UI states
    const lowSeats = (bus.availableSeats || 0) <= 8;
    const urgency = (bus.availableSeats || 0) <= 3;
    const dp = bus.dynamicPricing ? { label: 'Surge active', icon: 'up', color: '#f87171' } 
               : { label: 'Price stable', icon: 'stable', color: '#cbd5e1' };

    return (
        <div style={{ background: 'linear-gradient(135deg, #06110a 0%, #0d1e14 100%)', border: `1px solid rgba(74,222,128,0.15)`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', transition: 'transform .2s, box-shadow .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,222,128,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; }}>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', flexWrap: 'wrap' }}>
                {bus.dynamicPricing && <span style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(248,113,113,0.25)' }}>⚡ High Demand</span>}
                <span style={{ background: dp.icon === 'up' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)', color: dp.color, fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: `1px solid ${dp.color}30`, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={9} /> {dp.label}
                </span>
                {urgency && <span style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(248,113,113,0.25)' }}>⚠️ Only {bus.availableSeats} left</span>}
            </div>

            {/* Main info */}
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {/* Operator */}
                <div style={{ minWidth: 140 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginBottom: 2 }}>OPERATOR</div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{bus.operator}</div>
                    <div style={{ fontSize: '0.72rem', color: ACC, fontWeight: 700, marginTop: 2 }}>{bus.busType}</div>
                </div>

                {/* Times */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bus.startTime || bus.departureTime || bus.time || '--:--'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 3 }}>{bus.source}</div>
                </div>

                <div style={{ flex: 1, minWidth: 90, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg,${ACC},rgba(74,222,128,0.2))` }} />
                        <Bus size={13} color={ACC} />
                        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg,rgba(74,222,128,0.2),${ACC})` }} />
                    </div>
                    <div style={{ marginTop: 5, fontSize: '0.78rem', fontWeight: 700, color: ACC }}>{bus.duration}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bus.arrivalTime || '--:--'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 3 }}>{bus.destination}</div>
                </div>

                {/* Rating & seats */}
                <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <div style={{ background: (bus.features?.rating || 4.0) >= 4.5 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.12)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 800, color: (bus.features?.rating || 4.0) >= 4.5 ? ACC : '#fbbf24' }}>
                            <Star size={11} fill="currentColor" /> {bus.features?.rating || 4.0}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>rating</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: lowSeats ? '#f87171' : '#64748b', fontWeight: lowSeats ? 700 : 400 }}>
                        {bus.availableSeats} of {bus.totalSeats} seats left
                    </div>
                    {/* Seat fill bar */}
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginTop: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(0, Math.round(((bus.totalSeats - bus.availableSeats) / (bus.totalSeats || 1)) * 100))}%`, background: urgency ? '#f87171' : lowSeats ? '#fbbf24' : ACC, borderRadius: 4 }} />
                    </div>
                </div>

                {/* Price & actions */}
                <div style={{ textAlign: 'right', minWidth: 140 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>STARTS FROM</div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1.1, background: `linear-gradient(135deg,#fff 30%,${ACC})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        ₹{bus.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 8 }}>per seat</div>
                    <button onClick={() => onBook(bus)}
                        style={{ background: `linear-gradient(135deg,${ACC},#16a34a)`, color: '#000', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', transition: 'all .2s', boxShadow: '0 4px 15px rgba(74,222,128,0.3)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,222,128,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(74,222,128,0.3)'; }}>
                        Select Seats <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Amenities */}
            <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {(bus.features?.amenities || ['AC', 'WiFi', 'Sleeper']).map(a => (
                    <span key={a} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {amenityIcon(a)} {a}
                    </span>
                ))}
            </div>

            {/* Expand bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setExp(!exp)}
                    style={{ width: '100%', background: 'none', border: 'none', color: ACC, cursor: 'pointer', padding: '9px 0', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {exp ? 'Hide details' : 'Boarding, tracking & more'}
                    <ChevronDown size={13} style={{ transform: exp ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                {exp && (
                    <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {/* Boarding */}
                        <button onClick={() => onBoarding(bus)} style={{ flex: 1, minWidth: 130, background: 'rgba(74,222,128,0.06)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 10, padding: '12px', cursor: 'pointer', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><MapPin size={13} color={ACC} /><span style={{ fontWeight: 700, fontSize: '0.78rem', color: ACC }}>Boarding Points</span></div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bus.features?.boardingPoint || 'Central Bus Station'}</div>
                        </button>
                        {/* Live tracking */}
                        {bus.features?.isLive || true ? (
                            <button onClick={() => onTrack(bus)} style={{ flex: 1, minWidth: 130, background: 'rgba(74,222,128,0.06)', border: `1px solid rgba(74,222,128,0.2)`, borderRadius: 10, padding: '12px', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACC, animation: 'pulse 1.5s infinite' }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: ACC }}>Live Tracking</span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Track this bus in real time</div>
                            </button>
                        ) : (
                            <div style={{ flex: 1, minWidth: 130, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Radio size={13} color="#64748b" /><span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#64748b' }}>No Live Tracking</span></div>
                                <div style={{ fontSize: '0.72rem', color: '#475569' }}>Not available for this bus</div>
                            </div>
                        )}
                        {/* Cancellation */}
                        <div style={{ flex: 1, minWidth: 160, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Shield size={13} color="#818cf8" /><span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#818cf8' }}>Cancellation</span></div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bus.features?.cancellationPolicy || 'Standard Policy Rules'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main BusPage ───────────────────────────────────────────────────────────
const BusPage = () => {
    const { bookingCards } = useAdminConfig(); // REAL-TIME DB INVENTORY
    const { showToast } = useUI();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [busTypeFilter, setBusTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('price');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState('');
    const [bookingBus, setBookingBus] = useState(null);
    const [trackingBus, setTrackingBus] = useState(null);
    const [boardingBus, setBoardingBus] = useState(null);
    const resultsRef = useRef();

    // NO HARDCODED CITIES — Derived directly from Admin DB actively pushed via WebSocket
    const liveBuses = bookingCards.filter(c => c.type === 'bus' && c.status === 'active');
    const liveCities = [...new Set(liveBuses.map(c => [c.source, c.destination]).flat())].filter(Boolean);

    useEffect(() => {
        if (!searched) {
            setResults(liveBuses);
            setResultMsg(`Showing ${liveBuses.length} dynamic buses from live inventory`);
        }
    }, [bookingCards, searched]);

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const res = liveBuses.filter(c => {
                const bType = c.features?.busType || 'Non-AC'; // Assuming admin adds busType to features
                if (from && c.source.toLowerCase() !== from.toLowerCase()) return false;
                if (to && c.destination.toLowerCase() !== to.toLowerCase()) return false;
                if (date && c.date !== date) return false;
                if (busTypeFilter !== 'all' && !bType.includes(busTypeFilter.split(' ')[0])) return false;
                return true;
            });
            setResults(res);
            setSearched(true);
            setLoading(false);
            const dl = date ? ` on ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : '';
            setResultMsg(`Found ${res.length} live bus${res.length !== 1 ? 'es' : ''}${dl}`);
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }, 300);
    };

    const sorted = [...results].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'seats') return b.availableSeats - a.availableSeats;
        if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
        return 0;
    });

    const swapCities = () => { const t = from; setFrom(to); setTo(t); };

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', fontFamily: "'Outfit',sans-serif", color: '#fff', paddingBottom: 60 }}>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

            {/* Hero */}
            <div style={{ position: 'relative', padding: '80px 20px 40px', background: 'rgba(3, 15, 7, 0.5)', borderBottom: '1px solid rgba(74,222,128,0.12)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -80, left: '25%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(74,222,128,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Bus size={28} color={ACC} />
                        <span style={{ fontSize: '0.8rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Bus Booking</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 8, lineHeight: 1.1 }}>
                        Book Buses at{' '}
                        <span style={{ background: `linear-gradient(135deg,${ACC},#16a34a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lowest Fares</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>Live tracking • Seat selection • 6 Gujarat cities + Mumbai</p>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                {/* Search Card */}
                <div style={{ background: 'rgba(15,30,20,0.95)', backdropFilter: 'blur(20px)', border: `1px solid rgba(74,222,128,0.18)`, borderRadius: 20, padding: '28px 32px', marginTop: -24, marginBottom: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                    {/* Bus type quick filter */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
                        {BUS_TYPE_FILTERS.map(f => (
                            <button key={f.value} onClick={() => setBusTypeFilter(f.value)}
                                style={{ padding: '7px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', transition: 'all .2s', background: busTypeFilter === f.value ? `linear-gradient(135deg,${ACC},#16a34a)` : 'rgba(255,255,255,0.05)', color: busTypeFilter === f.value ? '#000' : '#94a3b8', boxShadow: busTypeFilter === f.value ? '0 4px 14px rgba(74,222,128,0.35)' : 'none' }}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                        <div>
                            <label style={{ fontSize: '0.7rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>From</label>
                            <CityDrop value={from} onChange={setFrom} placeholder="Departure City" exclude={to} availableCities={liveCities} />
                        </div>
                        <button onClick={swapCities} style={{ background: `rgba(74,222,128,0.1)`, border: `1px solid rgba(74,222,128,0.25)`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 2, flexShrink: 0 }}>
                            <ArrowRight size={16} color={ACC} />
                        </button>
                        <div>
                            <label style={{ fontSize: '0.7rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>To</label>
                            <CityDrop value={to} onChange={setTo} placeholder="Destination City" exclude={from} availableCities={liveCities} />
                        </div>
                        <div style={{ zIndex: 100 }}>
                            <label style={{ fontSize: '0.7rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Date</label>
                            <ModernDatePicker value={date} onChange={setDate} placeholder="Select Date" accentColor={ACC} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.7rem', color: ACC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Passengers</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
                                <Users size={15} color={ACC} />
                                <input type="number" min={1} max={9} value={passengers} onChange={e => setPassengers(Number(e.target.value))} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 600, width: 30 }} />
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>seat{passengers > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <button onClick={handleSearch} disabled={loading}
                            style={{ background: `linear-gradient(135deg,${ACC},#16a34a)`, color: '#000', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(74,222,128,0.35)', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(74,222,128,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(74,222,128,0.35)'; }}>
                            {loading ? '⏳ Searching…' : <><Bus size={16} /> Search Buses</>}
                        </button>
                    </div>
                </div>

                {/* Results header */}
                <div ref={resultsRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{searched ? 'Available Buses' : 'Popular Buses'}</h2>
                        {resultMsg && <p style={{ color: ACC, fontSize: '0.82rem', margin: '4px 0 0', fontWeight: 600 }}>{resultMsg}</p>}
                    </div>
                    {results.length > 0 && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[{ id: 'price', l: 'Cheapest' }, { id: 'rating', l: 'Top Rated' }, { id: 'seats', l: 'Most Seats' }, { id: 'departure', l: 'Earliest' }].map(s => (
                                <button key={s.id} onClick={() => setSortBy(s.id)}
                                    style={{ padding: '6px 14px', borderRadius: 50, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', background: sortBy === s.id ? `rgba(74,222,128,0.15)` : 'rgba(255,255,255,0.05)', color: sortBy === s.id ? ACC : '#94a3b8', outline: sortBy === s.id ? `1px solid rgba(74,222,128,0.4)` : 'none' }}>
                                    {s.l}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cards */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚌</div>
                        <p style={{ color: ACC, fontWeight: 700, fontSize: '1.1rem' }}>Finding the best buses…</p>
                    </div>
                ) : sorted.length === 0 && searched ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                        <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No buses found</p>
                        <p style={{ color: '#64748b' }}>Try a different route, date, or remove the bus type filter.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {sorted.map(bus => (
                            <BusCard key={bus._id} bus={bus}
                                onBook={setBookingBus}
                                onTrack={setTrackingBus}
                                onBoarding={setBoardingBus} />
                        ))}
                    </div>
                )}

                {/* Offers */}
                <Offers type="bus" />

                {/* Trust badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginTop: 48 }}>
                    {[
                        { icon: <Shield size={19} color="#818cf8" />, t: 'Secure Booking', d: 'End-to-end encrypted' },
                        { icon: <Navigation size={19} color={ACC} />, t: 'Live GPS Tracking', d: 'Real-time bus location' },
                        { icon: <Gift size={19} color="#f472b6" />, t: 'Best Price', d: 'Guaranteed lowest fare' },
                        { icon: <CheckCircle2 size={19} color="#fbbf24" />, t: 'Cancellation', d: 'Easy refunds' },
                    ].map((b, i) => (
                        <div key={i} style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flexShrink: 0 }}>{b.icon}</div>
                            <div><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{b.t}</div><div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: 2 }}>{b.d}</div></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {bookingBus  && <BusSeatModal    bus={bookingBus}  onClose={() => setBookingBus(null)} />}
            {trackingBus && <LiveTrackModal  bus={trackingBus} onClose={() => setTrackingBus(null)} />}
            {boardingBus && <BoardingModal   bus={boardingBus} onClose={() => setBoardingBus(null)} />}
        </div>
    );
};

export default BusPage;
