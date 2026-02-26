import React, { useState } from 'react';
import { Gift, Users, Share2, DollarSign, TrendingUp, Award, Copy, CheckCircle, Sparkles, UserPlus } from 'lucide-react';
import '../App.css';

const ReferEarnPage = () => {
    const [referralCode, setReferralCode] = useState('TRAVEL2026XYZ');
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (e) => {
        e.preventDefault();
        alert(`Referral link sent to ${email}!`);
        setEmail('');
    };

    const benefits = [
        {
            icon: <DollarSign size={40} />,
            title: '₹500 for You',
            description: 'Earn ₹500 in your wallet for every successful referral'
        },
        {
            icon: <Gift size={40} />,
            title: '₹500 for Friend',
            description: 'Your friend gets ₹500 off on their first booking'
        },
        {
            icon: <TrendingUp size={40} />,
            title: 'Unlimited Earnings',
            description: 'No limit on how many friends you can refer'
        },
        {
            icon: <Award size={40} />,
            title: 'Bonus Rewards',
            description: 'Refer 10+ friends and unlock exclusive travel vouchers'
        }
    ];

    const steps = [
        {
            step: '1',
            title: 'Share Your Code',
            description: 'Copy your unique referral code and share it with friends & family',
            icon: <Share2 size={32} />
        },
        {
            step: '2',
            title: 'Friend Books',
            description: 'Your friend signs up and makes their first booking using your code',
            icon: <UserPlus size={32} />
        },
        {
            step: '3',
            title: 'Both Earn',
            description: 'You get ₹500 in wallet, they get ₹500 off - everyone wins!',
            icon: <Gift size={32} />
        }
    ];

    const stats = [
        { number: '50K+', label: 'Active Referrers' },
        { number: '₹2Cr+', label: 'Rewards Earned' },
        { number: '200K+', label: 'Successful Referrals' },
        { number: '4.9/5', label: 'Program Rating' }
    ];

    const faqs = [
        {
            question: 'How do I get my referral code?',
            answer: 'Your unique referral code is automatically generated when you create an account. You can find it on this page or in your account dashboard.'
        },
        {
            question: 'When will I receive my reward?',
            answer: 'You\'ll receive ₹500 in your TravelGo wallet within 24 hours after your friend completes their first booking.'
        },
        {
            question: 'Is there a limit on referrals?',
            answer: 'No! You can refer unlimited friends and earn ₹500 for each successful referral. Plus, unlock bonus rewards when you hit milestones.'
        },
        {
            question: 'Can I use my wallet balance immediately?',
            answer: 'Yes! Your wallet balance can be used immediately for any booking on TravelGo - flights, hotels, trains, buses, and more.'
        }
    ];

    return (
        <div className="refer-earn-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Users size={80} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        Refer Friends, Earn Rewards
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 30px', lineHeight: '1.8' }}>
                        Share the joy of travel and earn ₹500 for every friend who books with TravelGo
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Sparkles size={20} />
                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Win-Win for Everyone!</span>
                    </div>
                </div>
            </section>

            {/* Referral Code Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 className="section-title">Your Referral Code</h2>
                    <div style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        marginTop: '40px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            color: 'white',
                            marginBottom: '30px'
                        }}>
                            <div style={{ fontSize: '0.9rem', marginBottom: '10px', opacity: 0.9 }}>
                                Your Unique Code
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '3px', marginBottom: '20px' }}>
                                {referralCode}
                            </div>
                            <button
                                onClick={handleCopy}
                                style={{
                                    background: 'white',
                                    color: '#667eea',
                                    padding: '12px 30px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                Share via Email
                            </h3>
                            <form onSubmit={handleShare} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter friend's email"
                                    required
                                    style={{
                                        flex: 1,
                                        padding: '12px 15px',
                                        borderRadius: '10px',
                                        border: '2px solid #e2e8f0',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '12px 25px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Send Invite
                                </button>
                            </form>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            marginTop: '30px'
                        }}>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                border: '2px solid #e2e8f0',
                                background: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: '#2d3748'
                            }}>
                                Share on WhatsApp
                            </button>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                border: '2px solid #e2e8f0',
                                background: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: '#2d3748'
                            }}>
                                Share on Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Program Benefits</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{
                                background: '#f7fafc',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ color: '#667eea', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
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

            {/* How It Works */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">How It Works</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '40px',
                        marginTop: '60px'
                    }}>
                        {steps.map((item, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '30px',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: '800'
                                }}>
                                    {item.step}
                                </div>
                                <div style={{ color: '#667eea', marginBottom: '20px', marginTop: '20px' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7' }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Our Referral Success</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {stats.map((stat, index) => (
                            <div key={index} style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '40px 20px',
                                borderRadius: '16px',
                                textAlign: 'center',
                                color: 'white',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
                                    {stat.number}
                                </div>
                                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div style={{ marginTop: '60px' }}>
                        {faqs.map((faq, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    {faq.question}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7' }}>
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
                        Start Earning Today!
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
                        The more you share, the more you earn. It's that simple!
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            background: 'white',
                            color: '#667eea',
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
                        Share Your Code Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ReferEarnPage;
