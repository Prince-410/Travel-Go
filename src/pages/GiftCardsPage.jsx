import React, { useState } from 'react';
import { Gift, Heart, CreditCard, Sparkles, Users, Calendar, CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import '../App.css';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const GiftCardsPage = () => {
    const { user, token } = useAuth();
    const { showToast, showConfirm } = useUI();
    const [selectedAmount, setSelectedAmount] = useState(5000);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const amounts = [1000, 2500, 5000, 10000, 25000, 50000];

    const occasions = [
        { icon: <Heart size={28} />, title: 'Birthdays', color: '#f472b6' },
        { icon: <Users size={28} />, title: 'Anniversaries', color: '#60a5fa' },
        { icon: <Gift size={28} />, title: 'Weddings', color: '#fbbf24' },
        { icon: <Sparkles size={28} />, title: 'Festivals', color: '#a78bfa' },
        { icon: <Calendar size={28} />, title: 'Holidays', color: '#4ade80' },
        { icon: <ShoppingBag size={28} />, title: 'Corporate', color: '#94a3b8' }
    ];

    const handlePurchase = async () => {
        if (!token) {
            showToast('Please login to send a gift card.', 'warning');
            return;
        }

        if (!recipientEmail) { 
            showToast('Please enter recipient email.', 'warning'); 
            return; 
        }
        
        const finalAmount = customAmount || selectedAmount;
        if (finalAmount < 500) {
            showToast('Minimum amount is ₹500', 'warning');
            return;
        }

        setLoading(true);
        try {
            // STEP 1: Still validate user exists (UX)
            const checkRes = await fetch(`http://localhost:5000/api/auth/check/${recipientEmail}`);
            const checkData = await checkRes.json();
            
            if (!checkRes.ok || !checkData.exists) {
                showToast('Receiver email does not exist in our system. Please ask them to register first.', 'error');
                setLoading(false);
                return;
            }

            // STEP 2: Actual Purchase & Credit
            const purchaseRes = await fetch('http://localhost:5000/api/gift-cards/purchase', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipientEmail,
                    amount: finalAmount,
                    message: message || "Enjoy your travel gift!"
                })
            });

            const purchaseData = await purchaseRes.json();
            
            if (purchaseRes.ok) {
                showConfirm('Gift Card Sent', `SUCCESS! ₹${finalAmount} has been credited to ${checkData.name}'s wallet. An official email notification has been sent.`, null, 'alert');
                setRecipientEmail('');
                setMessage('');
                setCustomAmount('');
            } else {
                showToast('Purchase Failed: ' + (purchaseData.message || 'Error occurred'), 'error');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            showToast('Service unavailable. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ 
                        width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(154, 126, 174, 0.1)', 
                        color: '#9A7EAE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' 
                    }}>
                        <Gift size={32} />
                    </div>
                    <h1 style={{ 
                        fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Give the Gift of Travel</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.8', color: '#94a3b8' }}>
                        The perfect gift for explorers. Let your loved ones choose their own adventure with a TravelGo digital gift card.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'start' }}>
                    
                    {/* Left Side: Purchase Card */}
                    <div style={{ 
                        background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)', 
                        borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px' 
                    }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '35px' }}>Configure Your Gift Card</h2>
                        
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Select Amount</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                {amounts.map((amount) => (
                                    <button key={amount} onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                                        style={{ 
                                            padding: '20px', borderRadius: '16px', background: (selectedAmount === amount && !customAmount) ? '#9A7EAE' : 'rgba(255, 255, 255, 0.03)',
                                            color: (selectedAmount === amount && !customAmount) ? '#fff' : '#cbd5e1', border: (selectedAmount === amount && !customAmount) ? '1px solid #9A7EAE' : '1px solid rgba(255, 255, 255, 0.1)',
                                            fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s'
                                        }}>₹{amount.toLocaleString()}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Custom Amount</label>
                            <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }} placeholder="Min ₹500"
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '1.1rem' }} />
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Receiver's Email</label>
                            <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="name@recipient.com"
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '1.1rem' }} />
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Personal Message (Optional)</label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write something sweet..."
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '1rem', height: '100px', resize: 'none' }} />
                        </div>

                        <button onClick={handlePurchase} disabled={loading} style={{ 
                            width: '100%', padding: '20px', borderRadius: '18px', background: 'linear-gradient(to right, #9A7EAE, #7c3aed)', 
                            color: '#fff', border: 'none', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                        }}>
                             {loading ? 'Processing...' : <><CreditCard size={24}/> Pay & Send Gift Card</>}
                        </button>
                    </div>

                    {/* Right Side: Preview & Occasions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #9A7EAE, #4c1d95)', borderRadius: '32px', 
                            padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>TravelGo</div>
                                <Sparkles size={32} color="rgba(255, 255, 255, 0.5)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Gift Card Value</div>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>₹{(Number(customAmount) || selectedAmount).toLocaleString()}</div>
                            </div>
                        </div>

                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)', padding: '35px'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '25px' }}>Perfect For</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {occasions.map((occ, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div style={{ width: '45px', height: '45px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: occ.color }}>
                                            {occ.icon}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>{occ.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', 
                            padding: '30px', border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CheckCircle size={20} />
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                                    Redeemable across all flights, hotels, and holiday packages. No blackout dates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GiftCardsPage;
