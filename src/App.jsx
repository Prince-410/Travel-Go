import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminConfigProvider } from './context/AdminConfigContext';
import { UIProvider } from './context/UIContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AIChatbot from './components/AIChatbot';
import ScrollToTop from './components/ScrollToTop';
import LiquidBackdrop from './components/LiquidBackdrop';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const FlightPage = lazy(() => import('./pages/FlightPage'));
const BusPage = lazy(() => import('./pages/BusPage'));
const TrainPage = lazy(() => import('./pages/TrainPage'));
const HotelPage = lazy(() => import('./pages/HotelPage'));
const CabPage = lazy(() => import('./pages/CabPage'));
const HolidayPage = lazy(() => import('./pages/HolidayPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ReferEarnPage = lazy(() => import('./pages/ReferEarnPage'));
const GiftCardsPage = lazy(() => import('./pages/GiftCardsPage'));
const TravelInsurancePage = lazy(() => import('./pages/TravelInsurancePage'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CorporateTravelPage = lazy(() => import('./pages/CorporateTravelPage'));
const ListPropertyPage = lazy(() => import('./pages/ListPropertyPage'));
const FAQsPage = lazy(() => import('./pages/FAQsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const PressPage = lazy(() => import('./pages/PressPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
  };

  const getPageType = () => {
    const path = location.pathname;
    if (path === '/') return null;
    if (path === '/flights') return 'flight';
    if (path === '/hotels') return 'hotel';
    if (path === '/trains') return 'train';
    if (path === '/buses') return 'bus';
    if (path === '/cabs') return 'cab';
    if (path === '/holidays') return 'holiday';
    return 'default';
  };

  const bgImage = isAdminPage || location.pathname === '/'
    ? 'none' 
    : `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url("/images/${getPageType()}.png") center/cover fixed no-repeat`;

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/30" style={{ background: bgImage, position: 'relative' }}>
      <LiquidBackdrop />
      <ScrollToTop />
      {!isAdminPage && <Header onOpenAuth={() => setIsAuthOpen(true)} />}
      <main style={isAdminPage ? { padding: 0 } : {}}>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading travel experience...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flights" element={<FlightPage />} />
            <Route path="/hotels" element={<HotelPage />} />
            <Route path="/trains" element={<TrainPage />} />
            <Route path="/buses" element={<BusPage />} />
            <Route path="/cabs" element={<CabPage />} />
            <Route path="/holidays" element={<HolidayPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/refer-earn" element={<ReferEarnPage />} />
            <Route path="/gift-cards" element={<GiftCardsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/travel-insurance" element={<TravelInsurancePage />} />
            <Route path="/corporate-travel" element={<CorporateTravelPage />} />
            <Route path="/list-property" element={<ListPropertyPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/admin"
              element={
                loading
                  ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>Loading admin panel...</div>
                  : isAuthenticated && isAdmin
                  ? <AdminPanel />
                  : <Navigate to="/" />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => {
            if (isAuthenticated) setIsAuthOpen(false);
        }}
        onSuccess={handleAuthSuccess}
        isClosable={isAuthenticated}
      />
      {!isAdminPage && <Footer pageType={getPageType()} />}
      {!isAdminPage && <AIChatbot />}
    </div>
  );
}

const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <AdminConfigProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminConfigProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;
