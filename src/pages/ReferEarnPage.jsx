import React, { useState } from 'react';
import { Gift, Users, Share2, DollarSign, TrendingUp, Award, Copy, CheckCircle, Sparkles, UserPlus, Send, MessageCircle } from 'lucide-react';
import '../App.css';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const ReferEarnPage = () => {
    const { user, token } = useAuth();
    const { showToast, showConfirm } = useUI();
    const referralCode = user?.referralCode || 'LOGINGENERATING...';
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCopy = () => {
        if (!user) { showToast('Please login to get your referral code.', 'warning'); return; }
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmailInvite = async () => {
        if (!token) { showToast('Please login to invite friends.', 'warning'); return; }
        if (!email) { showToast('Please enter friend\'s email.', 'warning'); return; }
        
        setLoading(true);
        try {
            const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/referral/invite`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ friendEmail: email })
            });

            if (res.ok) {
                showConfirm('Invite Sent', `Official invite sent to ${email}! We'll credit your wallet when they book.`, null, 'alert');
                setEmail('');
            } else {
                showToast('Failed to send invite.', 'error');
            }
        } catch (e) {
            showToast('Service error.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppShare = () => {
        const text = `Hey! Use my referral code ${referralCode} to get ₹500 off on your first TravelGo booking! Register at: http://localhost:5173/register`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleSocialShare = async () => {
        const shareData = {
            title: 'TravelGo Referral',
            text: `Join me on TravelGo! Use code ${referralCode} for ₹500 discount.`,
            url: 'http://localhost:5173/register'
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            showToast('Sharing not supported on this browser. Copy the code instead!', 'warning');
            handleCopy();
        }
    };

    const benefits = [
        { icon: <DollarSign size={28} />, title: '₹500 for You', desc: 'Added to your wallet for each referral.', color: '#4ade80' },
        { icon: <Gift size={28} />, title: '₹500 for Friend', desc: 'Instant discount on their first booking.', color: '#9A7EAE' },
        { icon: <TrendingUp size={28} />, title: 'No Limits', desc: 'Refer as many friends as you like.', color: '#60a5fa' },
        { icon: <Award size={28} />, title: 'Tier Rewards', desc: 'Exclsuive vouchers for top referrers.', color: '#fbbf24' }
    ];

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ 
                        width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(154, 126, 174, 0.1)', 
                        color: '#9A7EAE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' 
                    }}>
                        <Users size={32} />
                    </div>
                    <h1 style={{ 
                        fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Refer Friends, Earn Together</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.8', color: '#94a3b8' }}>
                        Share the joy of travel with your network. Every referral brings you and your friends closer to your next dream destination.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'start' }}>
                    
                    {/* Left: Benefits & Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {benefits.map((b, i) => (
                                <div key={i} style={{ 
                                    background: 'rgba(30, 41, 59, 0.4)', padding: '30px', borderRadius: '24px', 
                                    border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)'
                                }}>
                                    <div style={{ color: b.color, marginBottom: '15px' }}>{b.icon}</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{b.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>{b.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', padding: '40px', borderRadius: '32px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '30px' }}>How It Works</h2>
                            <div style={{ display: 'grid', gap: '30px' }}>
                                {[
                                    { step: '01', title: 'Share Code', desc: 'Copy and send your unique referral code via social media or email.' },
                                    { step: '02', title: 'Friend Joins', desc: 'Your friend signs up and uses the code on their first travel booking.' },
                                    { step: '03', title: 'Earn ₹500', desc: 'After their successful trip, both of you receive ₹500 TravelGo credits.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'rgba(154, 126, 174, 0.4)', fontStyle: 'italic' }}>{s.step}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '5px' }}>{s.title}</h4>
                                            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6' }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Referral Action Card */}
                    <div style={{ 
                        background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)', 
                        borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px',
                        position: 'sticky', top: '100px'
                    }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '35px' }}>Share Your Link</h2>
                        
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Your Unique Referral Code</label>
                            <div style={{ 
                                display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', 
                                borderRadius: '16px', padding: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' 
                            }}>
                                <div style={{ flex: 1, padding: '10px 15px', fontSize: '1.3rem', fontWeight: '900', color: '#9A7EAE', letterSpacing: '2px' }}>{referralCode}</div>
                                <button onClick={handleCopy} style={{ 
                                    padding: '12px 20px', borderRadius: '12px', background: copied ? '#4ade80' : '#9A7EAE', 
                                    color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s'
                                }}>
                                    {copied ? <CheckCircle size={20}/> : <Copy size={20}/>}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Quick Invite via Email</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@email.com"
                                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                                <button onClick={handleEmailInvite} style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#9A7EAE', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <button onClick={handleWhatsAppShare} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <MessageCircle size={20} color="#25D366" /> WhatsApp
                            </button>
                            <button onClick={handleSocialShare} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <Share2 size={20} color="#60a5fa" /> Social
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReferEarnPage;
