import React, { useState } from 'react';
import { Shield, Plane, Heart, Globe, CheckCircle, AlertCircle, FileText, Phone, Mail, Umbrella, ShieldCheck } from 'lucide-react';
import '../App.css';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const TravelInsurancePage = () => {
    const { user, token } = useAuth();
    const { showToast, showConfirm } = useUI();
    const [selectedPlan, setSelectedPlan] = useState('comprehensive');
    const [loading, setLoading] = useState(false);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 299,
            displayPrice: '₹299',
            period: 'per trip',
            color: '#94a3b8',
            features: ['Medical up to ₹5 Lakhs', 'Trip cancellation cover', 'Lost baggage help', '24/7 Support']
        },
        {
            id: 'comprehensive',
            name: 'Comprehensive',
            price: 599,
            displayPrice: '₹599',
            period: 'per trip',
            color: '#9A7EAE',
            popular: true,
            features: ['Medical up to ₹15 Lakhs', 'Accident & Interruption', 'Lost/Delayed Baggage', 'Adventure Sports', 'Global Assistance']
        },
        {
            id: 'premium',
            name: 'Elite Premium',
            price: 999,
            displayPrice: '₹999',
            period: 'per trip',
            color: '#fbbf24',
            features: ['Medical up to ₹50 Lakhs', 'Full Trip Protection', 'Priority Processing', 'Concierge Services', 'No-Questions-Asked Refunds']
        }
    ];

    const benefits = [
        { icon: <Heart size={28} />, title: 'Health First', desc: 'Emergency medical expenses and evacuation coverage.' },
        { icon: <Plane size={28} />, title: 'Trip Guard', desc: 'Protection against cancellations and flight delays.' },
        { icon: <Shield size={28} />, title: 'Safety Net', desc: 'Personal accident and liability coverage.' },
        { icon: <Umbrella size={28} />, title: 'Baggage Care', desc: 'Cover for lost or stolen luggage and passports.' }
    ];

    const handlePurchase = async (plan) => {
        if (!token) { showToast('Please login to buy insurance.', 'warning'); return; }
        
        setLoading(true);
        try {
            const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/insurance/purchase`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: plan.id,
                    planName: plan.name,
                    price: plan.price
                })
            });

            if (res.ok) {
                showConfirm('Insurance Activated', `SUCCESS! Your ${plan.name} plan is now active. Your policy document will be mailed at ${user.email}.`, null, 'alert');
            } else {
                const d = await res.json();
                showToast(`Plan subscription failed: ${d.message || 'Please try again.'}`, 'error');
            }
        } catch (e) {
            showToast('Insurance service is currently offline.', 'error');
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
                        width: '70px', height: '70px', borderRadius: '20px', background: 'rgba(154, 126, 174, 0.1)', 
                        color: '#9A7EAE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' 
                    }}>
                        <ShieldCheck size={36} />
                    </div>
                    <h1 style={{ 
                        fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Worry-Free Adventures</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.8', color: '#94a3b8' }}>
                        Protect your journey with TravelGo's comprehensive insurance. From medical emergencies to flight delays, we've got you covered globally.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Benefits Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {benefits.map((b, i) => (
                        <div key={i} style={{ 
                            background: 'rgba(30, 41, 59, 0.4)', padding: '35px', borderRadius: '24px', 
                            border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', textAlign: 'center'
                        }}>
                            <div style={{ color: '#9A7EAE', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{b.icon}</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>{b.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing Table */}
                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: '50px' }}>Select Your Coverage</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {plans.map((plan) => (
                        <div key={plan.id} style={{
                            background: plan.popular ? 'rgba(154, 126, 174, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '32px',
                            padding: '50px',
                            border: plan.popular ? '2px solid #9A7EAE' : '1px solid rgba(255, 255, 255, 0.08)',
                            position: 'relative',
                            transition: 'transform 0.3s ease'
                        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            {plan.popular && (
                                <div style={{ position: 'absolute', top: '20px', right: '30px', background: '#9A7EAE', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>MOST POPULAR</div>
                            )}
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '35px' }}>
                                <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>{plan.displayPrice}</span>
                                <span style={{ color: '#94a3b8', fontWeight: '700' }}>/{plan.period}</span>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '18px', marginBottom: '40px' }}>
                                {plan.features.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircle size={18} color="#4ade80" />
                                        <span style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '600' }}>{f}</span>
                                    </div>
                                ))}
                            </div>

                             <button onClick={() => handlePurchase(plan)} disabled={loading} style={{ 
                                 width: '100%', padding: '16px', borderRadius: '16px', 
                                 background: plan.popular ? '#9A7EAE' : 'rgba(255, 255, 255, 0.05)', 
                                 color: '#fff', border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', 
                                 fontWeight: '800', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer'
                             }}>{loading ? 'Processing...' : 'Get Insured Now'}</button>
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div style={{ 
                    marginTop: '80px', background: 'rgba(248, 113, 113, 0.05)', 
                    borderRadius: '24px', padding: '35px', border: '1px solid rgba(248, 113, 113, 0.1)',
                    display: 'flex', gap: '25px', alignItems: 'center'
                }}>
                    <div style={{ width: '50px', height: '50px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AlertCircle color="#f87171" size={24} />
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: '800', marginBottom: '5px' }}>Important Policy Detail</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Insurance must be purchased at least 24 hours prior to your trip departure time. Coverage is subject to standard terms and conditions of the underwriting partner.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TravelInsurancePage;
