import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, Train, Bus, Car, Umbrella, Menu, X, Landmark, Compass, Navigation } from 'lucide-react';
import { getHeaderNav } from '../utils/mockData';

const iconMap = {
    Plane: <Plane size={18} />,
    Hotel: <Hotel size={18} />,
    Train: <Train size={18} />,
    Bus: <Bus size={18} />,
    Car: <Car size={18} />,
    Umbrella: <Umbrella size={18} />,
    Landmark: <Landmark size={18} />,
    Compass: <Compass size={18} />,
    Navigation: <Navigation size={18} />
};

const Header = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch XML Navigation Data
        const fetchNav = async () => {
            const data = await getHeaderNav();
            setNavItems(data);
        };
        fetchNav();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    {/* Using text logo with icon for simplicity and performance, or import image */}
                    <Plane className="logo-icon" size={28} />
                    TravelGo
                </Link>

                <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{iconMap[item.icon] || <Navigation size={18} />}</span>
                            {item.label}
                        </Link>
                    ))}
                    <div className="mobile-auth">
                        <Link to="/login" className="login-btn">Login / Sign Up</Link>
                    </div>
                </nav>

                <div className="desktop-auth">
                    <Link to="/login" className="login-btn">Login / Sign Up</Link>
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
