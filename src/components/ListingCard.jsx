
import React from 'react';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import '../App.css'; // For common styling

const ListingCard = ({ item }) => {
    return (
        <div className="listing-card animate-fade-in">
            <div className="listing-image" style={{ backgroundImage: `linear-gradient(${Math.floor(Math.random() * 360)}deg, #eee, #ddd)` }}>
                {item.badge && <span className="listing-badge">{item.badge}</span>}
            </div>
            <div className="listing-content">
                <div className="listing-title">{item.title}</div>
                <div className="listing-subtitle">
                    {item.subtitle.includes("📍") || item.subtitle.includes("•") ? (
                        <span>{item.subtitle}</span>
                    ) : (
                        <> <div className="listing-location"> <MapPin size={12} /> {item.subtitle} </div> </>
                    )}
                </div>
                <div className="listing-features">
                    {item.pill1 && <span className="feature-pill">{item.pill1}</span>}
                    {item.pill2 && <span className="feature-pill">{item.pill2}</span>}
                </div>
                <div className="listing-footer">
                    <div className="listing-price">
                        {item.price}
                        {item.priceSuffix && <span>{item.priceSuffix}</span>}
                    </div>
                    <div className="listing-rating">
                        <Star size={12} fill="white" /> {item.rating}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
