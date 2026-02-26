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
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '100px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        About TravelGo
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Your trusted companion for seamless travel experiences across the globe
                    </p>
                </div>
            </section>

            {/* Company Description */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title">Who We Are</h2>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '900px', margin: '20px auto', lineHeight: '1.8' }}>
                            TravelGo is a leading online travel platform that simplifies the way you plan and book your journeys.
                            Founded with a vision to make travel accessible and enjoyable for everyone, we've grown to become
                            one of the most trusted names in the travel industry.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '900px', margin: '20px auto', lineHeight: '1.8' }}>
                            We offer a comprehensive suite of travel services including flight bookings, hotel reservations,
                            train tickets, bus bookings, cab services, and curated holiday packages. Our platform brings together
                            the best deals from thousands of partners worldwide, ensuring you get the most value for your money.
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
                                background: 'white',
                                padding: '40px 20px',
                                borderRadius: '16px',
                                textAlign: 'center',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#008cff', marginBottom: '10px' }}>
                                    {stat.number}
                                </div>
                                <div style={{ fontSize: '1rem', color: '#718096', fontWeight: '600' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section id="our-story" style={{ padding: '80px 20px', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Our Story</h2>
                    <div style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.9', marginBottom: '25px' }}>
                            TravelGo was born from a simple idea: travel should be easy, affordable, and accessible to everyone.
                            In 2015, our founders—a group of passionate travelers and tech enthusiasts—noticed a gap in the market.
                            Booking travel was complicated, time-consuming, and often expensive.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.9', marginBottom: '25px' }}>
                            Starting from a small office in Bangalore with just five team members, we set out to revolutionize
                            the travel booking experience. We built a platform that aggregates the best deals from airlines, hotels,
                            and travel partners, making it easy for users to compare and book in just a few clicks.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.9', marginBottom: '25px' }}>
                            Today, TravelGo has grown to serve over 10 million travelers across 100+ countries. Our team of 500+
                            dedicated professionals works tirelessly to ensure every journey is smooth and memorable. We've expanded
                            our services to include not just flights and hotels, but also trains, buses, cabs, and complete holiday packages.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.9', marginBottom: '25px' }}>
                            But our story doesn't end here. We continue to innovate, adding new features like AI-powered recommendations,
                            instant customer support, and exclusive travel deals. Our mission remains the same: to make your travel
                            dreams a reality, one booking at a time.
                        </p>
                        <div style={{
                            background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                            padding: '40px',
                            borderRadius: '16px',
                            color: 'white',
                            marginTop: '40px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '15px' }}>
                                Join Us on This Journey
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px',
                        marginTop: '60px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '30px'
                            }}>
                                <div style={{
                                    color: '#008cff',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Our Services</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                        marginTop: '60px'
                    }}>
                        {services.map((service, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
                                <div style={{ color: '#008cff', marginBottom: '20px' }}>
                                    {service.icon}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7' }}>
                                    {service.description}
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
                        gap: '50px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '50px 40px',
                            borderRadius: '20px',
                            color: 'white'
                        }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>Our Mission</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                To empower travelers worldwide with innovative technology and exceptional service,
                                making every journey memorable and hassle-free.
                            </p>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '50px 40px',
                            borderRadius: '20px',
                            color: 'white'
                        }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>Our Vision</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                To become the world's most trusted and preferred travel platform, connecting people
                                to experiences that enrich their lives.
                            </p>
                        </div>
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
                        Ready to Start Your Journey?
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Join millions of travelers who trust TravelGo for their travel needs
                    </p>
                    <button style={{
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
