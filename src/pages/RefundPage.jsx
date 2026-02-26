import React from 'react';
import '../App.css';

const RefundPage = () => {
    return (
        <div style={{ padding: '80px 20px', minHeight: '70vh', background: '#f7fafc' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', color: '#2d3748' }}>
                    Cancellation & Refund Policy
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '40px' }}>
                    Last Updated: February 2026
                </p>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Flight Cancellations
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8', marginBottom: '15px' }}>
                        Cancellation charges vary based on the airline and fare type:
                    </p>
                    <ul style={{ color: '#4a5568', lineHeight: '1.8', marginLeft: '20px' }}>
                        <li><strong>0-2 hours before departure:</strong> No refund</li>
                        <li><strong>2-24 hours before departure:</strong> 50% refund + airline charges</li>
                        <li><strong>24-72 hours before departure:</strong> 75% refund + airline charges</li>
                        <li><strong>More than 72 hours:</strong> Full refund minus ₹300 service fee</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Hotel Cancellations
                    </h2>
                    <ul style={{ color: '#4a5568', lineHeight: '1.8', marginLeft: '20px' }}>
                        <li><strong>0-24 hours before check-in:</strong> No refund</li>
                        <li><strong>1-3 days before check-in:</strong> 50% refund</li>
                        <li><strong>3-7 days before check-in:</strong> 75% refund</li>
                        <li><strong>More than 7 days:</strong> Full refund minus ₹200 service fee</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Train & Bus Cancellations
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8', marginBottom: '15px' }}>
                        Cancellation charges as per Indian Railways/Bus operator rules:
                    </p>
                    <ul style={{ color: '#4a5568', lineHeight: '1.8', marginLeft: '20px' }}>
                        <li><strong>More than 48 hours:</strong> ₹240 deduction per passenger</li>
                        <li><strong>12-48 hours:</strong> 25% of fare</li>
                        <li><strong>4-12 hours:</strong> 50% of fare</li>
                        <li><strong>Less than 4 hours:</strong> No refund</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Holiday Package Cancellations
                    </h2>
                    <ul style={{ color: '#4a5568', lineHeight: '1.8', marginLeft: '20px' }}>
                        <li><strong>0-7 days before departure:</strong> No refund</li>
                        <li><strong>7-15 days before departure:</strong> 25% refund</li>
                        <li><strong>15-30 days before departure:</strong> 50% refund</li>
                        <li><strong>More than 30 days:</strong> 75% refund</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Refund Processing Time
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        Refunds are processed within 7-10 business days from the date of cancellation. The refund will be
                        credited to the original payment method used during booking.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        Need Help?
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        For cancellation assistance, please contact our 24/7 customer support at 1800-123-4567 or
                        email us at support@travelgo.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default RefundPage;
