import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const getBaseUrl = () => {
  // Use VITE_API_URL if provided, otherwise fallback to Vite proxy path '/api'
  let url = import.meta.env.VITE_API_URL || '';
  if (!url) return '/api';
  
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const API = getBaseUrl();

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

    const fullUrl = `${API}${url}`;
    let res;
    try {
      console.log(`[authFetch] Fetching: ${fullUrl}`, options);
      res = await fetch(fullUrl, { ...options, headers });
    } catch (networkError) {
      console.error(`[authFetch] Network Error for ${fullUrl}:`, networkError);
      throw new Error(`Cannot connect to server at ${fullUrl}. Please make sure the backend is running.`);
    }

    // Safely parse JSON — handle empty or non-JSON responses
    let data;
    try {
      const text = await res.text();
      console.log(`[authFetch] URL: ${url}, Status: ${res.status}, Body: ${text}`);
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('[authFetch] Parse error:', parseError);
      // Detailed error for production debugging
      if (res.status === 404) {
        throw new Error(`API endpoint not found (404) at ${fullUrl}. If this is production, please ensure your VITE_API_URL is configured in Vercel.`);
      }
      throw new Error(`Server returned an invalid response from ${fullUrl}. This often happens if the backend URL is misconfigured in production.`);
    }

    if (res.status === 401) {
      if (token) logout();
      throw new Error(data.message || 'Invalid or expired session. Please login again.');
    }
    
    if (res.status === 429) {
      throw new Error(data.message || 'Too many attempts. Please try again in 15 minutes.');
    }

    if (!res.ok) {
      console.error(`[authFetch] API Error ${res.status}:`, data);
      const errorMsg = data.message || data.error || (res.statusText ? `Error ${res.status}: ${res.statusText}` : `Server error (${res.status})`);
      throw new Error(errorMsg);
    }
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
