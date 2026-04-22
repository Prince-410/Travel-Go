import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const AdminConfigContext = createContext(null);

const SOCKET_URL = '/';
const API = `\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

// Default config shape (used before server responds)
const DEFAULT_CONFIG = {
  services: {
    flights:  { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
    buses:    { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
    trains:   { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
    cabs:     { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
    hotels:   { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
    holidays: { enabled: true, cities: [], timeStart: '', timeEnd: '', surgePricing: 1.0, discount: 0 },
  },
  features: { seatSelection: true, liveTracking: true, aiSuggestions: true },
  injectedFeatures: [],
};

export const AdminConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [bookingCards, setBookingCards] = useState([]); // Real-time dynamic inventory
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // ----- Fetch initial config -----
  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch(`${API}/config`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch {
      // Server offline → use defaults silently
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookingCards = useCallback(async () => {
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/cards`);
      if (res.ok) {
        const data = await res.json();
        setBookingCards(data.cards || []);
      }
    } catch (err) {
      console.error('Failed to fetch initial booking cards', err);
    }
  }, []);

  // ----- Socket.io -----
  useEffect(() => {
    fetchConfig();
    fetchBookingCards();

    const socket = io(SOCKET_URL, { path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    
    // Config updates
    socket.on('config:update', (newConfig) => setConfig(newConfig));

    // Real-Time Universal Data Engine
    socket.on('NEW_BOOKING_CARD', (newCard) => {
      setBookingCards(prev => [newCard, ...prev]);
    });

    socket.on('UPDATE_BOOKING_CARD', (updatedCard) => {
      setBookingCards(prev => prev.map(c => c._id === updatedCard._id ? updatedCard : c));
    });

    socket.on('PRICE_UPDATE', (updatedCard) => {
      setBookingCards(prev => prev.map(c => c._id === updatedCard._id ? updatedCard : c));
    });

    socket.on('SEAT_UPDATE', ({ cardId, seatId, locked }) => {
      setBookingCards(prev => prev.map(c => {
        if (c._id !== cardId) return c;
        const newLocked = locked ? [...c.lockedSeats, seatId] : c.lockedSeats.filter(id => id !== seatId);
        return { ...c, lockedSeats: newLocked };
      }));
    });

    socket.on('DELETE_BOOKING_CARD', ({ id }) => {
      setBookingCards(prev => prev.filter(c => c._id !== id));
    });

    return () => { socket.disconnect(); };
  }, [fetchConfig, fetchBookingCards]);

  // ----- API helpers -----
  const updateService = useCallback(async (service, updates) => {
    try {
      const res = await fetch(`${API}/services/${service}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('updateService error:', err);
    }
  }, []);

  const updateFeatures = useCallback(async (updates) => {
    try {
      const res = await fetch(`${API}/features`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('updateFeatures error:', err);
    }
  }, []);

  const addInjectedFeature = useCallback(async (feature) => {
    try {
      const res = await fetch(`${API}/injected-features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(feature),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('addInjectedFeature error:', err);
    }
  }, []);

  const removeInjectedFeature = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/injected-features/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('removeInjectedFeature error:', err);
    }
  }, []);

  const toggleInjectedFeature = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/injected-features/${id}/toggle`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('toggleInjectedFeature error:', err);
    }
  }, []);

  // ----- Derived helpers -----
  const isServiceEnabled = useCallback((serviceName) => {
    return config?.services?.[serviceName]?.enabled ?? true;
  }, [config]);

  const getServiceConfig = useCallback((serviceName) => {
    return config?.services?.[serviceName] ?? DEFAULT_CONFIG.services[serviceName];
  }, [config]);

  return (
    <AdminConfigContext.Provider value={{
      config,
      bookingCards,
      connected,
      loading,
      isServiceEnabled,
      getServiceConfig,
      updateService,
      updateFeatures,
      addInjectedFeature,
      removeInjectedFeature,
      toggleInjectedFeature,
      refreshConfig: fetchConfig,
      refreshBookingCards: fetchBookingCards,
      socket: socketRef.current
    }}>
      {children}
    </AdminConfigContext.Provider>
  );
};

export const useAdminConfig = () => {
  const context = useContext(AdminConfigContext);
  if (!context) throw new Error('useAdminConfig must be used within AdminConfigProvider');
  return context;
};

export default AdminConfigContext;
