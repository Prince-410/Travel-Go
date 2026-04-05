import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, Train, Bus, Car, Umbrella, Menu, X, Landmark, Compass, Navigation, User } from 'lucide-react';
import { getHeaderNav } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';

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

const pathToService = {
  '/': 'home',
  '/flights': 'flights',
  '/hotels': 'hotels',
  '/trains': 'trains',
  '/buses': 'buses',
  '/cabs': 'cabs',
  '/holidays': 'holidays'
};

const Header = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isServiceEnabled } = useAdminConfig();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

  // Filter nav items based on admin config (real-time)
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      const serviceKey = pathToService[item.path];
      return !serviceKey || isServiceEnabled(serviceKey);
    });
  }, [navItems, isServiceEnabled]);

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
        <Link to="/" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Plane className="logo-icon" size={28} />
          TravelGo
        </Link>

        <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="nav-icon">{iconMap[item.icon] || <Navigation size={18} />}</span>
              {item.label}
            </Link>
          ))}
          <div className="mobile-auth">
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="login-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="login-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            ) : (
              <button className="login-btn" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}>Login / Sign Up</button>
            )}
          </div>
        </nav>

        <div className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(244, 114, 182, 0.12)',
                    border: '1px solid rgba(244, 114, 182, 0.25)',
                    borderRadius: 50,
                    padding: '6px 16px',
                    textDecoration: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)',
                borderRadius: 50, padding: '6px 16px 6px 6px', textDecoration: 'none',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s'
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={14} />}
                </div>
                {user?.name?.split(' ')[0] || 'Profile'}
              </Link>
            </div>
          ) : (
            <button className="login-btn" onClick={onOpenAuth}>Login / Sign Up</button>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
