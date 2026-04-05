import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Shield, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, color: '#818cf8' },
  { id: 'upi', label: 'UPI', icon: <Smartphone size={20} />, color: '#4ade80' },
  { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={20} />, color: '#fbbf24' },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, color: '#f472b6' },
];

const PaymentModal = ({ isOpen, onClose, amount, type, details, onSuccess }) => {
  const { createOrder, verifyPayment, isAuthenticated } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [step, setStep] = useState('select'); // select | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingData, setBookingData] = useState(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setErrorMsg('Please login to make a payment.');
      setStep('error');
      return;
    }

    setStep('processing');
    setErrorMsg('');

    try {
      // Create order on backend
      const orderData = await createOrder(amount, type, details);

      // Load Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TravelGo',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} Booking`,
        order_id: orderData.orderId,
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
          contact: JSON.parse(localStorage.getItem('user') || '{}').phone || '',
        },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            const verifyData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId
            });
            setBookingData(verifyData.booking);
            setStep('success');
            if (onSuccess) onSuccess(verifyData.booking);
          } catch (err) {
            setErrorMsg(err.message);
            setStep('error');
          }
        },
        modal: {
          ondismiss: () => setStep('select')
        }
      };

      // Check if Razorpay is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Simulate payment for demo
        setTimeout(() => {
          setBookingData({
            invoiceNumber: 'TG-' + Date.now().toString(36).toUpperCase(),
            type, details, amount,
            status: 'confirmed',
            paymentStatus: 'completed'
          });
          setStep('success');
          if (onSuccess) onSuccess({ type, details, amount, status: 'confirmed' });
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0c0b1d, #1a1833)',
        border: '1px solid rgba(129,140,248,0.2)', borderRadius: 24,
        width: '100%', maxWidth: 480, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Secure Payment</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={12} /> 256-bit SSL Encrypted
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer', color: '#fff'
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === 'select' && (
            <>
              {/* Amount */}
              <div style={{
                background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
                borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Total Amount</div>
                <div style={{
                  fontSize: '2.2rem', fontWeight: 900, marginTop: 4,
                  background: 'linear-gradient(135deg, #fff 30%, #818cf8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  ₹{amount?.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                  {type?.charAt(0).toUpperCase() + type?.slice(1)} Booking
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Select Payment Method
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {METHODS.map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    style={{
                      background: selectedMethod === m.id ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${selectedMethod === m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'all 0.2s', textAlign: 'left', width: '100%'
                    }}
                    onMouseEnter={e => { if (selectedMethod !== m.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { if (selectedMethod !== m.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <div style={{ color: m.color }}>{m.icon}</div>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', flex: 1 }}>{m.label}</span>
                    {selectedMethod === m.id && <CheckCircle2 size={18} color={m.color} />}
                  </button>
                ))}
              </div>

              {/* Pay Button */}
              <button onClick={handlePayment}
                style={{
                  width: '100%', padding: '14px', border: 'none', borderRadius: 12,
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.4)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}
              >
                Pay ₹{amount?.toLocaleString('en-IN')}
              </button>
            </>
          )}

          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'spin 1s linear infinite' }}>💳</div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: 8 }}>Processing Payment...</p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Please don't close this window</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(74,222,128,0.15)', border: '2px solid #4ade80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', animation: 'popIn 0.3s ease'
              }}>
                <CheckCircle2 size={32} color="#4ade80" />
              </div>
              <p style={{ fontWeight: 800, fontSize: '1.3rem', color: '#4ade80', marginBottom: 8 }}>Payment Successful!</p>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: 20 }}>Your booking has been confirmed</p>

              {bookingData && (
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '14px 18px', textAlign: 'left', marginBottom: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Invoice</span>
                    <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.8rem' }}>{bookingData.invoiceNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Amount</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>₹{amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Status</span>
                    <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.8rem' }}>✅ Confirmed</span>
                  </div>
                </div>
              )}

              <button onClick={onClose}
                style={{
                  width: '100%', padding: '12px', border: 'none', borderRadius: 10,
                  background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer'
                }}>
                Done
              </button>
              <style>{`@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }`}</style>
            </div>
          )}

          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f87171', marginBottom: 8 }}>Payment Failed</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 20 }}>{errorMsg}</p>
              <button onClick={() => setStep('select')}
                style={{
                  padding: '10px 24px', border: 'none', borderRadius: 10,
                  background: 'rgba(129,140,248,0.15)', color: '#818cf8', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer'
                }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
