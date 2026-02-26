import React from 'react';
import '../App.css';

const PressPage = () => {
    const pressReleases = [
        {
            date: 'February 1, 2026',
            title: 'TravelGo Reaches 10 Million Users Milestone',
            excerpt: 'Leading travel platform TravelGo announces it has crossed 10 million registered users, marking a significant achievement in the company\'s growth journey.',
            category: 'Company News'
        },
        {
            date: 'January 15, 2026',
            title: 'TravelGo Launches AI-Powered Travel Recommendations',
            excerpt: 'New feature uses machine learning to provide personalized travel suggestions based on user preferences and booking history.',
            category: 'Product Launch'
        },
        {
            date: 'December 20, 2025',
            title: 'TravelGo Partners with 500+ New Hotels Across India',
            excerpt: 'Strategic partnerships expand accommodation options for travelers, offering more choices at competitive prices.',
            category: 'Partnership'
        },
        {
            date: 'November 10, 2025',
            title: 'TravelGo Wins "Best Travel Platform 2025" Award',
            excerpt: 'Recognized for excellence in customer service and innovation at the National Travel Awards ceremony.',
            category: 'Awards'
        }
    ];

    const mediaKit = [
        {
            title: 'Company Logo',
            description: 'High-resolution logos in various formats',
            icon: '🎨'
        },
        {
            title: 'Brand Guidelines',
            description: 'Official brand colors, fonts, and usage rules',
            icon: '📋'
        },
        {
            title: 'Press Kit',
            description: 'Company overview, fact sheet, and executive bios',
            icon: '📦'
        },
        {
            title: 'Media Assets',
            description: 'Product screenshots and promotional images',
            icon: '🖼️'
        }
    ];

    return (
        <div style={{ minHeight: '70vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                padding: '80px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        Press & Media
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Latest news, press releases, and media resources from TravelGo
                    </p>
                </div>
            </section>

            {/* Press Contact */}
            <section style={{ padding: '60px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: '#2d3748' }}>
                            Media Inquiries
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '30px', lineHeight: '1.7' }}>
                            For press inquiries, interviews, or media partnerships, please contact our PR team
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                            <div>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Email</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#008cff' }}>
                                    press@travelgo.com
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Phone</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#008cff' }}>
                                    +91-80-9876-5432
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Press Releases */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Recent Press Releases</h2>
                    <div style={{ marginTop: '40px' }}>
                        {pressReleases.map((release, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                marginBottom: '20px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                    <span style={{
                                        background: '#e3f2fd',
                                        color: '#008cff',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {release.category}
                                    </span>
                                    <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                                        {release.date}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                                    {release.title}
                                </h3>
                                <p style={{ color: '#718096', lineHeight: '1.7', marginBottom: '15px' }}>
                                    {release.excerpt}
                                </p>
                                <a href="#" style={{
                                    color: '#008cff',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    Read Full Release →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Kit */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Media Kit & Resources</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        marginTop: '40px'
                    }}>
                        {mediaKit.map((item, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '40px 30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
                                    {item.description}
                                </p>
                                <button style={{
                                    padding: '10px 25px',
                                    background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Company Facts */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title">Quick Facts</h2>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        marginTop: '40px'
                    }}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Founded</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>2015</p>
                            </div>
                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Headquarters</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>Bangalore, India</p>
                            </div>
                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Registered Users</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>10+ Million</p>
                            </div>
                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Countries Served</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>100+</p>
                            </div>
                            <div>
                                <p style={{ color: '#718096', marginBottom: '5px' }}>Services</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
                                    Flights, Hotels, Trains, Buses, Cabs, Holiday Packages
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PressPage;
