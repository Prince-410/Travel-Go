
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Offers from '../components/Offers';
import ListingCard from '../components/ListingCard';
import { generateFlights, generateHotels, generateTrains, generateBuses, generateCabs, generateHolidays } from '../utils/mockData';

const ListingPage = ({ type = 'flight', title, subtitle }) => {
    const [listings, setListings] = useState([]);

    const generatorMap = {
        flight: generateFlights,
        hotel: generateHotels,
        train: generateTrains,
        bus: generateBuses,
        cab: generateCabs,
        holiday: generateHolidays
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const gen = generatorMap[type];
            if (gen) {
                const data = await gen(9);
                setListings(data);
            }
        };
        loadInitialData();
    }, [type]);

    const handleSearch = async (filters) => {
        const gen = generatorMap[type];
        if (gen) {
            const data = await gen(12, filters);
            setListings(data);
        }
        const elem = document.getElementById('listings');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="listing-page-wrapper">
            <div className="page-background" data-page-type={type}></div>
            <Hero type={type} title={title} subtitle={subtitle} onSearch={handleSearch} />

            <section className="section listing-section" id="listings" data-page-type={type}>
                <div className="container">
                    <h2 className="section-title">
                        {type === 'holiday' ? 'Top Holiday Packages' :
                            type === 'hotel' ? 'Recommended Hotels' :
                                type === 'train' ? 'Available Trains' :
                                    type === 'cab' ? 'Available Cabs' :
                                        type === 'bus' ? 'Popular Bus Routes' : 'Popular Domestic Flights'}
                    </h2>
                    <div className="listing-grid">
                        {listings.map(item => (
                            <ListingCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            <Offers type={type} />
        </div>
    );
};

export default ListingPage;
