import React, { useState, useEffect, useRef } from 'react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { X } from 'lucide-react';

const SeatSelector = ({ bookingCard, onClose, onPayment }) => {
  // Always use the real-time card version from context if available
  const { bookingCards } = useAdminConfig();
  const liveCard = bookingCards.find(c => c._id === bookingCard._id) || bookingCard;

  const [selectedSeat, setSelectedSeat] = useState(null);
  const selectedSeatRef = useRef(null);
  const totalSeats = liveCard.totalSeats || 60;
  const unavailableSeats = new Set([...(liveCard.lockedSeats || []), ...(liveCard.occupiedSeats || [])]);

  // Create a grid mapping
  const columns = liveCard.type === 'flight' ? 6 : liveCard.type === 'bus' ? 4 : 2;
  const rows = Math.ceil(totalSeats / columns);

  const handleSeatClick = async (seatNum) => {
    if (unavailableSeats.has(seatNum)) return;
    if (liveCard.availableSeats <= 0) return; // Full sold out

    if (selectedSeat && selectedSeat !== seatNum) {
      try {
        await fetch(`/api/admin/cards/${liveCard._id}/unlock-seat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatId: selectedSeat })
        });
      } catch (e) {
        console.error('Error unlocking previous seat', e);
      }
    }

    setSelectedSeat(seatNum);
    selectedSeatRef.current = seatNum;

    // Optionally: instantly lock the seat for this user by triggering a backend endpoint
    try {
      await fetch(`/api/admin/cards/${liveCard._id}/lock-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId: seatNum })
      });
    } catch (e) {
      console.error('Error locking seat', e);
    }
  };

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
      if (!selectedSeatRef.current) return;
      fetch(`/api/admin/cards/${liveCard._id}/unlock-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId: selectedSeatRef.current })
      }).catch((e) => console.error('Error unlocking seat', e));
    };
  }, [liveCard._id]);

  return (
    <>
      <div className="premium-modal-overlay" onClick={onClose} />
      <div className="premium-modal-container">
        <div style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', animation: 'scaleIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-color)' }}>Select {liveCard.type === 'hotel' ? 'Room' : 'Seat'}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>{liveCard.title}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 300px' }}>
          <div style={{ padding: '30px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '350px', justifyContent: 'center' }}>
              {Array.from({ length: totalSeats }).map((_, i) => {
                const seatNum = `${Math.floor(i / columns) + 1}${String.fromCharCode(65 + (i % columns))}`;
                const isLocked = unavailableSeats.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                return (
                  <button
                    key={seatNum}
                    onClick={() => handleSeatClick(seatNum)}
                    disabled={isLocked}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isSelected ? 'var(--accent-color)' : isLocked ? '#f87171' : 'var(--bg-color)',
                      color: isSelected ? '#fff' : isLocked ? '#fff' : 'var(--text-color)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      boxShadow: isSelected ? '0 0 15px rgba(154,126,174,0.5)' : 'none'
                    }}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--bg-color)' }}></div> Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: '#f87171' }}></div> Locked
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent-color)' }}></div> Selected
              </div>
            </div>
          </div>
          <div style={{ padding: '30px' }}>
            <h3 style={{ color: 'var(--text-color)', marginTop: 0 }}>Booking Summary</h3>
            {selectedSeat ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Seat / Detail</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>{selectedSeat}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Base Fare</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>₹ {liveCard.price}</span>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={() => onPayment({ ...liveCard, cardId: liveCard._id, selectedSeat, seatNumbers: [selectedSeat], passengers: 1, finalPrice: liveCard.price })}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--accent-color)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                    Proceed to Pay
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-light)', textAlign: 'center', marginTop: '60px' }}>Please select a seat from the map to continue.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatSelector;
