import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { getFooterLinks } from '../utils/mockData';
import '../App.css'; // Ensure styles are applied

const Footer = ({ pageType = 'flight' }) => {
    const [footerLinks, setFooterLinks] = useState([]);

    useEffect(() => {
        const fetchFooterLinks = async () => {
            const data = await getFooterLinks();
            setFooterLinks(data);
        };
        fetchFooterLinks();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-overlay"></div>
            <div className="container footer-container">
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>TravelGo</h4>
                        <p style={{ color: '#ddd', fontSize: '0.9rem', marginBottom: '20px' }}>
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
                                <Link key={idx} to={link.path}>{link.label}</Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '20px', textAlign: 'center', color: '#ccc', fontSize: '0.85rem' }}>
                    <p>&copy; {new Date().getFullYear()} TravelGo. All rights reserved. Designed with ❤️ for travelers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
