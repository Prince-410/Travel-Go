import React from 'react';
import { Plane, MapPin, Shield, Award, Users, Globe, Heart, TrendingUp } from 'lucide-react';
import '../App.css';

const AboutPage = () => {
    const features = [
        {
            icon: <Globe size={40} />,
            title: 'Global Reach',
            description: 'Access to thousands of destinations worldwide with the best travel options'
        },
        {
            icon: <Shield size={40} />,
            title: 'Secure Booking',
            description: 'Your safety is our priority with encrypted transactions and verified partners'
        },
        {
            icon: <Award size={40} />,
            title: 'Best Prices',
            description: 'Competitive pricing with exclusive deals and offers for our customers'
        },
        {
            icon: <Users size={40} />,
            title: '24/7 Support',
            description: 'Round-the-clock customer service to assist you at every step'
        }
    ];

    const stats = [
        { number: '10M+', label: 'Happy Travelers' },
        { number: '50K+', label: 'Destinations' },
        { number: '100+', label: 'Countries' },
        { number: '4.8/5', label: 'Customer Rating' }
    ];

    const services = [
        {
            icon: <Plane size={32} />,
            title: 'Flight Booking',
            description: 'Book domestic and international flights with ease. Compare prices, choose your preferred airlines, and get instant confirmations.'
        },
        {
            icon: <MapPin size={32} />,
            title: 'Hotel Reservations',
            description: 'Find and book the perfect accommodation from budget stays to luxury resorts. Filter by amenities, location, and price.'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Holiday Packages',
            description: 'Explore curated holiday packages for domestic and international destinations. All-inclusive deals with flights, hotels, and activities.'
        },
        {
            icon: <Heart size={32} />,
            title: 'Travel Insurance',
            description: 'Protect your journey with comprehensive travel insurance covering medical emergencies, trip cancellations, and more.'
        }
    ];

    return (
        <div className="about-page" style={{ color: '#fff' }}>
            {/* Hero Section */}
            <section style={{
                padding: '100px 20px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Our Mission & Vision
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Your trusted companion for seamless travel experiences across the globe, building the future of exploration.
                    </p>
                </div>
            </section>

            {/* Company Description */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title">Who We Are</h2>
                        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '900px', margin: '20px auto', lineHeight: '1.8' }}>
                            TravelGo is a leading online travel platform that simplifies the way you plan and book your journeys.
                            Founded with a vision to make travel accessible and enjoyable for everyone, we've grown to become
                            one of the most trusted names in the travel industry.
                        </p>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {stats.map((stat, index) => (
                            <div key={index} style={{
                                background: 'rgba(30,41,59,0.7)',
                                backdropFilter: 'blur(12px)',
                                padding: '40px 30px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#9A7EAE', marginBottom: '10px' }}>{stat.number}</h3>
                                <p style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section id="our-story" style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Our Story</h2>
                    <div style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.9', marginBottom: '25px' }}>
                            TravelGo was born from a simple idea: travel should be easy, affordable, and accessible to everyone.
                            In 2015, our founders recognized that booking travel was unnecessarily complicated and time-consuming.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.9', marginBottom: '25px' }}>
                            Today, TravelGo has grown to serve over 10 million travelers across 100+ countries. Our team of 500+
                            dedicated professionals works tirelessly to ensure every journey is smooth and memorable.
                        </p>
                        
                        <div style={{
                                background: 'rgba(154,126,174,0.1)',
                                border: '1px solid rgba(154,126,174,0.2)',
                                padding: '40px',
                                borderRadius: '24px',
                                color: 'white',
                                marginTop: '40px',
                                textAlign: 'center'
                            }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
                                Join Us on This Journey
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#cbd5e1' }}>
                                Whether you're planning a weekend getaway or a dream vacation, TravelGo is here to make it happen.
                                Thank you for being part of our story.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Why Choose TravelGo</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '40px',
                        marginTop: '40px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                background: 'rgba(30,41,59,0.5)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '24px',
                                padding: '40px 30px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    color: '#9A7EAE',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px'
                    }}>
                        <div style={{
                            background: 'rgba(30,41,59,0.7)',
                            backdropFilter: 'blur(12px)',
                            padding: '50px 40px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#9A7EAE' }}>Our Mission</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#cbd5e1' }}>
                                To empower travelers worldwide with innovative technology and exceptional service,
                                making every journey memorable and hassle-free.
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(30,41,59,0.7)',
                            backdropFilter: 'blur(12px)',
                            padding: '50px 40px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#9A7EAE' }}>Our Vision</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#cbd5e1' }}>
                                To become the world's most trusted and preferred travel platform, connecting people
                                to experiences that enrich their lives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '100px 20px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px' }}>
                        Ready to Start Your Journey?
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', color: '#94a3b8' }}>
                        Join millions of travelers who trust TravelGo for their travel needs
                    </p>
                    <button style={{
                        background: 'linear-gradient(to right, #9A7EAE, #7c3aed)',
                        color: '#fff',
                        padding: '18px 60px',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        borderRadius: '50px',
                        boxShadow: '0 10px 30px rgba(154, 126, 174, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(154, 126, 174, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(154, 126, 174, 0.4)';
                        }}
                        onClick={() => window.location.href = '/'}
                    >
                        Explore Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
