import React from 'react';
import { Tag, Copy, Calendar, Percent } from 'lucide-react';
import '../App.css';
import { useUI } from '../context/UIContext';

const OffersPage = () => {
    const { showConfirm } = useUI();
    const offers = [
        {
            code: "WELCOME50",
            title: "Flat 50% Off on First Flight",
            desc: "Get up to ₹2,500 off on your first domestic flight booking with TravelGo.",
            validTill: "31 Dec 2026",
            type: "Flight"
        },
        {
            code: "STAYCATION",
            title: "30% Off Luxury Hotels",
            desc: "Book any 4 or 5-star hotel and enjoy 30% instant discount.",
            validTill: "15 May 2026",
            type: "Hotel"
        },
        {
            code: "GOEXPLORE",
            title: "Extra 10% Off on Activities",
            desc: "Applicable on all scuba diving, trekking, and adventure packages.",
            validTill: "30 Jun 2026",
            type: "Activity"
        },
        {
            code: "FESTIVEBUS",
            title: "₹500 Cashback on Bus",
            desc: "Book any AC Volvo bus and get guaranteed ₹500 cashback in wallet.",
            validTill: "10 Nov 2026",
            type: "Bus"
        }
    ];

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        showConfirm('Copied!', `${code} has been copied to your clipboard.`, null, 'success');
    };

    return (
        <div className="offers-page" style={{ color: '#fff', paddingTop: '100px' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Exclusive Deals & Offers
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Travel more, spend less. Enjoy handpicked deals and massive discounts on your next booking!
                    </p>
                </div>
            </section>

            {/* Offers Grid */}
            <section style={{ padding: '60px 20px 100px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '30px'
                    }}>
                        {offers.map((offer, index) => (
                            <div key={index} style={{
                                background: 'rgba(30,41,59,0.7)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px dashed rgba(255, 65, 108, 0.4)',
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'rgba(255, 65, 108, 0.15)',
                                    color: '#ff4b2b',
                                    padding: '5px 12px',
                                    borderRadius: '50px',
                                    fontSize: '0.8rem',
                                    fontWeight: '800'
                                }}>
                                    {offer.type}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <Percent size={28} style={{ color: '#ff416c', marginRight: '15px' }} />
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{offer.title}</h3>
                                </div>
                                <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '25px', flexGrow: 1 }}>{offer.desc}</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '15px 20px', borderRadius: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '1px', color: '#fff' }}>{offer.code}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                                            <Calendar size={12} style={{ marginRight: '4px' }} /> Valid till {offer.validTill}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => copyCode(offer.code)}
                                        style={{
                                            background: '#ff416c',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Copy Code"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OffersPage;
