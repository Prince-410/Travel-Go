import React, { useState } from 'react';
import { Shield, Plane, Heart, Globe, CheckCircle, AlertCircle, FileText, Phone, Mail, Umbrella } from 'lucide-react';
import '../App.css';

const TravelInsurancePage = () => {
    const [selectedPlan, setSelectedPlan] = useState('comprehensive');

    const plans = [
        {
            id: 'basic',
            name: 'Basic Protection',
            price: '₹299',
            duration: 'per trip',
            color: '#60a5fa',
            features: [
                'Medical emergency cover up to ₹5 Lakhs',
                'Trip cancellation coverage',
                'Lost baggage compensation',
                'Flight delay compensation',
                '24/7 emergency assistance'
            ]
        },
        {
            id: 'comprehensive',
            name: 'Comprehensive',
            price: '₹599',
            duration: 'per trip',
            color: '#f59e0b',
            popular: true,
            features: [
                'Medical emergency cover up to ₹15 Lakhs',
                'Trip cancellation & interruption',
                'Lost/delayed baggage compensation',
                'Flight delay & missed connection',
                'Personal accident cover',
                'Adventure sports coverage',
                '24/7 global assistance'
            ]
        },
        {
            id: 'premium',
            name: 'Premium Elite',
            price: '₹999',
            duration: 'per trip',
            color: '#8b5cf6',
            features: [
                'Medical emergency cover up to ₹50 Lakhs',
                'Complete trip protection',
                'Premium baggage coverage',
                'All flight-related issues',
                'Personal accident & liability',
                'All adventure sports included',
                'Pre-existing condition cover',
                'Priority claims processing',
                'Concierge services'
            ]
        }
    ];

    const benefits = [
        {
            icon: <Heart size={40} />,
            title: 'Medical Coverage',
            description: 'Emergency medical expenses, hospitalization, and evacuation coverage worldwide'
        },
        {
            icon: <Plane size={40} />,
            title: 'Trip Protection',
            description: 'Coverage for trip cancellations, delays, interruptions, and missed connections'
        },
        {
            icon: <Shield size={40} />,
            title: 'Personal Safety',
            description: 'Personal accident, liability, and legal assistance during your travels'
        },
        {
            icon: <Umbrella size={40} />,
            title: 'Baggage Cover',
            description: 'Protection against lost, stolen, or delayed baggage and personal belongings'
        }
    ];

    const coverageDetails = [
        {
            category: 'Medical Emergencies',
            items: [
                'Emergency medical treatment',
                'Hospital admission expenses',
                'Emergency dental treatment',
                'Medical evacuation',
                'Repatriation of remains'
            ]
        },
        {
            category: 'Trip Disruptions',
            items: [
                'Trip cancellation before departure',
                'Trip interruption during travel',
                'Flight delays over 6 hours',
                'Missed connecting flights',
                'Hotel accommodation delays'
            ]
        },
        {
            category: 'Personal Protection',
            items: [
                'Accidental death & disability',
                'Personal liability coverage',
                'Legal assistance abroad',
                'Emergency cash assistance',
                'Document replacement'
            ]
        },
        {
            category: 'Belongings',
            items: [
                'Lost or stolen baggage',
                'Delayed baggage compensation',
                'Passport loss assistance',
                'Personal items coverage',
                'Electronic equipment protection'
            ]
        }
    ];

    const handleBuyNow = (planId) => {
        alert(`Proceeding to purchase ${plans.find(p => p.id === planId).name} plan. You'll be redirected to the application form.`);
    };

    return (
        <div className="travel-insurance-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Shield size={80} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        Travel Insurance
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Travel worry-free with comprehensive insurance coverage.
                        Protect yourself, your trip, and your belongings.
                    </p>
                </div>
            </section>

            {/* Plans Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Choose Your Protection Plan</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {plans.map((plan) => (
                            <div key={plan.id} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '20px',
                                boxShadow: selectedPlan === plan.id ? `0 10px 30px ${plan.color}40` : '0 4px 6px rgba(0,0,0,0.1)',
                                border: selectedPlan === plan.id ? `3px solid ${plan.color}` : '3px solid transparent',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onClick={() => setSelectedPlan(plan.id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        right: '20px',
                                        background: plan.color,
                                        color: 'white',
                                        padding: '5px 20px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700'
                                    }}>
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>
                                    {plan.name}
                                </h3>
                                <div style={{ marginBottom: '30px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: plan.color }}>
                                        {plan.price}
                                    </span>
                                    <span style={{ fontSize: '1rem', color: '#718096', marginLeft: '5px' }}>
                                        {plan.duration}
                                    </span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                                    {plan.features.map((feature, index) => (
                                        <li key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            marginBottom: '15px',
                                            color: '#4a5568'
                                        }}>
                                            <CheckCircle size={20} style={{ color: plan.color, flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{ lineHeight: '1.6' }}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuyNow(plan.id);
                                    }}
                                    style={{
                                        width: '100%',
                                        background: selectedPlan === plan.id
                                            ? `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`
                                            : '#e2e8f0',
                                        color: selectedPlan === plan.id ? 'white' : '#4a5568',
                                        padding: '15px',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedPlan === plan.id) {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {selectedPlan === plan.id ? 'Buy Now' : 'Select Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Why You Need Travel Insurance</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px',
                        marginTop: '60px'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{
                                    color: '#06b6d4',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {benefit.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    {benefit.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7' }}>
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coverage Details */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">What's Covered</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {coverageDetails.map((coverage, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '35px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    marginBottom: '25px',
                                    color: '#2d3748',
                                    borderBottom: '3px solid #06b6d4',
                                    paddingBottom: '10px'
                                }}>
                                    {coverage.category}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {coverage.items.map((item, idx) => (
                                        <li key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            marginBottom: '12px',
                                            color: '#4a5568'
                                        }}>
                                            <CheckCircle size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Important Info */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Important Information</h2>
                    <div style={{
                        background: '#fff7ed',
                        border: '2px solid #fb923c',
                        borderRadius: '16px',
                        padding: '40px',
                        marginTop: '40px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                            <AlertCircle size={24} style={{ color: '#fb923c', flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    Please Note
                                </h3>
                                <ul style={{ color: '#4a5568', lineHeight: '1.8', paddingLeft: '20px' }}>
                                    <li>Insurance must be purchased before trip departure</li>
                                    <li>Coverage begins from the policy start date specified</li>
                                    <li>Pre-existing conditions may require additional premium</li>
                                    <li>Adventure sports coverage available in Comprehensive & Premium plans</li>
                                    <li>Claims must be filed within 30 days of incident</li>
                                    <li>Policy terms and conditions apply</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="section-title">Need Help Choosing?</h2>
                    <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '40px' }}>
                        Our insurance experts are here to help you select the perfect plan
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Phone size={24} style={{ color: '#06b6d4' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Call Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>1800-123-4567</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Mail size={24} style={{ color: '#06b6d4' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Email Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>insurance@travelgo.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
                        Travel with Complete Peace of Mind
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Don't let unexpected events ruin your trip. Get insured today!
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            background: 'white',
                            color: '#06b6d4',
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
                        Get Insured Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TravelInsurancePage;
