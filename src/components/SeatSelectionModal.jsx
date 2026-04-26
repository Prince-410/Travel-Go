import React, { useState, useEffect, useRef } from 'react';
import { X, User, ShieldCheck } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAdminConfig } from '../context/AdminConfigContext';
import '../App.css';
import PaymentModal from './PaymentModal';
import BookingReceipt from './BookingReceipt';
import { useAuth } from '../context/AuthContext';

const SeatSelectionModal = ({ flight, onClose }) => {
    const { showToast, showConfirm } = useUI();
    const { bookingCards } = useAdminConfig();
    const liveFlight = bookingCards.find(card => card._id === flight._id) || flight;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const selectedSeatsRef = useRef([]);
    const { authFetch, user } = useAuth();
    const [viewport, setViewport] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1280,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    useEffect(() => {
        const onResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isTabletOrSmaller = viewport.width < 1024;
    const isMobile = viewport.width < 768;

    // Fallback default seat map if admin hasn't defined one
    const defaultSeatMap = Array.from({ length: 10 }, (_, i) => [
        `${i + 1}A`, `${i + 1}B`, `${i + 1}C`, `${i + 1}D`, `${i + 1}E`, `${i + 1}F`
    ]);
    const seatMap = (liveFlight.seatMap && liveFlight.seatMap.length > 0) ? liveFlight.seatMap : defaultSeatMap;

    // Check if deadline is gone or flight is running
    const isDeadlinePassed = () => {
        const departureTime = liveFlight.startTime || liveFlight.time;
        if (!liveFlight.date || !departureTime) return false;
        try {
            const [h, m] = departureTime.split(':');
            const [minutes, ampm] = m.split(' ');
            let hour = parseInt(h);
            if (ampm?.toLowerCase() === 'pm' && hour < 12) hour += 12;
            if (ampm?.toLowerCase() === 'am' && hour === 12) hour = 0;

            const departure = new Date(liveFlight.date);
            departure.setHours(hour, parseInt(minutes), 0, 0);
            return new Date() > departure;
        } catch (e) { return false; }
    };

    const isLocked = isDeadlinePassed() || liveFlight.status === 'inactive' || liveFlight.status === 'sold_out';

    // Real-time unavailable seats from the Global Context (updated via WebSocket)
    const unavailable = [...new Set([...(liveFlight.lockedSeats || []), ...(liveFlight.occupiedSeats || [])])];

    useEffect(() => {
        selectedSeatsRef.current = selectedSeats;
    }, [selectedSeats]);

    const releaseSeats = async (seatIds) => {
        const normalizedSeatIds = [...new Set((seatIds || []).filter(Boolean))];
        if (normalizedSeatIds.length === 0) return;

        try {
            await fetch(`/api/admin/cards/${liveFlight._id}/unlock-seat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatIds: normalizedSeatIds })
            });
        } catch (err) {
            console.error('Failed to unlock seats', err);
        }
    };

    useEffect(() => () => {
        if (selectedSeatsRef.current.length > 0) {
            releaseSeats(selectedSeatsRef.current);
        }
    }, [liveFlight._id]);

    const toggleSeat = async (seatId) => {
        if (unavailable.includes(seatId) && !selectedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            // Locally deselect
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
            releaseSeats([seatId]);
        } else {
            if (selectedSeats.length < 5) {
                // Optimistically select locally
                setSelectedSeats(prev => [...prev, seatId]);

                // Emit to backend to lock globally across all active users
                try {
                    const res = await fetch(`/api/admin/cards/${liveFlight._id}/lock-seat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ seatId })
                    });
                    if (!res.ok) {
                        const errData = await res.json();
                        showToast(`Failed to lock seat: ${errData.message}`, 'error');
                        // Revert local optimistic update
                        setSelectedSeats(prev => prev.filter(s => s !== seatId));
                    }
                } catch (err) {
                    console.error('Failed to lock seat', err);
                    setSelectedSeats(prev => prev.filter(s => s !== seatId));
                }
            } else {
                showToast('Maximum 5 seats can be selected at once.', 'warning');
            }
        }
    };

    // Handle body scroll lock
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    return (
        <>
            <div className="premium-modal-overlay" onClick={onClose} />
            <div className="premium-modal-container">
                <div style={{
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
                    borderRadius: '28px',
                    width: isTabletOrSmaller ? 'min(96vw, 860px)' : 'min(92vw, 850px)',
                    border: '1px solid rgba(167, 139, 250, 0.15)',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(167, 139, 250, 0.1)',
                    display: isTabletOrSmaller ? 'block' : 'flex',
                    overflow: 'hidden',
                    maxHeight: '90vh',
                    animation: 'scaleIn 0.3s ease'
                }}>
                {/* Left Side: Seat Map */}
                <div style={{
                    flex: 1,
                    padding: isMobile ? '18px' : '28px',
                    borderRight: isTabletOrSmaller ? 'none' : '1px solid rgba(167, 139, 250, 0.1)',
                    background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23a78bfa\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                    overflowY: 'auto',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Select your seats</h3>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: 14, height: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 }}></div> Available
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: 14, height: 14, background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', borderRadius: 4, boxShadow: '0 0 8px rgba(167,139,250,0.5)' }}></div> Selected
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: 14, height: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}></div> Unavailable
                            </span>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(167, 139, 250, 0.08)',
                        borderRadius: '60px 60px 30px 30px',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        {/* Airplane Nose Graphic */}
                        <div style={{ position: 'relative', width: '120px', height: '90px', marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'rgba(167,139,250,0.05)', stroke: 'rgba(167,139,250,0.2)', strokeWidth: 2 }}>
                                <path d="M10,100 C10,40 40,10 50,10 C60,10 90,40 90,100" />
                                {/* Cockpit Window */}
                                <path d="M35,60 C35,40 45,30 50,30 C55,30 65,40 65,60 C65,65 35,65 35,60" fill="rgba(255,255,255,0.05)" stroke="rgba(167,139,250,0.3)" />
                            </svg>
                            <div style={{ position: 'absolute', bottom: -5, fontSize: '0.65rem', color: '#a78bfa', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Cockpit</div>
                        </div>

                        {!isLocked ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                {seatMap.map((rowArr, rIdx) => (
                                    <div key={rIdx} style={{ display: 'flex', gap: isMobile ? '12px' : '30px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {rowArr.slice(0, Math.ceil(rowArr.length / 2)).map((seatId) => {
                                                const isAvail = !unavailable.includes(seatId);
                                                const isSel = selectedSeats.includes(seatId);
                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => toggleSeat(seatId)}
                                                        onMouseEnter={(e) => { if (isAvail && !isSel) e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                                        style={{
                                                            width: '42px', height: '46px', borderRadius: '12px 12px 6px 6px',
                                                            background: isSel ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : (isAvail ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'),
                                                            border: isSel ? '1px solid #c0a8d1' : (isAvail ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent'),
                                                            cursor: isAvail ? 'pointer' : 'not-allowed',
                                                            color: isSel ? '#fff' : (isAvail ? '#cbd5e1' : 'transparent'),
                                                            display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 800
                                                        }}
                                                    >
                                                        {isSel ? <User size={16} /> : (isAvail ? seatId : '')}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <div style={{ width: '28px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>{rIdx + 1}</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {rowArr.slice(Math.ceil(rowArr.length / 2)).map((seatId) => {
                                                const isAvail = !unavailable.includes(seatId);
                                                const isSel = selectedSeats.includes(seatId);
                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => toggleSeat(seatId)}
                                                        onMouseEnter={(e) => { if (isAvail && !isSel) e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                                        style={{
                                                            width: '42px', height: '46px', borderRadius: '12px 12px 6px 6px',
                                                            background: isSel ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : (isAvail ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'),
                                                            border: isSel ? '1px solid #c0a8d1' : (isAvail ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent'),
                                                            cursor: isAvail ? 'pointer' : 'not-allowed',
                                                            color: isSel ? '#fff' : (isAvail ? '#cbd5e1' : 'transparent'),
                                                            display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 800
                                                        }}
                                                    >
                                                        {isSel ? <User size={16} /> : (isAvail ? seatId : '')}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* THE "ADMIN DECIDES" STATE - SHOWS WHEN DEADLINE GONE OR RUNNING */
                            <div style={{
                                padding: '60px 40px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out',
                                background: 'rgba(15,23,42,0.4)', borderRadius: '24px', border: '1px solid rgba(248,113,113,0.2)',
                                maxWidth: '350px'
                            }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: 20, animation: 'pulse 2s infinite' }}>⏳</div>
                                <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.4rem', marginBottom: 12 }}>Booking Closed</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
                                    The deadline for this journey has passed or the vehicle is currently in transit. Online bookings are now restricted.
                                </p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                                    background: 'rgba(248,113,113,0.05)', borderRadius: 12, border: '1px solid rgba(248,113,113,0.1)'
                                }}>
                                    <ShieldCheck size={18} color="#f87171" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f87171', textTransform: 'uppercase' }}>Deadline Reached</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div style={{
                    width: isTabletOrSmaller ? '100%' : '340px',
                    padding: isMobile ? '18px' : '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.02)',
                    borderTop: isTabletOrSmaller ? '1px solid rgba(167, 139, 250, 0.1)' : 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                        <button onClick={onClose} style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <h4 style={{ color: '#a78bfa', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Journey Details</h4>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 800 }}>{liveFlight.airline || 'Flight'} {liveFlight.flightNumber}</h2>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
                            {liveFlight.source?.city || liveFlight.source} <span style={{ color: '#64748b', margin: '0 4px' }}>→</span> {liveFlight.destination?.city || liveFlight.destination}
                        </p>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#a78bfa', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '16px', fontWeight: 700 }}>
                            Selected Seats ({selectedSeats.length}/5)
                        </h4>
                        {selectedSeats.length === 0 ? (
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                                    No seats selected yet. Click on the map to choose.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedSeats.map(seat => (
                                    <div key={seat} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        background: 'rgba(167,139,250,0.08)',
                                        border: '1px solid rgba(167,139,250,0.2)',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>Seat {seat}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, background: 'rgba(167,139,250,0.1)', padding: '4px 10px', borderRadius: 20 }}>Standard</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Total Fare</span>
                                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>₹{(liveFlight.price * (selectedSeats.length || 1)).toLocaleString('en-IN')}</span>
                            </div>
                            <button
                                disabled={selectedSeats.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: selectedSeats.length > 0 ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                                    color: selectedSeats.length > 0 ? '#fff' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s',
                                    boxShadow: selectedSeats.length > 0 ? '0 10px 25px rgba(167, 139, 250, 0.4)' : 'none',
                                    transform: selectedSeats.length > 0 ? 'translateY(0)' : 'none'
                                }}
                                onMouseEnter={e => { if (selectedSeats.length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { if (selectedSeats.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}
                                onClick={async () => {
                                    try {
                                        const bookingData = {
                                            userId: user?._id,
                                            type: 'flight',
                                            amount: liveFlight.price * selectedSeats.length,
                                            details: {
                                                cardId: liveFlight._id,
                                                flightId: liveFlight._id,
                                                flightNumber: liveFlight.flightNumber,
                                                airline: liveFlight.airline,
                                                source: liveFlight.source?.city || liveFlight.source,
                                                destination: liveFlight.destination?.city || liveFlight.destination,
                                                departureTime: liveFlight.departureTime || liveFlight.startTime,
                                                passengers: selectedSeats.length,
                                                seatNumbers: selectedSeats
                                            },
                                            status: 'confirmed',
                                            paymentStatus: 'completed'
                                        };

                                        // Use the new instant booking endpoint
                                        const response = await authFetch('/booking', {
                                            method: 'POST',
                                            body: JSON.stringify(bookingData)
                                        });

                                        addLocalBooking(response.booking);
                                        setCurrentBooking(response.booking);
                                        showToast('Booking confirmed successfully!', 'success');
                                        
                                        // Clear selection but don't close yet - let user see receipt
                                        selectedSeatsRef.current = [];
                                        setSelectedSeats([]);
                                    } catch (err) {
                                        console.error('Booking failed:', err);
                                        showToast(err.message || 'Failed to confirm booking', 'error');
                                    }
                                }}
                            >
                                Confirm Reservation
                            </button>
                        </div>
                    </div>
                </div>

                {currentBooking && (
                <BookingReceipt 
                    booking={currentBooking} 
                    onClose={() => {
                        setCurrentBooking(null);
                        onClose();
                    }} 
                />
            )}

            {showPayment && (
                <PaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    amount={liveFlight.price * selectedSeats.length}
                    type="flight"
                    details={{
                        cardId: liveFlight._id,
                        flightId: liveFlight._id,
                        flightNumber: liveFlight.flightNumber,
                        airline: liveFlight.airline,
                        source: liveFlight.source,
                        destination: liveFlight.destination,
                        departureTime: liveFlight.departureTime || liveFlight.startTime,
                        classType: liveFlight.selectedClassType || liveFlight.features?.class || 'Economy',
                        passengers: selectedSeats.length,
                        seatNumbers: selectedSeats
                    }}
                    onSuccess={() => {
                        selectedSeatsRef.current = [];
                        setSelectedSeats([]);
                        onClose();
                    }}
                />
            )}
            </div>
        </>
    );
};

export default SeatSelectionModal;
