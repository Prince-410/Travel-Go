import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, CreditCard, Heart, Bookmark,
  Clock, Star, Shield, Settings, LogOut, ChevronRight, Plane, Bus,
  Train, Hotel, Car, Palmtree, Edit3, Wallet, CheckCircle2, X, Gift, Zap, TrendingUp, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import '../App.css';

const ACC = '#818cf8';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <User size={16} /> },
  { id: 'bookings', label: 'Booking History', icon: <Clock size={16} /> },
  { id: 'saved', label: 'Saved Trips', icon: <Bookmark size={16} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
  { id: 'jobs', label: 'Job Applications', icon: <Briefcase size={16} /> },
  { id: 'wallet', label: 'Wallet & Gifts', icon: <Wallet size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
];

const TYPE_ICONS = {
  flight: <Plane size={16} color="#818cf8" />,
  bus: <Bus size={16} color="#4ade80" />,
  train: <Train size={16} color="#818cf8" />,
  hotel: <Hotel size={16} color="#f59e0b" />,
  cab: <Car size={16} color="#a78bfa" />,
  holiday: <Palmtree size={16} color="#f472b6" />
};

const TYPE_COLORS = {
  flight: '#818cf8', bus: '#4ade80', train: '#818cf8',
  hotel: '#f59e0b', cab: '#a78bfa', holiday: '#f472b6'
};

const EmptyState = ({ icon, title, desc, actionText, onAction }) => (
  <div style={{
    background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '60px 40px', 
    textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.5s ease-out'
  }}>
    <div style={{ 
      fontSize: '4.5rem', marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(129,140,248,0.3))',
      animation: 'float 3s ease-in-out infinite'
    }}>{icon}</div>
    <h3 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 12, color: '#fff' }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 30, maxWidth: 300, margin: '0 auto 30px', lineHeight: 1.6 }}>{desc}</p>
    {actionText && (
      <button onClick={onAction} style={{
        background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff',
        border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 800,
        fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(99,102,241,0.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.3)'; }}>
        {actionText}
      </button>
    )}
    <style>{`
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  </div>
);

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile, getBookings, removeTrip, toggleWishlist, addPaymentMethod, removePaymentMethod } = useAuth();
  const { showConfirm, showToast } = useUI();
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [saveMsg, setSaveMsg] = useState('');
  const [jobApps, setJobApps] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (tab === 'bookings' && isAuthenticated) {
      setLoadingBookings(true);
      getBookings().then(data => { setBookings(data.bookings || []); setLoadingBookings(false); })
        .catch(() => setLoadingBookings(false));
    }
    if (tab === 'jobs' && isAuthenticated) {
      setLoadingJobs(true);
      fetch(`\/api/jobs/my-applications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => { setJobApps(data); setLoadingJobs(false); })
      .catch(() => setLoadingJobs(false));
    }
  }, [tab, isAuthenticated]);

  useEffect(() => {
    if (user) setEditForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', fontFamily: "'Outfit',sans-serif", color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔒</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Please Login</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Sign in to access your profile dashboard</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) { setSaveMsg('Error: ' + e.message); }
  };

  const stats = [
    { label: 'Bookings', value: bookings.length || user?.savedTrips?.length || 0, icon: <Calendar size={18} />, color: '#818cf8' },
    { label: 'Saved Trips', value: user?.savedTrips?.length || 0, icon: <Bookmark size={18} />, color: '#4ade80' },
    { label: 'Wishlist', value: user?.wishlist?.length || 0, icon: <Heart size={18} />, color: '#f472b6' },
    { label: 'Wallet', value: `₹${(user?.walletBalance || 0).toLocaleString()}`, icon: <Wallet size={18} />, color: '#fbbf24' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', fontFamily: "'Outfit',sans-serif", color: '#fff', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ position: 'relative', padding: '80px 20px 40px', background: 'rgba(5,5,20,0.5)', borderBottom: '1px solid rgba(129,140,248,0.15)' }}>
        <div style={{ position: 'absolute', top: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(129,140,248,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 900, color: '#fff',
            border: '3px solid rgba(129,140,248,0.3)'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{user?.name || 'Traveler'}</h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.85rem', color: '#94a3b8', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} color={ACC} /> {user?.email}</span>
              {user?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} color={ACC} /> {user?.phone}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={14} color="#4ade80" /> Verified Account</span>
            </div>
          </div>
          <button onClick={() => {
            showConfirm('Logout', 'Are you sure you want to exit your profile?', () => {
              logout();
              showToast('Logged out successfully.', 'info');
              window.location.href = '/';
            });
          }} style={{
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 10, padding: '10px 18px', color: '#f87171', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))',
              backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20,
              padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${s.color}44`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 14, 
                background: `${s.color}15`, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: `1px solid ${s.color}33`, color: s.color
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 240, flexShrink: 0 }}>
            <div style={{
              background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 10,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'sticky', top: 100
            }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    width: '100%', padding: '16px 20px', cursor: 'pointer',
                    background: tab === t.id ? 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(129,140,248,0.05))' : 'transparent',
                    color: tab === t.id ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                    borderRadius: 16, marginBottom: 4, transition: 'all 0.3s ease-in-out',
                    border: tab === t.id ? `1px solid rgba(129,140,248,0.2)` : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
                  onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
                >
                  <span style={{ color: tab === t.id ? ACC : 'inherit', transition: 'color 0.3s' }}>{t.icon}</span>
                  {t.label}
                  {tab === t.id && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: ACC, boxShadow: `0 0 10px ${ACC}` }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {tab === 'overview' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Profile Overview</h2>
                {saveMsg && (
                  <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: '14px 24px', marginBottom: 20, color: '#4ade80', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={14}/></div>
                    {saveMsg}
                  </div>
                )}
                <div style={{
                  background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 32,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                  {editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '0.75rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Email Address</label>
                          <div style={{ position: 'relative' }}>
                            <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: 12 }} />
                            <input value={user.email} disabled
                              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#64748b', fontSize: '0.95rem', fontWeight: 600, cursor: 'not-allowed', boxSizing: 'border-box' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Full Name</label>
                          <div style={{ position: 'relative' }}>
                            <User size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: 12 }} />
                            <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
                              onFocus={e => { e.target.style.borderColor = ACC; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Phone Number</label>
                          <div style={{ position: 'relative' }}>
                            <Phone size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: 12 }} />
                            <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
                              onFocus={e => { e.target.style.borderColor = ACC; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Gender</label>
                          <select style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none', appearance: 'none' }}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Date of Birth</label>
                          <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                        <button onClick={handleSaveProfile} style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.3)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>Save Changes</button>
                        <button onClick={() => setEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 28px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>Personal Details</h3>
                        <button onClick={() => setEditing(true)} style={{
                          background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)',
                          borderRadius: 12, padding: '8px 18px', color: '#818cf8', fontWeight: 800,
                          fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                          <Edit3 size={14} /> Update Profile
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {[
                          { label: 'Full Name', value: user?.name, icon: <User size={18} />, color: '#818cf8' },
                          { label: 'Email Address', value: user?.email, icon: <Mail size={18} />, color: '#4ade80' },
                          { label: 'Phone Number', value: user?.phone || 'Not provided', icon: <Phone size={18} />, color: '#fbbf24' },
                          { label: 'Member Type', value: 'Elite Traveler', icon: <Shield size={18} />, color: '#f472b6' },
                        ].map((item, i) => (
                          <div key={i} style={{ 
                            display: 'flex', alignItems: 'center', gap: 16,
                            background: 'rgba(255,255,255,0.02)', padding: '16px 20px',
                            borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            <div style={{ 
                              width: 44, height: 44, borderRadius: 12, 
                              background: `${item.color}15`, display: 'flex', 
                              alignItems: 'center', justifyContent: 'center', 
                              border: `1px solid ${item.color}33`, color: item.color
                            }}>{item.icon}</div>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</div>
                              <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: 2, color: '#fff' }}>{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Preferences */}
                <div style={{
                  background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginTop: 16
                }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Travel Preferences</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { label: 'Seat', value: user?.preferences?.seatPreference || 'Window', emoji: '💺' },
                      { label: 'Meal', value: user?.preferences?.mealPreference || 'Veg', emoji: '🍽️' },
                      { label: 'Class', value: user?.preferences?.classPreference || 'Economy', emoji: '✈️' },
                    ].map((p, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 10, padding: '12px 16px', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{p.emoji}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginBottom: 2 }}>{p.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'bookings' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>Booking History</h2>
                {loadingBookings ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
                    <p style={{ color: '#94a3b8' }}>Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <EmptyState 
                    icon="📋" 
                    title="No bookings yet" 
                    desc="Your booking history will appear here once you make your first reservation."
                    actionText="Start Booking"
                    onAction={() => window.location.href = '/'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {bookings.map((booking, i) => (
                      <div key={i} style={{
                        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(129,140,248,0.15)', borderRadius: 16,
                        padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20,
                        transition: 'transform 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}>
                        
                        {/* Type Icon */}
                        <div style={{ 
                          width: 48, height: 48, borderRadius: 14, 
                          background: `rgba(${TYPE_COLORS[booking.type] === '#4ade80' ? '74,222,128' : '129,140,248'}, 0.1)`, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px solid ${TYPE_COLORS[booking.type] || ACC}40`
                        }}>
                          {TYPE_ICONS[booking.type] || <Plane size={20} />}
                        </div>

                        {/* Booking Info */}
                        <div style={{ flex: 1.5 }}>
                           <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                             {booking.type} &bull; {booking.invoiceNumber || 'ID-' + booking._id?.slice(-6)}
                           </div>
                           <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                             {booking.details?.source && booking.details?.destination
                               ? `${booking.details.source} → ${booking.details.destination}`
                               : booking.details?.hotelName || booking.details?.packageName || `${booking.type} Booking`}
                           </div>
                           <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                             <Calendar size={12} /> {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>

                        {/* Route / Status Bar */}
                        <div style={{ flex: 1, minWidth: 100, textAlign: 'center' }}>
                            <div style={{ 
                              display: 'inline-block', padding: '4px 12px', borderRadius: 20, 
                              fontSize: '0.7rem', fontWeight: 800, 
                              background: booking.status === 'confirmed' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                              color: booking.status === 'confirmed' ? '#4ade80' : '#f87171',
                              border: `1px solid ${booking.status === 'confirmed' ? '#4ade8030' : '#f8717130'}`,
                              textTransform: 'uppercase', letterSpacing: 0.5
                            }}>
                              {booking.status}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 6, fontWeight: 600 }}>
                              Payment {booking.paymentStatus === 'completed' ? 'Received' : booking.paymentStatus}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div style={{ textAlign: 'right', minWidth: 100, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 20 }}>
                           <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginBottom: 2 }}>TOTAL PAID</div>
                           <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff' }}>₹{booking.amount?.toLocaleString('en-IN')}</div>
                           <button style={{ 
                             background: 'transparent', border: 'none', color: ACC, 
                             fontSize: '0.75rem', fontWeight: 700, marginTop: 4, 
                             cursor: 'pointer', padding: 0, textDecoration: 'underline' 
                           }}>View Invoice</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'saved' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Saved Trips</h2>
                {(!user?.savedTrips || user.savedTrips.length === 0) ? (
                  <EmptyState 
                    icon="📌" 
                    title="No saved trips" 
                    desc="Save interesting trips from your search results to plan them later."
                    actionText="Browse Flights"
                    onAction={() => window.location.href = '/flights'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {user.savedTrips.map((trip, i) => (
                      <div key={i} style={{
                        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(129,140,248,0.1)', borderRadius: 18, 
                        padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'rgba(15,23,42,0.95)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(15,23,42,0.8)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.1)'; }}>
                        <div style={{ 
                          width: 44, height: 44, borderRadius: 12, background: 'rgba(129,140,248,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(129,140,248,0.2)'
                        }}>
                          {TYPE_ICONS[trip.type] || <Bookmark size={20} color={ACC} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', textTransform: 'capitalize', color: '#fff' }}>{trip.type} Trip</div>
                          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} /> Saved on {new Date(trip.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <button onClick={() => removeTrip(trip._id)} style={{
                          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                          borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#f87171',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'wishlist' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Wishlist</h2>
                {(!user?.wishlist || user.wishlist.length === 0) ? (
                  <EmptyState 
                    icon="❤️" 
                    title="Wishlist is empty" 
                    desc="Heart your favorite deals while searching to save them here for later."
                    actionText="Explore Deals"
                    onAction={() => window.location.href = '/'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {user.wishlist.map((item, i) => (
                      <div key={i} style={{
                        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(244,114,182,0.15)', borderRadius: 18, 
                        padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(15,23,42,0.95)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(15,23,42,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ 
                          width: 44, height: 44, borderRadius: 12, background: 'rgba(244,114,182,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244,114,182,0.2)'
                        }}>
                          {TYPE_ICONS[item.type] || <Heart size={20} color="#f472b6" fill="#f472b6" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', textTransform: 'capitalize', color: '#fff' }}>{item.type} Deal</div>
                          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>
                            Added on {new Date(item.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <button onClick={() => toggleWishlist(item.type, item.itemId, item.details)} style={{
                          background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)',
                          borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f472b6'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,114,182,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <Heart size={18} color="#fff" fill="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'jobs' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Job Applications</h2>
                {loadingJobs ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}><p style={{ color: '#94a3b8' }}>Loading applications...</p></div>
                ) : (!jobApps || jobApps.length === 0) ? (
                  <EmptyState 
                    icon="💼" 
                    title="No applications yet" 
                    desc="Apply for open positions in the careers section to see them here."
                    actionText="View Careers"
                    onAction={() => window.location.href = '/about'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {jobApps.map((app, i) => (
                      <div key={i} style={{
                        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 30px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                             <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{app.jobTitle}</h3>
                             <span style={{ 
                               fontSize: '0.65rem', fontWeight: 900, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase',
                               background: app.status === 'accepted' ? '#4ade8020' : app.status === 'rejected' ? '#f8717120' : 'rgba(129,140,248,0.15)',
                               color: app.status === 'accepted' ? '#4ade80' : app.status === 'rejected' ? '#f87171' : ACC,
                               border: `1px solid ${app.status === 'accepted' ? '#4ade8040' : app.status === 'rejected' ? '#f8717140' : 'rgba(129,140,248,0.3)'}`
                             }}>{app.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 16, color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14}/> {new Date(app.createdAt).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={14}/> {app.experience}</span>
                          </div>
                          {app.adminNotes && (
                            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                               <div style={{ fontSize: '0.65rem', color: ACC, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Admin Response</div>
                               <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic' }}>"{app.adminNotes}"</p>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <button style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 12, padding: '8px 16px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'default' }}>
                             ID: {app._id.slice(-6).toUpperCase()}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {tab === 'wallet' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>My Wallet & Gifts</h2>
                  <div style={{ 
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', 
                    borderRadius: 12, padding: '10px 20px', color: '#4ade80', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    <Zap size={16}/> Total Balance: ₹{(user?.walletBalance || 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                   {/* Gifts History */}
                   <div style={{
                     background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 32,
                     boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                   }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(129,140,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACC }}><Gift size={20}/></div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Gifts Received</h3>
                      </div>

                      {(!user?.gifts || user.gifts.length === 0) ? (
                        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0', fontSize: '0.95rem' }}>No gift cards received yet. Your world-tour is waiting!</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {user.gifts.map((g, i) => (
                            <div key={i} style={{ 
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                                borderRadius: 16, padding: 20, transition: 'all 0.3s'
                            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>From: {g.senderName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.senderEmail}</div>
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#4ade80' }}>+₹{g.amount.toLocaleString()}</div>
                                </div>
                                {g.message && <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 10 }}>"{g.message}"</p>}
                                <div style={{ marginTop: 12, fontSize: '0.65rem', color: '#64748b', textAlign: 'right', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Received {new Date(g.receivedAt).toLocaleDateString()}
                                </div>
                            </div>
                          ))}
                        </div>
                      )}
                   </div>

                   {/* Add Funds / Info Card */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                        borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', position: 'relative', overflow: 'hidden'
                      }}>
                        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 16 }}>Redeem Voucher</h3>
                        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>Have a physical TravelGo coupon? Enter your 12-digit code below to instantly top up your wallet.</p>
                        <input placeholder="ENTER 12-DIGIT CODE" style={{ width: '100%', padding: '14px 18px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: 2, marginBottom: 16 }} />
                        <button style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#fff', color: '#1e1b4b', fontWeight: 900, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>REDEEM NOW</button>
                      </div>

                      <div style={{
                        background: 'rgba(15,23,42,0.8)', padding: 24, borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800 }}>Wallet Benefits</h4>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {[
                            'Zero transaction fees on bookings',
                            'Instant refunds for cancellations',
                            'Exclusive "Wallet-Only" flight deals',
                            'No expiration on gift card funds'
                          ].map((t, i) => (
                            <li key={i} style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle2 size={14} color="#4ade80"/> {t}</li>
                          ))}
                        </ul>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {tab === 'payments' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>Payment Methods</h2>
                  <button onClick={() => {/* Add PM Modal Logic here */}} style={{
                    background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
                    borderRadius: 10, padding: '8px 16px', color: ACC, fontWeight: 700,
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.1)'}>
                    + Add New
                  </button>
                </div>
                {(!user?.paymentMethods || user.paymentMethods.length === 0) ? (
                  <EmptyState 
                    icon="💳" 
                    title="No payment methods" 
                    desc="Save your credit or debit cards for faster and secure one-click checkouts."
                    actionText="Add My First Card"
                    onAction={() => {/* Open Add PM Modal */}}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {user.paymentMethods.map((pm, i) => (
                      <div key={i} style={{
                        background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.8))',
                        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, padding: '24px', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'rgba(129,140,248,0.05)', borderRadius: '50%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                          <div style={{ 
                            width: 48, height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <CreditCard size={20} color="#fff" />
                          </div>
                          {pm.isDefault && <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: '0.6rem', fontWeight: 800, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(74,222,128,0.3)', textTransform: 'uppercase' }}>Primary</span>}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: 1.5, color: '#fff', marginBottom: 12 }}>•••• •••• •••• {pm.last4 || '4242'}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Card Holder</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>{user.name}</div>
                          </div>
                          <button onClick={() => removePaymentMethod(pm._id)} style={{
                            background: 'rgba(248,113,113,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#f87171',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Account Settings</h2>
                <div style={{
                  background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 32,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                  {[
                    { label: 'Push Notifications', desc: 'Get instant alerts for price drops & booking status', active: user?.preferences?.notifications !== false, icon: <Zap size={18}/>, color: '#fbbf24' },
                    { label: 'Marketplace Deals', desc: 'Receive personalized travel offers based on interest', active: true, icon: <Gift size={18}/>, color: '#f472b6' },
                    { label: 'Two-Factor Auth', desc: 'Secure your account with an extra layer of protection', active: false, icon: <Shield size={18}/>, color: '#4ade80' },
                    { label: 'Travel Analytics', desc: 'Allow tracking to generate your travel insights', active: true, icon: <TrendingUp size={18}/>, color: '#818cf8' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}20`, color: s.color }}>{s.icon}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{s.label}</div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>{s.desc}</div>
                        </div>
                      </div>
                      <div style={{
                        width: 52, height: 28, borderRadius: 14, cursor: 'pointer',
                        background: s.active ? `linear-gradient(135deg, ${ACC}, #6366f1)` : 'rgba(255,255,255,0.1)',
                        position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: s.active ? `0 0 20px ${ACC}44` : 'none'
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: 4, left: s.active ? 28 : 4, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32, padding: '24px', borderRadius: 24, background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f87171' }}>Danger Zone</div>
                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>Permanently delete your account and all data</div>
                   </div>
                   <button style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
