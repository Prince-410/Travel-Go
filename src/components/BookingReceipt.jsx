import React, { useMemo } from 'react';
import { X, CheckCircle2, Plane, Calendar, Clock, MapPin, User, CreditCard, Download, Printer } from 'lucide-react';

const BookingReceipt = ({ booking, onClose }) => {
    if (!booking) return null;

    const snapshot = useMemo(() => {
        const createdAt = new Date(booking.createdAt || Date.now());
        const bookingDate = booking.bookingDate || createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const bookingTime = booking.bookingTime || createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const seats = booking.seats?.length ? booking.seats : (booking.details?.seatNumbers || []);
        const totalAmount = Number(booking.totalAmount ?? booking.amount ?? 0);
        const tax = Number(booking.tax ?? Math.round(totalAmount * 0.05));
        const extraCharges = Number(booking.extraCharges ?? 0);
        const finalAmount = Number(booking.finalAmount ?? totalAmount + tax + extraCharges);
        const units = seats.length || Number(booking.details?.passengers || 1);
        const pricePerSeat = Number(booking.pricePerSeat ?? Math.round(totalAmount / Math.max(units, 1)));
        return {
            bookingId: booking.bookingId || booking._id || 'N/A',
            type: booking.type || 'flight',
            source: booking.source || booking.details?.source || '—',
            destination: booking.destination || booking.details?.destination || '—',
            journeyDate: booking.journeyDate || booking.details?.date || booking.details?.checkIn || '—',
            bookingDate,
            bookingTime,
            seats,
            totalAmount,
            tax,
            extraCharges,
            finalAmount,
            pricePerSeat
        };
    }, [booking]);

    const handlePrint = () => {
        const printContent = document.getElementById('receipt-printable');
        if (!printContent) return;
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>TravelGo Receipt - ${booking.invoiceNumber}</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: #fff; }
                .receipt { max-width: 600px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
                .header h1 { color: #6366f1; font-size: 28px; margin: 0 0 4px; }
                .header p { color: #64748b; margin: 0; }
                .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
                .row .label { color: #64748b; font-weight: 500; }
                .row .value { font-weight: 700; color: #1e293b; }
                .total-row { display: flex; justify-content: space-between; padding: 16px 0; margin-top: 12px; border-top: 2px solid #6366f1; }
                .total-row .label { font-size: 18px; font-weight: 700; color: #1e293b; }
                .total-row .value { font-size: 22px; font-weight: 900; color: #6366f1; }
                .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; }
                .status-pending { background: #fef3c7; color: #92400e; }
                .status-confirmed { background: #d1fae5; color: #065f46; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 13px; }
            </style></head><body>
            <div class="receipt">
                <div class="header"><h1>TravelGo</h1><p>Booking Receipt</p></div>
                <div class="row"><span class="label">Invoice</span><span class="value">${booking.invoiceNumber || 'N/A'}</span></div>
                <div class="row"><span class="label">Booking ID</span><span class="value">${snapshot.bookingId}</span></div>
                <div class="row"><span class="label">Type</span><span class="value">${(snapshot.type || 'flight').toUpperCase()}</span></div>
                <div class="row"><span class="label">Route</span><span class="value">${snapshot.source} → ${snapshot.destination}</span></div>
                <div class="row"><span class="label">Journey Date</span><span class="value">${snapshot.journeyDate}</span></div>
                <div class="row"><span class="label">Booking Date</span><span class="value">${snapshot.bookingDate}</span></div>
                <div class="row"><span class="label">Booking Time</span><span class="value">${snapshot.bookingTime}</span></div>
                <div class="row"><span class="label">Seats</span><span class="value">${(snapshot.seats || []).join(', ') || 'N/A'}</span></div>
                <div class="row"><span class="label">Price / Seat</span><span class="value">₹${snapshot.pricePerSeat.toLocaleString('en-IN')}</span></div>
                <div class="row"><span class="label">Subtotal</span><span class="value">₹${snapshot.totalAmount.toLocaleString('en-IN')}</span></div>
                <div class="row"><span class="label">Tax</span><span class="value">₹${snapshot.tax.toLocaleString('en-IN')}</span></div>
                <div class="row"><span class="label">Extra Charges</span><span class="value">₹${snapshot.extraCharges.toLocaleString('en-IN')}</span></div>
                <div class="total-row"><span class="label">Total Amount</span><span class="value">₹${snapshot.finalAmount.toLocaleString('en-IN')}</span></div>
                <div class="row"><span class="label">Status</span><span class="status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">${(booking.status || 'pending').toUpperCase()}</span></div>
                <div class="row"><span class="label">Payment</span><span class="value">${(booking.paymentStatus || 'pending').toUpperCase()}</span></div>
                <div class="footer"><p>Thank you for booking with TravelGo!</p><p>For support: support@travelgo.com</p></div>
            </div></body></html>
        `);
        win.document.close();
        win.print();
    };

    const statusColor = booking.status === 'confirmed' ? '#4ade80' : booking.status === 'cancelled' ? '#f87171' : '#fbbf24';
    const statusBg = booking.status === 'confirmed' ? 'rgba(74,222,128,0.1)' : booking.status === 'cancelled' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)';

    // Handle body scroll lock
    React.useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    return (
        <>
            <div className="premium-modal-overlay" onClick={onClose} />
            <div className="premium-modal-container">
                <div id="receipt-printable" style={{
                    background: 'linear-gradient(145deg, #0f172a, #1e1b4b)',
                    borderRadius: 24, width: '100%',
                    border: '1px solid rgba(167,139,250,0.2)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(139,92,246,0.08)',
                }}>
                    {/* Success Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #818cf8, #6366f1)', padding: '24px 28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderTopLeftRadius: 24, borderTopRightRadius: 24
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={22} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Booking Submitted!</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>Receipt #{booking.invoiceNumber || snapshot.bookingId}</div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Receipt Body */}
                    <div style={{ padding: '24px 28px' }}>
                        {/* Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <span style={{
                                background: statusBg, color: statusColor, padding: '6px 20px', borderRadius: 20,
                                fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                                border: `1px solid ${statusColor}30`,
                            }}>
                                {booking.status || 'pending'}
                            </span>
                        </div>

                        {/* Details Grid */}
                            {[
                            { icon: <Plane size={15} />, label: 'Service', value: `${(snapshot.type || 'flight').charAt(0).toUpperCase() + (snapshot.type || 'flight').slice(1)} Booking` },
                            { icon: <MapPin size={15} />, label: 'Route', value: `${snapshot.source} → ${snapshot.destination}` },
                            { icon: <Calendar size={15} />, label: 'Journey Date', value: snapshot.journeyDate },
                            { icon: <Calendar size={15} />, label: 'Booking Date', value: snapshot.bookingDate },
                            { icon: <Clock size={15} />, label: 'Booking Time', value: snapshot.bookingTime },
                            { icon: <User size={15} />, label: 'Passengers', value: booking.details?.passengers || 1 },
                            ...(snapshot.seats?.length ? [{ icon: <CreditCard size={15} />, label: 'Seats', value: snapshot.seats.join(', ') }] : []),
                            ...(booking.details?.airline ? [{ icon: <Plane size={15} />, label: 'Airline', value: `${booking.details.airline} ${booking.details.flightNumber || ''}` }] : []),
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ color: '#818cf8' }}>{item.icon}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                                </div>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{item.value}</span>
                            </div>
                        ))}

                        {/* Price Breakdown */}
                        <div style={{ marginTop: 16, background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.12)', borderRadius: 14, padding: '16px 18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Subtotal</span>
                                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>₹{snapshot.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tax</span>
                                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>₹{snapshot.tax.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Extra Charges</span>
                                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>₹{snapshot.extraCharges.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Total Amount</span>
                                <span style={{
                                    fontSize: '1.5rem', fontWeight: 900,
                                    background: 'linear-gradient(135deg, #fff 30%, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>₹{snapshot.finalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            <button onClick={handlePrint} style={{
                                flex: 1, padding: '12px', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 12,
                                background: 'rgba(129,140,248,0.08)', color: '#818cf8', fontWeight: 700, fontSize: '0.88rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.08)'}
                            >
                                <Download size={16} /> Download PDF
                            </button>
                            <button onClick={handlePrint} style={{
                                flex: 1, padding: '12px', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 12,
                                background: 'rgba(129,140,248,0.08)', color: '#818cf8', fontWeight: 700, fontSize: '0.88rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.08)'}
                            >
                                <Printer size={16} /> Print
                            </button>
                            <button onClick={onClose} style={{
                                flex: 2, padding: '12px', border: 'none', borderRadius: 12,
                                background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff',
                                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.35)'; }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingReceipt;
