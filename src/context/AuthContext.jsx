import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = `\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = typeof user?.role === 'string' && user.role.toLowerCase().includes('admin');

  // Auto-login from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API}${url}`, { ...options, headers });
    const data = await res.json();
    if (res.status === 401 && token) {
      logout();
      throw new Error(data.message || 'Session expired. Please login again.');
    } else if (res.status === 401) {
      throw new Error(data.message || 'Invalid credentials.');
    }
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  }, [token]);

  const login = async (email, password) => {
    const data = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const register = async (name, email, phone, password) => {
    const data = await authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password })
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const updateProfile = async (updates) => {
    const data = await authFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const saveTrip = async (type, details) => {
    const data = await authFetch('/auth/saved-trips', { method: 'POST', body: JSON.stringify({ type, details }) });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const removeTrip = async (tripId) => {
    const data = await authFetch(`/auth/saved-trips/${tripId}`, { method: 'DELETE' });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const toggleWishlist = async (type, itemId, details) => {
    const data = await authFetch('/auth/wishlist', { method: 'POST', body: JSON.stringify({ type, itemId, details }) });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const addPaymentMethod = async (method) => {
    const data = await authFetch('/auth/payment-methods', { method: 'POST', body: JSON.stringify(method) });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const removePaymentMethod = async (id) => {
    const data = await authFetch(`/auth/payment-methods/${id}`, { method: 'DELETE' });
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  // Payment
  const createOrder = async (amount, type, details) => {
    return authFetch('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount, type, details }) });
  };

  const verifyPayment = async (paymentData) => {
    return authFetch('/payment/verify-payment', { method: 'POST', body: JSON.stringify(paymentData) });
  };

  const getBookings = async () => {
    return authFetch('/payment/bookings');
  };

  const getBooking = async (id) => {
    return authFetch(`/payment/bookings/${id}`);
  };

  const requestRefund = async (bookingId) => {
    return authFetch(`/payment/refund/${bookingId}`, { method: 'POST' });
  };

  const getInvoice = async (bookingId) => {
    return authFetch(`/payment/invoice/${bookingId}`);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!user,
      isAdmin,
      login, register, logout, updateProfile,
      saveTrip, removeTrip, toggleWishlist,
      addPaymentMethod, removePaymentMethod,
      createOrder, verifyPayment, getBookings, getBooking, requestRefund, getInvoice,
      authFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
