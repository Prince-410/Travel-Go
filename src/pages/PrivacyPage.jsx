import React from 'react';
import '../App.css';

const PrivacyPage = () => {
    return (
        <div style={{ padding: '80px 20px', minHeight: '70vh', background: '#f7fafc' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', color: '#2d3748' }}>
                    Privacy Policy
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '40px' }}>
                    Last Updated: February 2026
                </p>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        1. Information We Collect
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8', marginBottom: '15px' }}>
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul style={{ color: '#4a5568', lineHeight: '1.8', marginLeft: '20px' }}>
                        <li>Personal information (name, email, phone number)</li>
                        <li>Travel preferences and booking history</li>
                        <li>Payment information (processed securely)</li>
                        <li>Communication preferences</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        2. How We Use Your Information
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        We use the information we collect to provide, maintain, and improve our services, process your bookings,
                        send you confirmations and updates, respond to your requests, and personalize your experience.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        3. Data Security
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        We implement industry-standard security measures to protect your personal information. All payment
                        transactions are encrypted using SSL technology. However, no method of transmission over the internet
                        is 100% secure.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        4. Sharing of Information
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        We do not sell your personal information. We may share your information with trusted partners who assist
                        us in operating our website, conducting our business, or servicing you, as long as those parties agree
                        to keep this information confidential.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        5. Your Rights
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        You have the right to access, update, or delete your personal information at any time. You can also
                        opt-out of marketing communications. Contact us at privacy@travelgo.com for any privacy-related requests.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        6. Cookies
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        We use cookies and similar tracking technologies to track activity on our service and hold certain
                        information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#008cff' }}>
                        7. Contact Us
                    </h2>
                    <p style={{ color: '#4a5568', lineHeight: '1.8' }}>
                        If you have any questions about this Privacy Policy, please contact us at privacy@travelgo.com or
                        call our customer support at 1800-123-4567.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
