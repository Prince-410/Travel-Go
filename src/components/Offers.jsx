
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getOffers } from '../utils/mockData';
import '../App.css';

const Offers = ({ type = 'flight' }) => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            const xmlOffers = await getOffers(type);
            setOffers(xmlOffers);
        };
        fetchOffers();
    }, [type]);

    return (
        <section style={{ padding: '60px 0', margin: '20px auto', maxWidth: 1200 }}>
            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>Exclusive Offers</h2>
                    <div style={{ padding: '4px 12px', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: 20, color: '#818cf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Limited Time
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {offers.map((offer, index) => (
                        <div key={index} 
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)'; e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                            style={{ 
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))', 
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.12)', 
                                borderRadius: '20px', 
                                padding: '28px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle at top right, rgba(129, 140, 248, 0.1), transparent 70%)', pointerEvents: 'none' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '10px' }}>{offer.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>{offer.desc}</p>
                            <div style={{ 
                                color: '#818cf8', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'
                             }}>
                                Claim Now <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Offers;
