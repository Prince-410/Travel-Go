import React from 'react';
import '../App.css';

const ContactPage = () => {
    return (
        <div style={{ padding: '80px 20px', minHeight: '70vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', color: '#2d3748' }}>
                    Contact Us
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '40px' }}>
                    We're here to help! Reach out to us for any queries or assistance.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
                    <div style={{ background: '#f7fafc', padding: '30px', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                            Customer Support
                        </h3>
                        <p style={{ color: '#4a5568', marginBottom: '10px' }}>
                            <strong>Phone:</strong> 1800-123-4567 (Toll Free)
                        </p>
                        <p style={{ color: '#4a5568', marginBottom: '10px' }}>
                            <strong>Email:</strong> support@travelgo.com
                        </p>
                        <p style={{ color: '#4a5568' }}>
                            <strong>Hours:</strong> 24/7 Available
                        </p>
                    </div>

                    <div style={{ background: '#f7fafc', padding: '30px', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                            Corporate Office
                        </h3>
                        <p style={{ color: '#4a5568' }}>
                            TravelGo Pvt. Ltd.<br />
                            123, Business Tower<br />
                            MG Road, Bangalore - 560001<br />
                            Karnataka, India
                        </p>
                    </div>

                    <div style={{ background: '#f7fafc', padding: '30px', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                            Business Inquiries
                        </h3>
                        <p style={{ color: '#4a5568', marginBottom: '10px' }}>
                            <strong>Email:</strong> business@travelgo.com
                        </p>
                        <p style={{ color: '#4a5568' }}>
                            <strong>Phone:</strong> +91-80-1234-5678
                        </p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', color: '#2d3748' }}>
                        Send us a Message
                    </h2>
                    <form style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                style={{
                                    padding: '15px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                style={{
                                    padding: '15px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Subject"
                            style={{
                                padding: '15px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        <textarea
                            placeholder="Your Message"
                            rows="6"
                            style={{
                                padding: '15px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        ></textarea>
                        <button
                            type="submit"
                            style={{
                                padding: '15px 40px',
                                background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                justifySelf: 'start'
                            }}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
