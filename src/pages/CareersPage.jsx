import React from 'react';
import '../App.css';

const CareersPage = () => {
    const openPositions = [
        {
            title: 'Senior Full Stack Developer',
            department: 'Engineering',
            location: 'Bangalore, India',
            type: 'Full-time'
        },
        {
            title: 'Product Manager',
            department: 'Product',
            location: 'Mumbai, India',
            type: 'Full-time'
        },
        {
            title: 'UI/UX Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            title: 'Customer Support Executive',
            department: 'Support',
            location: 'Delhi, India',
            type: 'Full-time'
        },
        {
            title: 'Marketing Manager',
            department: 'Marketing',
            location: 'Bangalore, India',
            type: 'Full-time'
        },
        {
            title: 'Data Analyst',
            department: 'Analytics',
            location: 'Pune, India',
            type: 'Full-time'
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
                        Join Our Team
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Help us revolutionize the travel industry and create amazing experiences for millions of travelers
                    </p>
                </div>
            </section>

            {/* Why Join Us */}
            <section style={{ padding: '80px 20px', background: '#f7fafc' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title">Why Work at TravelGo?</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                        marginTop: '40px'
                    }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                                🚀 Innovation First
                            </h3>
                            <p style={{ color: '#4a5568', lineHeight: '1.7' }}>
                                Work with cutting-edge technologies and contribute to innovative solutions that impact millions
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                                💼 Growth Opportunities
                            </h3>
                            <p style={{ color: '#4a5568', lineHeight: '1.7' }}>
                                Continuous learning programs, mentorship, and clear career progression paths
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                                🌍 Work-Life Balance
                            </h3>
                            <p style={{ color: '#4a5568', lineHeight: '1.7' }}>
                                Flexible working hours, remote options, and generous vacation policies
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                                🎁 Great Benefits
                            </h3>
                            <p style={{ color: '#4a5568', lineHeight: '1.7' }}>
                                Competitive salary, health insurance, travel discounts, and performance bonuses
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Open Positions</h2>
                    <div style={{ marginTop: '40px' }}>
                        {openPositions.map((position, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                marginBottom: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '20px'
                            }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', color: '#2d3748' }}>
                                        {position.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#718096' }}>
                                        <span>📁 {position.department}</span>
                                        <span>📍 {position.location}</span>
                                        <span>⏰ {position.type}</span>
                                    </div>
                                </div>
                                <button style={{
                                    padding: '12px 30px',
                                    background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '60px 20px',
                background: '#f7fafc',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: '#2d3748' }}>
                        Don't see a perfect fit?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '30px' }}>
                        Send us your resume at careers@travelgo.com and we'll keep you in mind for future opportunities
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
