import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useUI } from '../context/UIContext';
import '../App.css';

const ContactPage = () => {
    const { showToast, showConfirm } = useUI();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

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
            const response = await fetch(`\/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                showConfirm('Message Sent', 'Thank you! Your message has been sent successfully.', null, 'alert');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                showToast('Failed to send message: ' + (data.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('An error occurred. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: 'Customer Support',
            details: '1800-123-4567 (Toll Free)',
            subDetails: '24/7 Available for you',
            color: '#4ade80'
        },
        {
            icon: <Mail size={24} />,
            title: 'Email Us',
            details: 'support@travelgo.com',
            subDetails: 'Response within 24 hours',
            color: '#9A7EAE'
        },
        {
            icon: <MapPin size={24} />,
            title: 'Our Office',
            details: 'Business Tower, MG Road',
            subDetails: 'Bangalore, India - 560001',
            color: '#f87171'
        }
    ];

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
                        Get in Touch
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Have questions? Our team is here to help you plan your perfect journey. Reach out to us anytime.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {contactInfo.map((info, index) => (
                        <div key={index} style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(12px)',
                            padding: '40px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease'
                        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '16px', 
                                background: `${info.color}15`, 
                                color: info.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                {info.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>{info.title}</h3>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>{info.details}</p>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{info.subDetails}</p>
                        </div>
                    ))}
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.2fr 1fr', 
                    gap: '50px',
                    background: 'rgba(30, 41, 59, 0.3)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '50px',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px', color: '#fff' }}>Send us a message</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.7' }}>
                            Fill out the form below and our customer success team will get back to you within 24 hours.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginLeft: '4px' }}>FULL NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your name"
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: '14px',
                                            background: 'rgba(15, 23, 42, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginLeft: '4px' }}>EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="name@example.com"
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: '14px',
                                            background: 'rgba(15, 23, 42, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginLeft: '4px' }}>SUBJECT</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="How can we help?"
                                    style={{
                                        padding: '16px 20px',
                                        borderRadius: '14px',
                                        background: 'rgba(15, 23, 42, 0.4)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginLeft: '4px' }}>YOUR MESSAGE</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Type your message here..."
                                    rows="5"
                                    style={{
                                        padding: '16px 20px',
                                        borderRadius: '14px',
                                        background: 'rgba(15, 23, 42, 0.4)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        resize: 'none'
                                    }}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '18px 40px',
                                    background: 'linear-gradient(135deg, #9A7EAE 0%, #7c3aed 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginTop: '10px'
                                }}
                            >
                                {loading ? 'Sending...' : <>Send Message <Send size={20}/></>}
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            padding: '30px', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)' 
                        }}>
                            <h4 style={{ color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Clock size={20} color="#9A7EAE" /> Response Time
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                We usually respond within 2-4 business hours for urgent travel matters. For general inquiries, expect a reply within 24 hours.
                            </p>
                        </div>
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            padding: '30px', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255, 255, 255, 0.05)' 
                        }}>
                            <h4 style={{ color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <MessageSquare size={20} color="#9A7EAE" /> Live Chat
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                For immediate assistance, use our Live Chat feature at the bottom right of the screen. Our agents are online 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
