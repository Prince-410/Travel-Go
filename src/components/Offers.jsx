
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
        <section className="section offers-section" data-page-type={type}>
            <div className="container">
                <h2 className="section-title">Exclusive Offers</h2>
                <div className="offers-grid">
                    {offers.map((offer, index) => (
                        <div className="offer-card" key={index} style={{ backgroundColor: offer.color || 'white' }}>
                            <h3>{offer.title}</h3>
                            <p>{offer.desc}</p>
                            <a href="#" className="book-btn">Book Now <ArrowRight size={16} /></a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Offers;
