import React, { useState } from 'react';
import { Gift, Heart, CreditCard, Sparkles, Users, Calendar, CheckCircle, ShoppingBag } from 'lucide-react';
import '../App.css';

const GiftCardsPage = () => {
    const [selectedAmount, setSelectedAmount] = useState(5000);
    const [customAmount, setCustomAmount] = useState('');

    const amounts = [1000, 2500, 5000, 10000, 25000, 50000];

    const occasions = [
        { icon: <Heart size={32} />, title: 'Birthdays', color: '#f472b6' },
        { icon: <Users size={32} />, title: 'Anniversaries', color: '#a78bfa' },
        { icon: <Gift size={32} />, title: 'Weddings', color: '#fb923c' },
        { icon: <Sparkles size={32} />, title: 'Festivals', color: '#fbbf24' },
        { icon: <Calendar size={32} />, title: 'Holidays', color: '#34d399' },
        { icon: <ShoppingBag size={32} />, title: 'Corporate Gifts', color: '#60a5fa' }
    ];

    const benefits = [
        'Valid for 12 months from purchase date',
        'Use for flights, hotels, trains, buses & more',
        'No hidden fees or charges',
        'Easy to redeem online',
        'Transferable to friends & family',
        'Balance never expires if used within validity'
    ];

    const handlePurchase = () => {
        const amount = customAmount || selectedAmount;
        alert(`Proceeding to purchase ₹${amount} gift card. You'll be redirected to payment gateway.`);
    };

    return (
        <div className="gift-cards-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Gift size={80} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        Give the Gift of Travel
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Perfect for any occasion. Let your loved ones choose their dream destination.
                    </p>
                </div>
            </section>

            {/* Gift Card Purchase Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title">Choose Your Gift Card Amount</h2>

                    <div style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        marginTop: '40px'
                    }}>
                        {/* Preset Amounts */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '15px',
                            marginBottom: '30px'
                        }}>
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => {
                                        setSelectedAmount(amount);
                                        setCustomAmount('');
                                    }}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: selectedAmount === amount && !customAmount ? '3px solid #f5576c' : '2px solid #e2e8f0',
                                        background: selectedAmount === amount && !customAmount ? '#fff5f7' : 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: '700',
                                        color: selectedAmount === amount && !customAmount ? '#f5576c' : '#2d3748',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedAmount !== amount || customAmount) {
                                            e.currentTarget.style.borderColor = '#f5576c';
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedAmount !== amount || customAmount) {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    ₹{amount.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#2d3748' }}>
                                Or Enter Custom Amount
                            </label>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Enter amount (Min ₹500)"
                                min="500"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '1.1rem'
                                }}
                            />
                        </div>

                        {/* Selected Amount Display */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            color: 'white',
                            marginBottom: '30px'
                        }}>
                            <div style={{ fontSize: '1rem', marginBottom: '10px', opacity: 0.9 }}>
                                Gift Card Value
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: '800' }}>
                                ₹{(customAmount || selectedAmount).toLocaleString()}
                            </div>
                        </div>

                        {/* Purchase Button */}
                        <button
                            onClick={handlePurchase}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                color: 'white',
                                padding: '18px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <CreditCard size={24} />
                            Purchase Gift Card
                        </button>
                    </div>
                </div>
            </section>

            {/* Occasions Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Perfect for Every Occasion</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '25px',
                        marginTop: '60px'
                    }}>
                        {occasions.map((occasion, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '30px 20px',
                                borderRadius: '16px',
                                background: '#f7fafc',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.background = occasion.color + '15';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = '#f7fafc';
                                }}
                            >
                                <div style={{ color: occasion.color, marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                                    {occasion.icon}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2d3748' }}>
                                    {occasion.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Why Choose TravelGo Gift Cards</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        marginTop: '60px'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '25px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <CheckCircle size={24} style={{ color: '#f5576c', flexShrink: 0 }} />
                                <span style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: '500' }}>
                                    {benefit}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">How It Works</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px',
                        marginTop: '60px'
                    }}>
                        {[
                            { step: '1', title: 'Choose Amount', desc: 'Select a preset amount or enter your custom value' },
                            { step: '2', title: 'Make Payment', desc: 'Complete secure payment via card, UPI, or net banking' },
                            { step: '3', title: 'Receive Code', desc: 'Get gift card code instantly via email and SMS' },
                            { step: '4', title: 'Share & Enjoy', desc: 'Gift it to loved ones or use it for your own bookings' }
                        ].map((item, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    margin: '0 auto 20px'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.6' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Sparkles size={60} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
                        Spread Joy with Travel
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Give your loved ones the freedom to explore the world on their terms
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            background: 'white',
                            color: '#f5576c',
                            padding: '15px 50px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            borderRadius: '50px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Buy Gift Card Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default GiftCardsPage;
