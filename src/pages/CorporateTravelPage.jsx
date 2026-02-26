import React, { useState } from 'react';
import { Building2, Users, Globe, Shield, TrendingUp, CheckCircle, Phone, Mail, Briefcase, Award, Clock, DollarSign } from 'lucide-react';
import '../App.css';

const CorporateTravelPage = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employees: '',
        message: ''
    });

    const benefits = [
        {
            icon: <DollarSign size={40} />,
            title: 'Cost Savings',
            description: 'Exclusive corporate rates and volume discounts on flights, hotels, and transportation'
        },
        {
            icon: <Clock size={40} />,
            title: '24/7 Support',
            description: 'Dedicated account manager and round-the-clock assistance for urgent travel needs'
        },
        {
            icon: <Shield size={40} />,
            title: 'Policy Compliance',
            description: 'Automated policy enforcement and approval workflows for seamless travel management'
        },
        {
            icon: <TrendingUp size={40} />,
            title: 'Analytics & Reporting',
            description: 'Comprehensive travel reports and insights to optimize your travel spend'
        },
        {
            icon: <Award size={40} />,
            title: 'Reward Programs',
            description: 'Earn and manage corporate rewards and loyalty points across all bookings'
        },
        {
            icon: <Briefcase size={40} />,
            title: 'Flexible Booking',
            description: 'Easy modifications, cancellations, and last-minute changes with minimal hassle'
        }
    ];

    const features = [
        'Centralized billing and invoicing',
        'Custom travel policies and approval workflows',
        'Real-time booking notifications',
        'Expense management integration',
        'Traveler tracking and duty of care',
        'Multi-city and complex itinerary support',
        'Preferred vendor management',
        'Carbon footprint reporting'
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your interest! Our corporate travel team will contact you within 24 hours.');
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            employees: '',
            message: ''
        });
    };

    return (
        <div className="corporate-travel-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Building2 size={80} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        Corporate Travel Solutions
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Streamline your business travel with our comprehensive corporate solutions.
                        Save time, reduce costs, and enhance employee satisfaction.
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Why Choose Our Corporate Travel Program</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ color: '#3b82f6', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
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

            {/* Features Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Comprehensive Features</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginTop: '60px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                background: '#f7fafc',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e0f2fe';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f7fafc';
                                }}
                            >
                                <CheckCircle size={24} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                <span style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: '500' }}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="section-title">Get Started Today</h2>
                    <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', marginBottom: '40px' }}>
                        Fill out the form below and our corporate travel specialists will contact you within 24 hours
                    </p>
                    <form onSubmit={handleSubmit} style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Contact Person *
                            </label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Number of Employees
                            </label>
                            <select
                                name="employees"
                                value={formData.employees}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Select range</option>
                                <option value="1-50">1-50</option>
                                <option value="51-200">51-200</option>
                                <option value="201-500">201-500</option>
                                <option value="500+">500+</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <button type="submit" style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                            color: 'white',
                            padding: '15px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Request a Consultation
                        </button>
                    </form>
                </div>
            </section>

            {/* Contact Info Section */}
            <section style={{ padding: '60px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', color: '#2d3748' }}>
                        Need Immediate Assistance?
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Phone size={24} style={{ color: '#3b82f6' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Call Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>1800-123-4567</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Mail size={24} style={{ color: '#3b82f6' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Email Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>corporate@travelgo.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CorporateTravelPage;
