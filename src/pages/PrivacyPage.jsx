import React from 'react';
import { Lock, Eye, Database, Share2, UserCheck, Cookie, Info } from 'lucide-react';
import '../App.css';

const PrivacyPage = () => {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Your privacy is our priority. Learn how we protect and manage your personal information.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '60px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', color: '#94a3b8', fontSize: '0.9rem' }}>
                        <Info size={16} /> Last Updated: February 2026
                    </div>

                    <div style={{ display: 'grid', gap: '50px' }}>
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Database size={24} color="#9A7EAE" />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>1. Information We Collect</h2>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '20px' }}>
                                We collect various types of information to provide better services to our users:
                            </p>
                            <ul style={{ color: '#cbd5e1', lineHeight: '2', listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Personal Details:</strong> Name, email address, phone number, and physical address.</li>
                                <li><strong>Travel Data:</strong> Booking history, travel preferences, and frequent flyer details.</li>
                                <li><strong>Financial Information:</strong> Payment method details, handled through secure, PCI-compliant processors.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
                            </ul>
                        </section>

                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Eye size={24} color="#4ade80" />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>2. How We Use Data</h2>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
                                Your information helps us process bookings, verify identities, improve website functionality, and send relevant travel offers. We use anonymized data for analytical purposes to enhance our overall service quality.
                            </p>
                        </section>

                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Lock size={24} color="#60a5fa" />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>3. Data Security</h2>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
                                We implement industry-leading encryption and security protocols (SSL/TLS) to safeguard your data. Access to personal information is strictly limited to employees and partners who need it to fulfill travel services.
                            </p>
                        </section>

                        <section style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            padding: '40px', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)' 
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Cookie size={20} color="#fbbf24" /> Cookies Policy
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7' }}>
                                We use cookies to personalize content, provide social media features, and analyze our traffic. You can manage your cookie preferences through your browser settings at any time.
                            </p>
                        </section>
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '15px' }}>Questions about your data?</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Contact our Data Protection Officer at privacy@travelgo.com</p>
                        <button onClick={() => window.location.href = '/contact'} style={{ 
                            padding: '16px 32px', 
                            borderRadius: '12px', 
                            background: '#9A7EAE', 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                        }}>Contact Support</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPage;
