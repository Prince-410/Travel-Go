import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane, Hotel, Train, Bus, Car, Umbrella, MapPin, Calendar,
  Users, Search, ArrowRight, TrendingUp, Star, Clock, Flame,
  Zap, Shield, Gift, Sparkles, Globe, Heart,
  CheckCircle2, ChevronRight, RefreshCw, Smartphone,
  Headphones, BarChart3, Navigation, DollarSign,
  Timer
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import '../styles/NextGen.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
═══════════════════════════════════════════════════════════════════════════════ */
const useAnimatedCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
};

/* ═══════════════════════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER HOOK FOR REVEAL ANIMATIONS
═══════════════════════════════════════════════════════════════════════════════ */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ng-visible');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

/* ═══════════════════════════════════════════════════════════════════════════════
   PARTICLE SYSTEM
═══════════════════════════════════════════════════════════════════════════════ */
const ParticleField = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
    })),
    []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="ng-particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SEARCH BAR
═══════════════════════════════════════════════════════════════════════════════ */
const HeroSearchBar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane, path: '/' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, path: '/hotels' },
    { id: 'trains', label: 'Trains', icon: Train, path: '/trains' },
    { id: 'buses', label: 'Buses', icon: Bus, path: '/buses' },
    { id: 'cabs', label: 'Cabs', icon: Car, path: '/cabs' },
    { id: 'holidays', label: 'Holidays', icon: Umbrella, path: '/holidays' },
  ];

  const searchConfigs = {
    flights: [
      { icon: MapPin, label: 'From', value: 'Delhi (DEL)', placeholder: 'Departure city' },
      { icon: MapPin, label: 'To', value: 'Mumbai (BOM)', placeholder: 'Arrival city' },
      { icon: Calendar, label: 'Date', value: 'Mar 28, 2026', placeholder: 'Select date' },
      { icon: Users, label: 'Travelers', value: '1 Adult', placeholder: 'Add guests' },
    ],
    hotels: [
      { icon: MapPin, label: 'Destination', value: 'Goa, India', placeholder: 'Where to stay?' },
      { icon: Calendar, label: 'Check-in', value: 'Mar 28', placeholder: 'Check-in date' },
      { icon: Calendar, label: 'Check-out', value: 'Mar 30', placeholder: 'Check-out date' },
      { icon: Users, label: 'Guests', value: '2 Adults', placeholder: 'Add guests' },
    ],
    trains: [
      { icon: MapPin, label: 'From', value: 'Ahmedabad', placeholder: 'From station' },
      { icon: MapPin, label: 'To', value: 'Surat', placeholder: 'To station' },
      { icon: Calendar, label: 'Date', value: 'Mar 28, 2026', placeholder: 'Travel date' },
      { icon: Users, label: 'Passengers', value: '1 Adult', placeholder: 'Passengers' },
    ],
    buses: [
      { icon: MapPin, label: 'From', value: 'Ahmedabad', placeholder: 'From city' },
      { icon: MapPin, label: 'To', value: 'Rajkot', placeholder: 'To city' },
      { icon: Calendar, label: 'Date', value: 'Mar 28, 2026', placeholder: 'Travel date' },
      { icon: Users, label: 'Seats', value: '1 Seat', placeholder: 'Seats needed' },
    ],
    cabs: [
      { icon: MapPin, label: 'Pickup', value: 'Ahmedabad Airport', placeholder: 'Pickup location' },
      { icon: MapPin, label: 'Drop', value: 'Gandhinagar', placeholder: 'Drop location' },
      { icon: Calendar, label: 'Date', value: 'Mar 28, 2026', placeholder: 'Select date' },
      { icon: Clock, label: 'Time', value: '10:00 AM', placeholder: 'Pickup time' },
    ],
    holidays: [
      { icon: Globe, label: 'Destination', value: 'Bali, Indonesia', placeholder: 'Dream destination' },
      { icon: Calendar, label: 'Month', value: 'April 2026', placeholder: 'Travel month' },
      { icon: Users, label: 'Travelers', value: '2 Adults', placeholder: 'Add travelers' },
      { icon: Timer, label: 'Duration', value: '5 Nights', placeholder: 'Trip duration' },
    ],
  };

  const activeConfig = searchConfigs[activeTab] || searchConfigs.flights;
  const activeTabData = tabs.find(t => t.id === activeTab);

  const handleSearch = () => {
    if (activeTabData) {
      navigate(activeTabData.path);
    }
  };

  return (
    <div className="ng-search-bar">
      <div className="ng-booking-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ng-booking-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ng-search-glass">
        <div className="ng-search-row">
          {activeConfig.map((field, i) => (
            <div
              key={`${activeTab}-${i}`}
              className="ng-search-field"
              onClick={handleSearch}
            >
              <field.icon size={18} className="ng-search-field-icon" />
              <div className="ng-search-field-content">
                <span className="ng-search-field-label">{field.label}</span>
                <span className={`ng-search-field-value ${!field.value ? 'ng-search-field-placeholder' : ''}`}>
                  {field.value || field.placeholder}
                </span>
              </div>
            </div>
          ))}
          <button className="ng-search-btn" onClick={handleSearch}>
            <Search size={18} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   TRENDING DESTINATIONS
═══════════════════════════════════════════════════════════════════════════════ */
const DESTINATIONS = [
  {
    name: 'Bali, Indonesia',
    tag: '🔥 Trending',
    price: '₹32,999',
    image: '/images/destinations/bali.png',
    rating: 4.9,
    demand: 85,
  },
  {
    name: 'Dubai, UAE',
    tag: '✨ Popular',
    price: '₹28,499',
    image: '/images/destinations/dubai.png',
    rating: 4.8,
    demand: 72,
  },
  {
    name: 'Maldives',
    tag: '💎 Premium',
    price: '₹45,999',
    image: '/images/destinations/maldives.png',
    rating: 4.95,
    demand: 60,
  },
  {
    name: 'Paris, France',
    tag: '❤️ Romantic',
    price: '₹52,999',
    image: '/images/destinations/paris.png',
    rating: 4.85,
    demand: 55,
  },
  {
    name: 'Switzerland',
    tag: '🏔️ Adventure',
    price: '₹68,999',
    image: '/images/destinations/switzerland.png',
    rating: 4.9,
    demand: 48,
  },
];

const TrendingDestinations = () => {
  const revealRef = useReveal();

  return (
    <section className="ng-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px' }}>
      <div ref={revealRef} className="ng-reveal">
        <div className="ng-section-header">
          <div>
            <div className="ng-section-badge" style={{ marginBottom: 12 }}>
              <TrendingUp size={12} />
              Trending Now
            </div>
            <h2 className="ng-section-title">Explore Trending Destinations</h2>
            <p className="ng-section-subtitle">Handpicked places loved by millions of travelers worldwide</p>
          </div>
          <Link to="/holidays" className="ng-view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="ng-destinations-grid">
          {DESTINATIONS.map((dest, i) => (
            <Link to="/holidays" key={dest.name}
              className="ng-dest-card"
              style={{ animationDelay: `${i * 0.1}s`, animation: `ng-rise 0.6s ease-out ${i * 0.1}s both` }}
            >
              <img src={dest.image} alt={dest.name} className="ng-dest-img" loading="lazy" />
              <div className="ng-dest-overlay" />
              <div className="ng-dest-content">
                <span className="ng-dest-tag">{dest.tag}</span>
                <h3 className="ng-dest-name">{dest.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Star size={13} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>{dest.rating}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>• {dest.demand}% demand</span>
                </div>
                <div className="ng-demand-bar">
                  <div
                    className={`ng-demand-fill ${dest.demand > 70 ? 'high' : dest.demand > 40 ? 'medium' : 'low'}`}
                    style={{ width: `${dest.demand}%` }}
                  />
                </div>
                <div className="ng-dest-price-row">
                  <span className="ng-dest-price">From {dest.price}</span>
                  <span className="ng-dest-cta">
                    Explore <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   LIVE DEALS SECTION
═══════════════════════════════════════════════════════════════════════════════ */
const LIVE_DEALS = [
  {
    title: 'Delhi → Mumbai',
    type: 'Flight',
    icon: Plane,
    color: '#818cf8',
    original: '₹5,899',
    current: '₹3,249',
    discount: '45% OFF',
    meta: [{ icon: Clock, text: '2h 05m' }, { icon: Plane, text: 'IndiGo' }],
    seatsLeft: 4,
    expires: '2h left',
  },
  {
    title: 'Taj Hotel, Mumbai',
    type: 'Hotel',
    icon: Hotel,
    color: '#f472b6',
    original: '₹12,500',
    current: '₹7,999',
    discount: '36% OFF',
    meta: [{ icon: Star, text: '5 Star' }, { icon: MapPin, text: 'Gateway' }],
    seatsLeft: 2,
    expires: '4h left',
  },
  {
    title: 'Ahmedabad → Surat',
    type: 'Train',
    icon: Train,
    color: '#4ade80',
    original: '₹1,200',
    current: '₹699',
    discount: '42% OFF',
    meta: [{ icon: Clock, text: '1h 30m' }, { icon: Train, text: 'Shatabdi' }],
    seatsLeft: 12,
    expires: '6h left',
  },
  {
    title: 'Rajkot → Ahmedabad',
    type: 'Bus',
    icon: Bus,
    color: '#fbbf24',
    original: '₹600',
    current: '₹349',
    discount: '40% OFF',
    meta: [{ icon: Clock, text: '3h 15m' }, { icon: Bus, text: 'Volvo AC' }],
    seatsLeft: 8,
    expires: '8h left',
  },
  {
    title: 'Bali Package',
    type: 'Holiday',
    icon: Umbrella,
    color: '#a78bfa',
    original: '₹45,000',
    current: '₹29,999',
    discount: '33% OFF',
    meta: [{ icon: Calendar, text: '5N/6D' }, { icon: Star, text: '4 Star' }],
    seatsLeft: 6,
    expires: '12h left',
  },
];

const LiveDealsSection = () => {
  const scrollRef = useRef(null);
  const revealRef = useReveal();
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="ng-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div ref={revealRef} className="ng-reveal">
        <div className="ng-section-header">
          <div>
            <div className="ng-section-badge" style={{ marginBottom: 12, background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)', color: '#f87171' }}>
              <Flame size={12} />
              Live Deals
            </div>
            <h2 className="ng-section-title">
              Today's Best Deals{' '}
              <span style={{ fontSize: '0.6em', verticalAlign: 'super', color: '#4ade80', fontWeight: 700 }}>LIVE</span>
            </h2>
            <p className="ng-section-subtitle">Real-time prices updated every minute • Limited availability</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => scroll('left')} style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}>
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button onClick={() => scroll('right')} style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="ng-deals-scroll" ref={scrollRef}>
          {LIVE_DEALS.map((deal, i) => {
            const IconComp = deal.icon;
            return (
              <div key={i} className="ng-deal-card" style={{ animation: `ng-rise 0.5s ease-out ${i * 0.08}s both` }}>
                <div className="ng-deal-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: deal.color, padding: '2px 8px', borderRadius: 20, background: `${deal.color}15`, border: `1px solid ${deal.color}30`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {deal.type}
                      </span>
                    </div>
                    <h3 className="ng-deal-title">{deal.title}</h3>
                  </div>
                  <div className="ng-deal-icon-wrap" style={{ background: `${deal.color}15`, border: `1px solid ${deal.color}25` }}>
                    <IconComp size={22} color={deal.color} />
                  </div>
                </div>

                <div className="ng-deal-body">
                  <div className="ng-deal-price-row">
                    <span className="ng-deal-original">{deal.original}</span>
                    <span className="ng-deal-current">{deal.current}</span>
                    <span className="ng-deal-discount">{deal.discount}</span>
                  </div>

                  <div className="ng-deal-meta">
                    {deal.meta.map((m, j) => {
                      const MIcon = m.icon;
                      return (
                        <span key={j} className="ng-deal-meta-item">
                          <MIcon size={13} />
                          {m.text}
                        </span>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.7rem', color: deal.seatsLeft < 5 ? '#f87171' : '#94a3b8', fontWeight: 700 }}>
                        {deal.seatsLeft < 5 ? '🔥' : ''} Only {deal.seatsLeft} left
                      </span>
                    </div>
                    <div className="ng-demand-bar">
                      <div
                        className={`ng-demand-fill ${deal.seatsLeft < 5 ? 'high' : deal.seatsLeft < 10 ? 'medium' : 'low'}`}
                        style={{ width: `${Math.max(100 - deal.seatsLeft * 6, 15)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="ng-deal-footer">
                  <span className="ng-deal-urgency">
                    <span className="ng-deal-urgency-dot" />
                    {deal.expires}
                  </span>
                  <button 
                    className="ng-deal-book-btn"
                    onClick={() => showConfirm('Special Offer', `You've selected the ${deal.title} deal! This special rate is being held for you. Our agent will contact you shortly to complete the booking.`, null, 'alert')}
                  >
                    Book Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   AI RECOMMENDATIONS + LIVE BOOKING FEED
═══════════════════════════════════════════════════════════════════════════════ */
const AI_RECS = [
  {
    icon: TrendingUp,
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    title: 'Best Time to Book Flights',
    subtitle: 'AI Analysis',
    body: 'Based on 10M+ data points, booking flights on Tuesday evenings offers 23% lower fares on average for domestic routes.',
    match: '94% accuracy',
  },
  {
    icon: DollarSign,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.1)',
    title: 'Price Drop Expected',
    subtitle: 'Delhi → Bangalore',
    body: 'Our AI predicts a ₹800–₹1,200 fare drop in the next 3 days. We recommend waiting before booking this route.',
    match: '87% confidence',
  },
  {
    icon: Heart,
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.1)',
    title: 'Personalized Pick',
    subtitle: 'Based on your searches',
    body: 'Travelers who searched Dubai also loved Maldives packages. Check our exclusive 5N/6D all-inclusive deal starting ₹32,999.',
    match: '91% relevance',
  },
  {
    icon: BarChart3,
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    title: 'Weekend Rush Alert',
    subtitle: 'Travel Intelligence',
    body: 'This weekend shows 40% higher demand for Mumbai-Goa routes. Book now to lock in current prices before the surge hits.',
    match: '96% certainty',
  },
];

const LIVE_FEED = [
  { name: 'Aarav S.', route: 'DEL → BOM', type: 'Flight', amount: '₹3,249', time: '2 min ago', color: '#818cf8' },
  { name: 'Priya M.', route: 'Taj Mumbai', type: 'Hotel', amount: '₹7,999', time: '5 min ago', color: '#f472b6' },
  { name: 'Rahul K.', route: 'AMD → SUR', type: 'Train', amount: '₹699', time: '8 min ago', color: '#4ade80' },
  { name: 'Sneha P.', route: 'Bali Pkg', type: 'Holiday', amount: '₹29,999', time: '12 min ago', color: '#a78bfa' },
  { name: 'Vikram J.', route: 'RJK → AMD', type: 'Bus', amount: '₹349', time: '15 min ago', color: '#fbbf24' },
];

const AIRecommendationsSection = () => {
  const revealRef = useReveal();

  return (
    <section className="ng-section ng-ai-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div ref={revealRef} className="ng-reveal">
        <div className="ng-section-header">
          <div>
            <div className="ng-section-badge" style={{ marginBottom: 12, background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>
              <Sparkles size={12} />
              AI-Powered
            </div>
            <h2 className="ng-section-title">Smart Travel Insights</h2>
            <p className="ng-section-subtitle">AI-powered recommendations backed by real-time market intelligence</p>
          </div>
        </div>

        <div className="ng-ai-grid">
          {AI_RECS.map((rec, i) => {
            const IconComp = rec.icon;
            return (
              <div key={i} className="ng-ai-card" style={{ animation: `ng-rise 0.5s ease-out ${i * 0.1}s both` }}>
                <div className="ng-ai-card-header">
                  <div className="ng-ai-card-icon" style={{ background: rec.bg, border: `1px solid ${rec.color}25` }}>
                    <IconComp size={20} color={rec.color} />
                  </div>
                  <div>
                    <div className="ng-ai-card-title">{rec.title}</div>
                    <div className="ng-ai-card-subtitle">{rec.subtitle}</div>
                  </div>
                </div>
                <div className="ng-ai-card-body">{rec.body}</div>
                <div className="ng-ai-card-footer">
                  <span className="ng-ai-match">
                    <Zap size={12} />
                    {rec.match}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const revealRef = useReveal();

  const FEATURES = [
    { icon: Shield, color: '#818cf8', bg: 'rgba(129,140,248,0.1)', title: 'Secure Payments', desc: 'PCI-DSS compliant gateway' },
    { icon: Gift, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', title: 'Best Price Guarantee', desc: 'We match any lower fare' },
    { icon: Headphones, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', title: '24/7 Support', desc: 'Always here to help you' },
    { icon: RefreshCw, color: '#f472b6', bg: 'rgba(244,114,182,0.1)', title: 'Free Cancellation', desc: 'On select bookings' },
  ];

  return (
    <section className="ng-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 80px' }}>
      <div ref={revealRef} className="ng-reveal">
        <div className="ng-features-grid">
          {FEATURES.map((f, i) => {
            const IconComp = f.icon;
            return (
              <div key={i} className="ng-feature-card" style={{ animation: `ng-rise 0.5s ease-out ${i * 0.08}s both` }}>
                <div className="ng-feature-icon" style={{ background: f.bg, border: `1px solid ${f.color}20` }}>
                  <IconComp size={20} color={f.color} />
                </div>
                <div>
                  <div className="ng-feature-title">{f.title}</div>
                  <div className="ng-feature-desc">{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const revealRef = useReveal();
  const [bookingsCount, bookingsRef] = useAnimatedCounter(2847593, 2000);
  const [routesCount, routesRef] = useAnimatedCounter(52184, 2200);
  const [experienceCount, experienceRef] = useAnimatedCounter(98, 2500);
  const [supportCount, supportRef] = useAnimatedCounter(100, 1500);

  const stats = [
    { value: `${(bookingsCount / 1000000).toFixed(1)}M+`, label: 'Bookings', icon: CheckCircle2, color: '#818cf8', ref: bookingsRef },
    { value: `${(routesCount / 1000).toFixed(0)}K+`, label: 'Routes', icon: Navigation, color: '#4ade80', ref: routesRef },
    { value: `${(experienceCount / 20).toFixed(1)}★`, label: 'Rating', icon: Star, color: '#fbbf24', ref: experienceRef },
    { value: '24/7', label: 'Global Support', icon: Headphones, color: '#f472b6', ref: supportRef },
  ];

  return (
    <section className="ng-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 80px' }}>
      <div ref={revealRef} className="ng-reveal">
        <div className="ng-cta-section">
          <div className="ng-cta-content">
            <h2 className="ng-cta-title">
              Your Journey Starts With{' '}
              <span style={{
                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                TravelGo
              </span>
            </h2>
            <p className="ng-cta-desc">
              Download our app for exclusive mobile-only deals, real-time flight tracking,
              offline access to bookings, and instant notifications for price drops.
            </p>
            <div className="ng-cta-buttons">
              <button className="ng-cta-btn ng-cta-btn-primary">
                <Smartphone size={18} />
                Download App
              </button>
              <button className="ng-cta-btn ng-cta-btn-secondary">
                <Globe size={18} />
                Explore Deals
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ng-stats-grid">
              {stats.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <div key={i} ref={s.ref} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: '18px 20px', textAlign: 'center',
                    transition: 'all 0.3s'
                  }}>
                    <SIcon size={20} color={s.color} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: 2 }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { showConfirm } = useUI();
  const [usersCount, usersRef] = useAnimatedCounter(2847593, 2500);
  const [bookingsCount, bookingsRef] = useAnimatedCounter(158742, 2000);
  const [feedItems, setFeedItems] = useState(LIVE_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedItems(prev => {
        const newItem = {
          ...LIVE_FEED[Math.floor(Math.random() * LIVE_FEED.length)],
          time: 'Just now',
          name: ['Ankit D.', 'Meera R.', 'Sahil B.', 'Nisha T.', 'Karan V.'][Math.floor(Math.random() * 5)],
        };
        return [newItem, ...prev.slice(0, 4)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', fontFamily: "'Outfit', sans-serif", color: '#fff' }}>
      <section className="ng-hero" style={{ paddingBottom: 120 }}>
        <ParticleField />
        <div style={{
          position: 'absolute', top: '10%', left: '15%', width: 300, height: 300,
          borderRadius: '50%', border: '1px solid rgba(129,140,248,0.08)',
          animation: 'ng-glow-ring 6s ease-in-out infinite', zIndex: 0
        }} />

        <div className="ng-hero-content">
          <div style={{ position: 'relative', zIndex: 5 }}>
            <div className="ng-hero-badge">
              <span className="ng-live-indicator" />
              Next-Generation Travel Booking Ecosystem
            </div>
            <h1 className="ng-hero-title">
              Travel Smarter.<br />
              <span className="ng-gradient-text">Book Faster.</span>
            </h1>
            <p className="ng-hero-subtitle" style={{ maxWidth: '100%' }}>
              AI-powered price predictions and real-time social booking feed.
              The smartest travel engine ever built, now live.
            </p>
            <div className="ng-hero-stats">
              <div className="ng-hero-stat" ref={usersRef}>
                <div className="ng-hero-stat-value">{(usersCount / 1000000).toFixed(1)}M+</div>
                <div className="ng-hero-stat-label">Verified Travelers</div>
              </div>
              <div className="ng-hero-stat" ref={bookingsRef}>
                <div className="ng-hero-stat-value">{(bookingsCount / 1000).toFixed(0)}K+</div>
                <div className="ng-hero-stat-label">Bookings Today</div>
              </div>
            </div>
            <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
              <Link to="/flights" className="ng-admin-btn ng-admin-btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>Get Started <ArrowRight size={18} /></Link>
              <button className="ng-admin-btn ng-admin-btn-ghost" style={{ padding: '14px 28px', fontSize: '1rem' }}>Watch Demo</button>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 32,
            padding: 28,
            boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            position: 'relative',
            zIndex: 10,
            animation: 'ng-rise 0.8s ease-out 0.2s both'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div className="ng-live-indicator" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -0.5 }}>Live Activity Feed</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20 }}>Real-time Marketplace</span>
            </div>
            <div className="ng-feed-container" style={{ maxHeight: 380 }}>
              {feedItems.map((item, i) => (
                <div key={`${item.name}-${i}`} className="ng-feed-item" style={{
                  animationDelay: `${i * 0.1}s`,
                  background: 'rgba(255,255,255,0.03)',
                  marginBottom: 12,
                  borderRadius: 16,
                  padding: '14px 18px',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div className="ng-feed-avatar" style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="ng-feed-info">
                    <div className="ng-feed-text" style={{ fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 800 }}>{item.name}</span> booked <span style={{ color: item.color, fontWeight: 800 }}>{item.route}</span>
                    </div>
                    <div className="ng-feed-time" style={{ fontSize: '0.75rem' }}>
                      {item.type} • {item.time}
                    </div>
                  </div>
                  <div className="ng-feed-amount" style={{ fontSize: '0.95rem', fontWeight: 900, color: '#4ade80' }}>{item.amount}</div>
                </div>
              ))}
            </div>
            <div style={{
              textAlign: 'center',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.8rem',
              color: '#64748b',
              fontWeight: 600
            }}>
              Join <span style={{ color: '#fff' }}>2,847,593</span> happy travelers
            </div>
          </div>
        </div>
      </section>

      <TrendingDestinations />
      <LiveDealsSection />
      <AIRecommendationsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
