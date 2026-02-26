import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ListingPage from './pages/ListingPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import PressPage from './pages/PressPage';
import FAQsPage from './pages/FAQsPage';
import CorporateTravelPage from './pages/CorporateTravelPage';
import GiftCardsPage from './pages/GiftCardsPage';
import ReferEarnPage from './pages/ReferEarnPage';
import TravelInsurancePage from './pages/TravelInsurancePage';
import ListPropertyPage from './pages/ListPropertyPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';
  const isAdminPage = location.pathname === '/admin';
  const isInfoPage = ['/about', '/contact', '/privacy', '/refund', '/careers', '/blog', '/press', '/faqs', '/corporate-travel', '/gift-cards', '/refer-earn', '/travel-insurance', '/list-property'].includes(location.pathname);

  const getPageType = () => {
    if (location.pathname === '/hotels') return 'hotel';
    if (location.pathname === '/trains') return 'train';
    if (location.pathname === '/buses') return 'bus';
    if (location.pathname === '/cabs') return 'cab';
    if (location.pathname === '/holidays') return 'holiday';
    return 'flight'; 
  };

  return (
    <div className="App">
      <ScrollToTop />
      {!isAuthPage && !isAdminPage && <Header />}
      <main style={isAuthPage || isAdminPage ? { padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<ListingPage type="flight" title="Book Your Next Journey" subtitle="Flights, Hotels, Trains & More" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/corporate-travel" element={<CorporateTravelPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/refer-earn" element={<ReferEarnPage />} />
          <Route path="/travel-insurance" element={<TravelInsurancePage />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/hotels" element={<ListingPage type="hotel" title="Find Your Perfect Stay" subtitle="Discover luxury hotels, resorts & more" />} />
          <Route path="/trains" element={<ListingPage type="train" title="Train Ticket Booking" subtitle="Fast & Reliable Train Services" />} />
          <Route path="/buses" element={<ListingPage type="bus" title="Bus Ticket Booking" subtitle="Comfortable Bus Journeys" />} />
          <Route path="/cabs" element={<ListingPage type="cab" title="Book a Cab" subtitle="Reliable Cabs for Local & Outstation" />} />
          <Route path="/holidays" element={<ListingPage type="holiday" title="Holiday Packages" subtitle="Create Memories that Last Forever" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer pageType={getPageType()} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
