import React, { useState } from 'react';
import { Building2, Users, Globe, Shield, TrendingUp, CheckCircle, Phone, Mail, Briefcase, Award, Clock, DollarSign, Send } from 'lucide-react';
import { useUI } from '../context/UIContext';
import '../App.css';

const CorporateTravelPage = () => {
    const { showToast, showConfirm } = useUI();
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employees: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const benefits = [
        {
            icon: <DollarSign size={32} />,
            title: 'Cost Savings',
            description: 'Exclusive corporate rates and volume discounts on flights, hotels, and transportation.',
            color: '#4ade80'
        },
        {
            icon: <Clock size={32} />,
            title: '24/7 Priority Support',
            description: 'Dedicated account manager and round-the-clock assistance for urgent travel changes.',
            color: '#60a5fa'
        },
        {
            icon: <Shield size={32} />,
            title: 'Policy Compliance',
            description: 'Automated policy enforcement and approval workflows for seamless management.',
            color: '#f87171'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Spend Analytics',
            description: 'Comprehensive travel reports and insights to optimize your company travel spend.',
            color: '#9A7EAE'
        }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.contactPerson,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.companyName,
                    employees: formData.employees,
                    message: formData.message,
                    subject: 'Corporate Demo Request',
                    type: 'corporate'
                })
            });
            if (response.ok) {
                showConfirm('Inquiry Submitted', 'Thank you! Our corporate team will reach out within 24 hours.', null, 'alert');
                setFormData({ companyName: '', contactPerson: '', email: '', phone: '', employees: '', message: '' });
            } else {
                const d = await response.json();
                showToast(`Submission failed: ${d.message || 'Please try again.'}`, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred. Please try again later.', 'error');
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
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '20px', 
                        background: 'rgba(154, 126, 174, 0.1)', 
                        color: '#9A7EAE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px'
                    }}>
                        <Building2 size={40} />
                    </div>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Corporate Travel Solutions
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Empower your business with high-performance travel management. Reduce costs, streamline approvals, and enhance traveler safety.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Benefits Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                    gap: '30px', 
                    marginBottom: '80px' 
                }}>
                    {benefits.map((benefit, index) => (
                        <div key={index} style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(12px)',
                            padding: '40px 30px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            textAlign: 'center'
                        }}>
                            <div style={{ color: benefit.color, marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                {benefit.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px', color: '#fff' }}>{benefit.title}</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content & Form */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1.2fr', 
                    gap: '60px',
                    alignItems: 'start'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', marginBottom: '20px' }}>Excellence in Enterprise Travel</h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                                Our platform integrates seamlessly with your enterprise systems to provide a unified travel experience for all employees.
                            </p>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {[
                                    'Centralized billing and automated invoicing',
                                    'Custom travel policies & approval workflows',
                                    'Real-time traveler tracking and duty of care',
                                    'Exclusive Negotiated Corporate Rates'
                                ].map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <CheckCircle size={22} color="#4ade80" />
                                        <span style={{ fontSize: '1.05rem', color: '#cbd5e1', fontWeight: '600' }}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: '24px', 
                            padding: '30px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)' 
                        }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    borderRadius: '12px', 
                                    background: 'rgba(129, 140, 248, 0.1)', 
                                    color: '#818cf8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontWeight: '800', marginBottom: '8px' }}>Global Recognition</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        Voted "Best Managed Travel Partner 2025" by Enterprise World Expo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ 
                        background: 'rgba(30, 41, 59, 0.3)', 
                        backdropFilter: 'blur(12px)', 
                        borderRadius: '32px', 
                        padding: '50px', 
                        border: '1px solid rgba(255, 255, 255, 0.08)' 
                    }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '30px' }}>Request a Demo</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Enterprise Inc."
                                    style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Contact Person</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required placeholder="John Doe"
                                        style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Employees</label>
                                    <select name="employees" value={formData.employees} onChange={handleInputChange} 
                                        style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                                        <option value="">Range</option>
                                        <option value="1-50">1-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="200+">200+</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Work Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@company.com"
                                        style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91..."
                                        style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{ 
                                padding: '18px', borderRadius: '14px', background: 'linear-gradient(to right, #9A7EAE, #7c3aed)', 
                                color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', marginTop: '10px' 
                            }}>
                                {loading ? 'Submitting...' : 'Request Consultation'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CorporateTravelPage;
