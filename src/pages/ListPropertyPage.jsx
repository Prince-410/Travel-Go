import React, { useState } from 'react';
import { Home, MapPin, Building2, Star, TrendingUp, DollarSign, Users, CheckCircle, Upload, Phone, Mail } from 'lucide-react';
import '../App.css';

const ListPropertyPage = () => {
    const [formData, setFormData] = useState({
        propertyType: '',
        propertyName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        rooms: '',
        description: ''
    });

    const benefits = [
        {
            icon: <Users size={40} />,
            title: 'Millions of Travelers',
            description: 'Reach millions of potential guests from around the world'
        },
        {
            icon: <TrendingUp size={40} />,
            title: 'Increase Revenue',
            description: 'Maximize your occupancy and boost your earnings'
        },
        {
            icon: <Star size={40} />,
            title: 'Easy Management',
            description: 'User-friendly dashboard to manage bookings and pricing'
        },
        {
            icon: <DollarSign size={40} />,
            title: 'Competitive Commission',
            description: 'Industry-leading commission rates and flexible payment terms'
        }
    ];

    const propertyTypes = [
        { value: 'hotel', label: 'Hotel', icon: <Building2 size={24} /> },
        { value: 'resort', label: 'Resort', icon: <Home size={24} /> },
        { value: 'guesthouse', label: 'Guest House', icon: <Home size={24} /> },
        { value: 'apartment', label: 'Apartment', icon: <Building2 size={24} /> },
        { value: 'villa', label: 'Villa', icon: <Home size={24} /> },
        { value: 'hostel', label: 'Hostel', icon: <Building2 size={24} /> }
    ];

    const steps = [
        {
            step: '1',
            title: 'Register Your Property',
            description: 'Fill out the form with your property details and submit'
        },
        {
            step: '2',
            title: 'Verification',
            description: 'Our team will verify your property within 24-48 hours'
        },
        {
            step: '3',
            title: 'Setup & Go Live',
            description: 'Complete your profile, add photos, and start receiving bookings'
        },
        {
            step: '4',
            title: 'Manage & Earn',
            description: 'Use our dashboard to manage bookings and track earnings'
        }
    ];

    const features = [
        'Zero listing fees',
        'Real-time booking notifications',
        'Flexible cancellation policies',
        'Secure payment processing',
        'Professional photography support',
        'Marketing & promotional tools',
        '24/7 partner support',
        'Performance analytics & insights'
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your interest! Our partner team will contact you within 24 hours to complete the registration process.');
        setFormData({
            propertyType: '',
            propertyName: '',
            ownerName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            rooms: '',
            description: ''
        });
    };

    return (
        <div className="list-property-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <Home size={80} style={{ marginBottom: '20px', opacity: 0.9 }} />
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        List Your Property
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Join thousands of property owners who are earning more by listing on TravelGo.
                        It's free, easy, and profitable!
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Why Partner with TravelGo</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
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
                                <div style={{ color: '#10b981', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
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

            {/* Registration Form */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title">Register Your Property</h2>
                    <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', marginBottom: '40px' }}>
                        Fill out the form below to get started. Our team will contact you within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} style={{
                        background: '#f7fafc',
                        padding: '50px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        {/* Property Type Selection */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '15px', fontWeight: '700', color: '#2d3748', fontSize: '1.1rem' }}>
                                Property Type *
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '15px'
                            }}>
                                {propertyTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, propertyType: type.value })}
                                        style={{
                                            padding: '20px 15px',
                                            borderRadius: '12px',
                                            border: formData.propertyType === type.value ? '3px solid #10b981' : '2px solid #e2e8f0',
                                            background: formData.propertyType === type.value ? '#d1fae5' : 'white',
                                            color: formData.propertyType === type.value ? '#10b981' : '#4a5568',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (formData.propertyType !== type.value) {
                                                e.currentTarget.style.borderColor = '#10b981';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (formData.propertyType !== type.value) {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                            }
                                        }}
                                    >
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Property Name *
                            </label>
                            <input
                                type="text"
                                name="propertyName"
                                value={formData.propertyName}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Grand Plaza Hotel"
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    background: 'white'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Owner/Manager Name *
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    background: 'white'
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
                                        fontSize: '1rem',
                                        background: 'white'
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
                                        fontSize: '1rem',
                                        background: 'white'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Property Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    background: 'white'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        background: 'white'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                    Number of Rooms
                                </label>
                                <input
                                    type="number"
                                    name="rooms"
                                    value={formData.rooms}
                                    onChange={handleInputChange}
                                    min="1"
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        background: 'white'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Brief Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Tell us about your property, amenities, unique features..."
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    background: 'white'
                                }}
                            />
                        </div>

                        <button type="submit" style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                            <Upload size={24} />
                            Submit Registration
                        </button>
                    </form>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">How It Works</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px',
                        marginTop: '60px'
                    }}>
                        {steps.map((item, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                position: 'relative',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    fontWeight: '800',
                                    margin: '0 auto 25px'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
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

            {/* Features Section */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Partner Benefits</h2>
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
                                    e.currentTarget.style.background = '#d1fae5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f7fafc';
                                }}
                            >
                                <CheckCircle size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                                <span style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: '500' }}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="section-title">Have Questions?</h2>
                    <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '40px' }}>
                        Our partner success team is here to help you every step of the way
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Phone size={24} style={{ color: '#10b981' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Call Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>1800-123-4567</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Mail size={24} style={{ color: '#10b981' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Email Us</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>partners@travelgo.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
                        Ready to Grow Your Business?
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Join TravelGo today and start reaching millions of travelers worldwide
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            background: 'white',
                            color: '#10b981',
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
                        List Your Property Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ListPropertyPage;
