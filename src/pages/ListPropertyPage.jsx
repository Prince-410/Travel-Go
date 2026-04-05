import React, { useState } from 'react';
import { Home, MapPin, Building2, Star, TrendingUp, DollarSign, Users, CheckCircle, Upload, Phone, Mail, Globe, Sparkles, Shield } from 'lucide-react';
import '../App.css';

import { useUI } from '../context/UIContext';

const ListPropertyPage = () => {
    const { showToast } = useUI();
    const [formData, setFormData] = useState({
        propertyType: '', propertyName: '', ownerName: '', email: '', phone: '', address: '', city: '', rooms: '', description: ''
    });
    const [loading, setLoading] = useState(false);

    const propertyTypes = [
        { value: 'hotel', label: 'Hotel', icon: <Building2 size={24} /> },
        { value: 'resort', label: 'Resort', icon: <Globe size={24} /> },
        { value: 'villa', label: 'Villa', icon: <Home size={24} /> },
        { value: 'hostel', label: 'Hostel', icon: <Users size={24} /> }
    ];

    const benefits = [
        { icon: <Globe size={28} />, title: 'Global Reach', desc: 'Showcase your property to millions of international travelers.' },
        { icon: <TrendingUp size={28} />, title: 'Max Earnings', desc: 'Optimize occupancy rates with our advanced pricing algorithms.' },
        { icon: <Shield size={28} />, title: 'Safe Payments', desc: 'Secure, automated payouts directly to your business account.' }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.propertyType) { 
            showToast('Please select a property type.', 'warning'); 
            return; 
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message, 'success');
                setFormData({ propertyType: '', propertyName: '', ownerName: '', email: '', phone: '', address: '', city: '', rooms: '', description: '' });
            } else { 
                showToast(data.message || 'Error occurred', 'error'); 
            }
        } catch (err) {
            console.error(err);
            showToast('Service currently unavailable. Please try again later.', 'error');
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
                        width: '70px', height: '70px', borderRadius: '20px', background: 'rgba(129, 140, 248, 0.1)', 
                        color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' 
                    }}>
                        <Home size={32} />
                    </div>
                    <h1 style={{ 
                        fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #818cf8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Grow Your Hospitality Business</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: '#94a3b8' }}>
                        Partner with TravelGo and transform your property into a top-rated destination. Reach more guests and manage bookings with ease.
                    </p>
                </div>
            </section>

            <section className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                {/* Fixed: Removed the info sidebar and made form centered/full-width as requested */}
                <div style={{ 
                    background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)', 
                    borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px' 
                }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '35px', textAlign: 'center' }}>Property Registration</h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>Property Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                {propertyTypes.map((type) => (
                                    <button key={type.value} type="button" onClick={() => setFormData({...formData, propertyType: type.value})}
                                        style={{ 
                                            padding: '15px', borderRadius: '16px', background: formData.propertyType === type.value ? '#818cf8' : 'rgba(255, 255, 255, 0.03)',
                                            color: formData.propertyType === type.value ? '#fff' : '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700'
                                        }}>{type.icon}{type.label}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>PROPERTY NAME</label>
                                <input type="text" name="propertyName" value={formData.propertyName} onChange={handleInputChange} required placeholder="Azure Resort"
                                    style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>OWNER NAME</label>
                                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required placeholder="Jane Smith"
                                    style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>BUSINESS EMAIL</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="partner@property.com"
                                    style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>PHONE</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91..."
                                    style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>DESCRIPTION</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Tell us about your property..."
                                style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', resize: 'none' }} />
                        </div>

                        <button type="submit" disabled={loading} style={{ 
                            padding: '20px', borderRadius: '18px', background: 'linear-gradient(to right, #818cf8, #6366f1)', 
                            color: '#fff', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '10px'
                        }}>
                            <Upload size={22}/> {loading ? 'Submitting...' : 'Register Property'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ListPropertyPage;
