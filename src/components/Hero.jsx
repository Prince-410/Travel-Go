
import React from 'react';
import SearchForm from './SearchForm';
import '../App.css';

const Hero = ({ type = 'flight', title, subtitle, onSearch }) => {
    return (
        <>
            <section className="hero-section" data-page-type={type}>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
            </section>
            <SearchForm type={type} onSearch={onSearch} />
        </>
    );
};

export default Hero;
