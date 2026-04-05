import React from 'react';
import { ShieldCheck, RefreshCcw, Clock, AlertTriangle } from 'lucide-react';
import '../App.css';

const RefundPage = () => {
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
                        Refund Policy
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Transparent and traveler-friendly cancellation policies to ensure peace of mind for every booking.
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
                        <Clock size={16} /> Last Updated: February 2026
                    </div>

                    <div style={{ display: 'grid', gap: '50px' }}>
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <ShieldCheck size={24} color="#9A7EAE" />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>Flight Cancellations</h2>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '20px' }}>
                                Cancellation charges vary based on the airline and fare type. Generally, the following rules apply:
                            </p>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {[
                                    { time: '0-2 hours before departure', refund: 'No refund possible' },
                                    { time: '2-24 hours before departure', refund: '50% refund + airline charges' },
                                    { time: '24-72 hours before departure', refund: '75% refund + airline charges' },
                                    { time: 'More than 72 hours', refund: 'Full refund minus service fee' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{item.time}</span>
                                        <span style={{ color: '#9A7EAE', fontWeight: '700' }}>{item.refund}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <RefreshCcw size={24} color="#4ade80" />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>Refund Processing</h2>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
                                All eligible refunds are initiated within <strong>24-48 hours</strong> of cancellation. However, it may take <strong>7-10 business days</strong> for the amount to reflect in your original payment method, depending on your bank's processing cycles.
                            </p>
                        </section>

                        <section style={{ 
                            background: 'rgba(248, 113, 113, 0.05)', 
                            padding: '30px', 
                            borderRadius: '20px', 
                            border: '1px solid rgba(248, 113, 113, 0.1)' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <AlertTriangle size={20} color="#f87171" />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Important Note</h3>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                Special promotional fares or "non-refundable" bookings will not qualify for refunds upon cancellation. Please review the specific terms and conditions displayed during your booking process.
                            </p>
                        </section>
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '15px' }}>Need assistance with a cancellation?</h3>
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

export default RefundPage;
