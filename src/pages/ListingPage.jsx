import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import Offers from '../components/Offers';
import DynamicCard from '../components/DynamicCard';
import SeatSelector from '../components/SeatSelector';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useUI } from '../context/UIContext';

const SECTION_TITLES = {
    holiday: 'Top Holiday Packages',
    hotel: 'Recommended Hotels',
    train: 'Available Trains',
    cab: 'Available Cabs',
    bus: 'Popular Bus Routes',
    flight: 'Popular Domestic Flights',
};

const ListingPage = ({ type = 'flight', title, subtitle }) => {
    const { bookingCards } = useAdminConfig();
    const { showToast } = useUI();
    const [filteredCards, setFilteredCards] = useState([]);
    const [resultMsg, setResultMsg] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Initial load: show cards matching the category type
    useEffect(() => {
        const typeMatch = bookingCards.filter(c => c.type === type && c.status === 'active');
        setFilteredCards(typeMatch);
        setResultMsg(typeMatch.length > 0 ? `Showing ${typeMatch.length} upcoming ${type}s` : `No active ${type}s available`);
    }, [bookingCards, type]);

    const handleSearch = (filters) => {
        setIsSearching(true);
        setTimeout(() => { // Small delay to simulate processing & trigger UI loader
            // Filter by type first
            let results = bookingCards.filter(c => c.type === type && c.status === 'active');
            
            // Dynamic universal filtering
            if (filters.from) {
                results = results.filter(c => c.source && c.source.toLowerCase().includes(filters.from.toLowerCase()));
            }
            if (filters.to) {
                results = results.filter(c => c.destination && c.destination.toLowerCase().includes(filters.to.toLowerCase()));
            }
            if (filters.date) {
                results = results.filter(c => c.date === filters.date);
            }

            setFilteredCards(results);
            
            if (filters.from || filters.to || filters.date) {
               setResultMsg(`Found ${results.length} result${results.length !== 1 ? 's' : ''}`);
            } else {
               setResultMsg(results.length > 0 ? `Showing ${results.length} upcoming ${type}s` : `No ${type}s available`);
            }
            
            setIsSearching(false);
            document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
        }, 600);
    };

    return (
        <div className="listing-page-wrapper">
            <div className="page-background" data-page-type={type}></div>
            <Hero type={type} title={title} subtitle={subtitle} onSearch={handleSearch} />

            <section className="section listing-section" id="listings" data-page-type={type}>
                <div className="container">

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>
                            {SECTION_TITLES[type] || 'Listings'}
                        </h2>
                        {resultMsg && (
                            <span style={{
                                fontSize: '0.88rem',
                                color: 'var(--text-light)',
                                background: 'transparent',
                                padding: '0',
                                borderRadius: '20px',
                                fontWeight: '400',
                            }}>
                                {resultMsg}
                            </span>
                        )}
                    </div>

                    {isSearching ? (
                        <div style={{ textAlign: 'center', padding: '100px 0', animation: 'pulse 1.5s infinite ease-in-out' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px', filter: 'drop-shadow(0 0 10px var(--primary-color))' }}>🔍</div>
                            <h3 style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '1.2rem' }}>Scanning Inventory...</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Found {filteredCards.length} potential matches so far</p>
                        </div>
                    ) : filteredCards.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', padding: '80px 40px', 
                            background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            animation: 'fadeIn 0.5s ease-out'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>📭</div>
                            <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.6rem', marginBottom: 12 }}>No {type}s available</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 350, margin: '0 auto', lineHeight: 1.6 }}>
                                We couldn't find any active {type}s matching your current filters. Try adjusting your search criteria or check back later.
                            </p>
                            <button onClick={() => window.location.reload()} style={{
                                marginTop: 30, background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px',
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="listing-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredCards.map(item => (
                                <DynamicCard
                                    key={item._id}
                                    data={item}
                                    onSelect={() => setSelectedCard(item)}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {selectedCard && (
                <SeatSelector
                    bookingCard={selectedCard}
                    onClose={() => setSelectedCard(null)}
                    onPayment={(finalDetails) => {
                        console.log('Proceed to Checkout', finalDetails);
                        setSelectedCard(null);
                        // Future implementation: wire this to your payment modal
                        showToast(`Initiating checkout for ${finalDetails.title} (Seat ${finalDetails.selectedSeat})`, 'info');
                        // Future implementation: wire this to your payment modal
                    }}
                />
            )}

            <Offers type={type} />
        </div>
    );
};

export default ListingPage;
