import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { getFooterLinks } from '../utils/mockData';
import '../App.css'; // Ensure styles are applied

const Footer = ({ pageType = 'flight' }) => {
    const [footerLinks, setFooterLinks] = useState([]);

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchFooterLinks = async () => {
            const data = await getFooterLinks();
            setFooterLinks(data);
        };
        fetchFooterLinks();
    }, []);

    const handleNewsletter = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Newsletter Subscriber', email, message: 'Subscribed to newsletter updates', type: 'newsletter' })
            });
            if (res.ok) { setStatus('Subscribed successfully!'); setEmail(''); }
            else setStatus('Subscription failed.');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) { setStatus('Network error.'); }
    };

    return (
        <footer className="footer">
            <div className="footer-overlay"></div>
            <div className="container footer-container">
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>TravelGo</h4>
                        <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Your trusted travel partner for flights, hotels, trains, buses, and holidays. Experience the world with comfort and ease.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '15px' }}>
                            <a href="#"><Facebook size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    {footerLinks.map((column, index) => (
                        <div className="footer-column" key={index}>
                            <h4>{column.title}</h4>
                            {column.links.map((link, idx) => (
                                <Link key={idx} to={link.path} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{link.label}</Link>
                            ))}
                        </div>
                    ))}
                    <div className="footer-column">
                        <h4>Newsletter</h4>
                        <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '15px' }}>Subscribe for the latest offers and travel tips!</p>
                        <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email" 
                                required
                                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                            />
                            <button type="submit" style={{ padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Subscribe</button>
                        </form>
                        {status && <p style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
                    </div>
                </div>
                <div className="footer-bottom" style={{ borderTop: '1px solid rgba(250, 250, 250, 0.2)', paddingTop: '20px', textAlign: 'center', color: '#CBD5E1', fontSize: '0.85rem' }}>
                    <p>&copy; {new Date().getFullYear()} TravelGo. All rights reserved. Designed with ❤️ for travelers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
