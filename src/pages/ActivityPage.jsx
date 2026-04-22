import React from 'react';
import { Activity as ActivityIcon, Calendar, MapPin, Clock, Star } from 'lucide-react';
import '../App.css';

const ActivityPage = () => {
    const activities = [
        {
            title: "Scuba Diving in Andaman",
            location: "Andaman & Nicobar Islands",
            duration: "3 Hours",
            rating: "4.9/5",
            price: "₹3,500",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Desert Safari & Camel Ride",
            location: "Jaisalmer, Rajasthan",
            duration: "6 Hours",
            rating: "4.8/5",
            price: "₹1,800",
            image: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Trekking in Himalayan Foothills",
            location: "Manali, Himachal",
            duration: "2 Days",
            rating: "4.7/5",
            price: "₹2,500",
            image: "https://images.unsplash.com/photo-1519965005929-14a0fc7fada6?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Backwaters Houseboat Cruise",
            location: "Alleppey, Kerala",
            duration: "1 Day",
            rating: "4.9/5",
            price: "₹6,000",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="activity-page" style={{ color: '#fff', paddingTop: '100px' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #60efff, #00ff87)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Exciting Activities To Do
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Discover and book unforgettable experiences curated just for you. From adventures to relaxing getaways.
                    </p>
                </div>
            </section>

            {/* Activities Grid */}
            <section style={{ padding: '60px 20px 100px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '30px'
                    }}>
                        {activities.map((activity, index) => (
                            <div key={index} style={{
                                background: 'rgba(30,41,59,0.7)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,255,135,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                                    <img src={activity.image} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '25px' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px' }}>{activity.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <MapPin size={16} style={{ marginRight: '6px', color: '#00ff87' }} /> {activity.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', marginBottom: '15px', fontSize: '0.9rem' }}>
                                        <Clock size={16} style={{ marginRight: '6px', color: '#60efff' }} /> {activity.duration}
                                        <span style={{ margin: '0 10px' }}>•</span>
                                        <Star size={16} style={{ marginRight: '6px', color: '#fbbf24' }} /> {activity.rating}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{activity.price}</span>
                                        <button style={{
                                            background: 'linear-gradient(to right, #60efff, #00ff87)',
                                            color: '#0f172a',
                                            border: 'none',
                                            padding: '8px 20px',
                                            borderRadius: '50px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ActivityPage;
