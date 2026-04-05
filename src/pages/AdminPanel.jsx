import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Users, User, Building2, Plane, Bus, Train, Car, Briefcase, DollarSign, Calendar, Settings, LogOut, Search, Eye, Edit, Trash2, Activity, PlusCircle, Zap, ToggleLeft, ToggleRight, Wifi, WifiOff, MapPin, Clock, Percent, TrendingUp, Sparkles, X, CheckCircle, XCircle, AlertCircle, RefreshCw, FileText, Mail, Link2, BookOpen, ChevronDown, ShieldCheck, Gift, Phone, Shield, Award
} from 'lucide-react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import '../App.css';
import '../styles/NextGen.css';
import '../styles/NextGenAdmin.css';
import '../styles/GlobalEnhancements.css';

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff8042','#00C49F'];

const ModernSelect = ({ value, onChange, options, placeholder, style={} }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: style.width || 160 }}>
      <div onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '8px 12px', transition: 'border-color 0.2s',
        borderColor: open ? '#818cf8' : 'rgba(255,255,255,0.1)',
        ...style
      }}>
        <span style={{ flex: 1, fontSize: '0.85rem', color: selected ? '#fff' : 'var(--text-light)', fontWeight: selected ? 600 : 400 }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} color="#818cf8" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
          background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden'
        }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                background: value === opt.value ? 'rgba(129,140,248,0.15)' : 'transparent',
                transition: 'background 0.15s', fontSize: '0.85rem'
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = 'rgba(129,140,248,0.08)'; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ fontWeight: 600, color: value === opt.value ? '#818cf8' : '#e2e8f0' }}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const SERVICE_META = {
  flights:  { icon: <Plane size={20}/>, label: 'Flights', color: '#818cf8' },
  buses:    { icon: <Bus size={20}/>, label: 'Buses', color: '#34d399' },
  trains:   { icon: <Train size={20}/>, label: 'Trains', color: '#fbbf24' },
  cabs:     { icon: <Car size={20}/>, label: 'Cabs', color: '#f87171' },
  hotels:   { icon: <Building2 size={20}/>, label: 'Hotels', color: '#a78bfa' },
  holidays: { icon: <Briefcase size={20}/>, label: 'Holidays', color: '#fb923c' },
};

const TYPE_FIELDS = {
  flight: [
    { name: 'airline', label: 'Airline Name', placeholder: 'e.g. Indigo, Air India' },
    { name: 'aircraft', label: 'Aircraft Type', placeholder: 'e.g. Boeing 737, Airbus A320' },
    { name: 'baggage', label: 'Check-in Baggage', placeholder: 'e.g. 15kg, 25kg' }
  ],
  bus: [
    { name: 'operator', label: 'Operator Name', placeholder: 'e.g. ZingBus, SRS Travels' },
    { name: 'busType', label: 'Bus Model/Category', placeholder: 'e.g. Volvo AC Sleeper, Semi-Sleeper' },
    { name: 'rating', label: 'User Rating (1-5)', placeholder: 'e.g. 4.5' }
  ],
  hotel: [
    { name: 'stars', label: 'Star Rating', placeholder: 'e.g. 5-Star, 4-Star' },
    { name: 'amenities', label: 'Amenities (Comma separated)', placeholder: 'e.g. WiFi, Pool, Breakfast' }
  ],
  train: [
    { name: 'trainNumber', label: 'Train Number/Name', placeholder: 'e.g. 12952 (Rajdhani Express)' },
    { name: 'class', label: 'Coach Class', placeholder: 'e.g. 3A, 2A, Sleeper' }
  ],
  cab: [
    { name: 'carModel', label: 'Vehicle Model', placeholder: 'e.g. Toyota Innova, Maruti Dzire' },
    { name: 'carType', label: 'Category', placeholder: 'e.g. SUV, Sedan, Luxury' }
  ],
  holiday: [
    { name: 'duration', label: 'Package Duration', placeholder: 'e.g. 5 Days / 4 Nights' },
    { name: 'highlights', label: 'Package Includes', placeholder: 'e.g. Hotel, Flights, Meals, Sightseeing' }
  ]
};

const BOOKING_API = 'http://localhost:5000/api/admin/bookings';
const USER_API = 'http://localhost:5000/api/admin/users';
const CONTACT_API = 'http://localhost:5000/api/admin/contacts';

const AdminPanel = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Internal Security Guard: Re-verify access role on mount
    useEffect(() => {
        if (!authLoading && !isAdmin) {
            navigate('/');
        }
    }, [isAdmin, authLoading, navigate]);

    if (authLoading || !isAdmin) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#020617', color: '#fff' }}>
                <Activity size={40} style={{ animation: 'spin 1s linear infinite', color: '#818cf8', marginBottom: 15 }} />
                <span style={{ fontWeight: 800, letterSpacing: -0.5, fontSize: '1.1rem' }}>Verifying Admin Access...</span>
            </div>
        );
    }
  const { config, connected, bookingCards, refreshBookingCards, socket, updateService, updateFeatures, addInjectedFeature, removeInjectedFeature, toggleInjectedFeature } = useAdminConfig();
  const { logout, user } = useAuth();
  const { showToast, showConfirm } = useUI();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newFeature, setNewFeature] = useState({ title:'', description:'', type:'promotion', icon:'🎉' });
  const [cityInput, setCityInput] = useState({});

  useEffect(() => {
    let savedUser = null;
    try {
      const userStr = localStorage.getItem('user');
      savedUser = userStr ? JSON.parse(userStr) : null;
    } catch {
      savedUser = null;
    }
    const role = savedUser?.role;
    const isAdmin = role === 'admin' || (typeof role === 'string' && role.toLowerCase().includes('admin'));
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, []);

  const getAuth = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

  const getInitials = (name) => {
    if (!name) return '?';
    const split = name.split(' ');
    if (split.length > 1) return (split[0][0] + split[split.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // ── Inventory Management State (BookingCards) ──
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardFilter, setCardFilter] = useState({ type:'', search:'' });
  const [cardForm, setCardForm] = useState({ type:'flight', title:'', source:'', destination:'', date:'', startTime:'', arrivalTime:'', price:'', totalSeats:'', availableSeats:'', status:'active', dynamicPricing:true, featuresStr: '{}', rooms: [] });
  const [dynamicFeatures, setDynamicFeatures] = useState({});

  const handleSaveCard = async () => {
    if (!cardForm.title || !cardForm.price || !cardForm.totalSeats) {
        showToast('Please fill all mandatory fields.', 'warning');
        return;
    }
    const fields = TYPE_FIELDS[cardForm.type] || [];
    for (const f of fields) {
        if (!dynamicFeatures[f.name]) {
            showToast(`${f.label} is required for ${cardForm.type} listings.`, 'warning');
            return;
        }
    }
    
    try {
      const url = editingCard ? `http://localhost:5000/api/admin/cards/${editingCard._id}` : `http://localhost:5000/api/admin/cards`;
      const method = editingCard ? 'PATCH' : 'POST';
      let parsedFeatures = { ...dynamicFeatures };
      try { 
        const jsonFeatures = JSON.parse(cardForm.featuresStr || '{}');
        parsedFeatures = { ...parsedFeatures, ...jsonFeatures };
      } catch(e) {}
      
      const body = { 
        ...cardForm, 
        price: Number(cardForm.price), 
        totalSeats: Number(cardForm.totalSeats),
        availableSeats: Number(cardForm.availableSeats || cardForm.totalSeats),
        status: cardForm.status || 'active',
        features: { 
          ...parsedFeatures, 
          rooms: (cardForm.type === 'hotel' || cardForm.type === 'holiday') ? cardForm.rooms : undefined 
        }
      };
      
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json', ...getAuth()}, body: JSON.stringify(body) });
      if (res.ok) { 
        setShowCardModal(false); 
        setEditingCard(null); 
        resetCardForm(); 
        showToast(editingCard ? 'Inventory updated successfully!' : 'New item added to inventory!', 'success');
        refreshBookingCards();
      }
      else { const d=await res.json(); showToast(d.message, 'error'); }
    } catch(e) { console.error(e); }
  };

  const handleDeleteCard = async (id) => {
    showConfirm('Delete Item', 'Are you sure you want to delete this inventory item? This action cannot be undone.', async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/cards/${id}`, { method:'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Inventory item deleted.', 'success');
           refreshBookingCards();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch(e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  const openCardEditModal = (c) => {
    setEditingCard(c);
    setCardForm({ 
      type:c.type, title:c.title, source:c.source||'', destination:c.destination||'', 
      date:c.date||'', startTime:c.startTime||c.time||'', arrivalTime:c.arrivalTime||'', 
      price:c.price, totalSeats:c.totalSeats, availableSeats:c.availableSeats || c.totalSeats,
      status:c.status || 'active',
      dynamicPricing:c.dynamicPricing, 
      featuresStr: JSON.stringify(c.features||{}, null, 2),
      rooms: c.features?.rooms || []
    });
    setDynamicFeatures(c.features || {});
    setShowCardModal(true);
  };
  const resetCardForm = () => {
    setCardForm({ type:'flight', title:'', source:'', destination:'', date:'', startTime:'', arrivalTime:'', price:'', totalSeats:'', availableSeats:'', status:'active', dynamicPricing:true, featuresStr: '{}', rooms: [] });
    setDynamicFeatures({});
  };

  // ── Booking Management State ──
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState({ status:'', type:'', search:'' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({ userEmail:'', type:'flight', amount:'', status:'confirmed', paymentStatus:'completed', details:{ source:'', destination:'', date:'', passengers:1 } });

  const fetchBookings = useCallback(async () => {
    setBookingLoading(true);
    try {
      const params = new URLSearchParams();
      if (bookingFilter.status) params.set('status', bookingFilter.status);
      if (bookingFilter.type) params.set('type', bookingFilter.type);
      if (bookingFilter.search) params.set('search', bookingFilter.search);
      const res = await fetch(`${BOOKING_API}?${params}`, { headers: getAuth() });
      if (res.ok) { const d = await res.json(); setBookings(d.bookings || []); }
    } catch(e) { console.error(e); }
    setBookingLoading(false);
  }, [bookingFilter]);

  const fetchBookingStats = useCallback(async () => {
    try {
      const res = await fetch(`${BOOKING_API}/stats`, { headers: getAuth() });
      if (res.ok) setBookingStats(await res.json());
    } catch(e) { console.error(e); }
  }, []);

  // useEffect for bookings removed (consolidated below)


  const handleSaveBooking = async () => {
    try {
      const url = editingBooking ? `${BOOKING_API}/${editingBooking._id}` : BOOKING_API;
      const method = editingBooking ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json', ...getAuth()}, body: JSON.stringify(bookingForm) });
      if (res.ok) { setShowBookingModal(false); setEditingBooking(null); resetBookingForm(); fetchBookings(); fetchBookingStats(); }
    } catch(e) { console.error(e); }
  };

  const handleDeleteBooking = async (id) => {
    showConfirm('Delete Booking', 'Permanently remove this booking record? Statistics will be updated accordingly.', async () => {
      try {
        const res = await fetch(`${BOOKING_API}/${id}`, { method:'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Booking deleted.', 'success');
           fetchBookings(); fetchBookingStats();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch(e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`${BOOKING_API}/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json', ...getAuth()}, body: JSON.stringify({ status }) });
      fetchBookings(); fetchBookingStats();
    } catch(e) { console.error(e); }
  };

  const openEditModal = (b) => {
    setEditingBooking(b);
    setBookingForm({ userEmail: b.userId?.email||'', type: b.type, amount: b.amount, status: b.status, paymentStatus: b.paymentStatus, details: b.details||{} });
    setShowBookingModal(true);
  };

  const resetBookingForm = () => setBookingForm({ userEmail:'', type:'flight', amount:'', status:'confirmed', paymentStatus:'completed', details:{ source:'', destination:'', date:'', passengers:1 } });

  // ── User Management State ──
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userFilter, setUserFilter] = useState({ role:'', search:'' });
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name:'', email:'', phone:'', role:'user', password:'' });

  const fetchUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      const params = new URLSearchParams();
      if (userFilter.role) params.set('role', userFilter.role);
      if (userFilter.search) params.set('search', userFilter.search);
      const res = await fetch(`${USER_API}?${params}`, { headers: getAuth() });
      if (res.ok) { const d = await res.json(); setUsers(d.users || []); }
    } catch(e) { console.error(e); }
    setUserLoading(false);
  }, [userFilter]);

  const fetchUserStats = useCallback(async () => {
    try {
      const res = await fetch(`${USER_API}/stats`, { headers: getAuth() });
      if (res.ok) setUserStats(await res.json());
    } catch(e) { console.error(e); }
  }, []);

  // ── Contact & Feedback Management ──
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState({ type:'', status:'' });

  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (contactFilter.type) params.set('type', contactFilter.type);
      if (contactFilter.status) params.set('status', contactFilter.status);
      const res = await fetch(`${CONTACT_API}?${params}`, { headers: getAuth() });
      if (res.ok) {
        const d = await res.json();
        setContacts(d.contacts || []);
      }
    } catch (e) { console.error(e); }
  }, [contactFilter]);

  // ── Job Application Management ──
  const [jobApps, setJobApps] = useState([]);
  const [jobFilter, setJobFilter] = useState({ status: '', search: '' });

  const fetchJobApps = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/admin/all', { headers: getAuth() });
      if (res.ok) {
        setJobApps(await res.json());
      } else {
        const d = await res.json();
        showToast(`Failed to load applications: ${d.message || 'Error occurred.'}`, 'error');
      }
    } catch (e) { 
      console.error(e); 
      showToast('Offline: Could not fetch job applications.', 'error');
    }
  }, []);

  const updateJobStatus = async (id, status, notes = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/admin/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuth() },
        body: JSON.stringify({ status, adminNotes: notes })
      });
      if (res.ok) fetchJobApps();
    } catch (e) { console.error(e); }
  };

  const handleDeleteJobApp = async (id) => {
    showConfirm('Delete Application', 'Permanently remove this job application?', async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/admin/${id}`, { method: 'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Job application record deleted.', 'success');
           fetchJobApps();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch (e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  // ── Press & Media Management ──
  const [pressReleases, setPressReleases] = useState([]);
  const [showPressModal, setShowPressModal] = useState(false);
  const [editingPress, setEditingPress] = useState(null);
  const [pressForm, setPressForm] = useState({ title: '', category: 'Company News', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), excerpt: '', content: '' });

  const fetchPressReleases = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/press');
      if (res.ok) setPressReleases(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const handleSavePress = async () => {
    try {
      const url = editingPress ? `http://localhost:5000/api/press/${editingPress._id}` : 'http://localhost:5000/api/press';
      const method = editingPress ? 'PUT' : 'POST';
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json', ...getAuth() }, 
        body: JSON.stringify(pressForm) 
      });
      if (res.ok) { setShowPressModal(false); setEditingPress(null); setPressForm({ title: '', category: 'Company News', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), excerpt: '', content: '' }); fetchPressReleases(); }
    } catch (e) { console.error(e); }
  };

  const handleDeletePress = async (id) => {
    showConfirm('Delete Press Release', 'Are you sure? This will remove the release from the public press page.', async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/press/${id}`, { method: 'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Press release removed.', 'success');
           fetchPressReleases();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch (e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  // ── Blog Management ──
  const [blogs, setBlogs] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Travel Tips', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), author: '', excerpt: '', content: '', image: '🏝️' });

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      if (res.ok) setBlogs(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const handleSaveBlog = async () => {
    try {
      const url = editingBlog ? `http://localhost:5000/api/blogs/${editingBlog._id}` : 'http://localhost:5000/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json', ...getAuth() }, 
        body: JSON.stringify(blogForm) 
      });
      if (res.ok) { setShowBlogModal(false); setEditingBlog(null); setBlogForm({ title: '', category: 'Travel Tips', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), author: '', excerpt: '', content: '', image: '🏝️' }); fetchBlogs(); }
    } catch (e) { console.error(e); }
  };

  const handleDeleteBlog = async (id) => {
    showConfirm('Delete Blog Post', 'Remove this story? This action is permanent.', async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`, { method: 'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Blog post deleted.', 'success');
           fetchBlogs();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch (e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  // ── Property Management ──
  const [properties, setProperties] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState({ status:'', type:'', search:'' });

  const fetchProperties = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (propertyFilter.status) params.set('status', propertyFilter.status);
      if (propertyFilter.type) params.set('type', propertyFilter.type);
      if (propertyFilter.search) params.set('search', propertyFilter.search);
      const res = await fetch(`http://localhost:5000/api/admin/properties?${params}`, { headers: getAuth() });
      if (res.ok) {
        setProperties(await res.json());
      } else {
        const d = await res.json();
        showToast(d.message || 'Error occurred fetching property applications.', 'error');
      }
    } catch (e) { 
      console.error(e); 
      showToast('Offline: Could not connect to property service.', 'error');
    }
  }, [propertyFilter]);

  const updatePropertyStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/properties/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuth() },
        body: JSON.stringify({ status })
      });
      fetchProperties();
    } catch (e) { console.error(e); }
  };

  const deleteProperty = async (id) => {
    showConfirm('Remove Application', 'Are you sure you want to delete this property request?', async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/properties/${id}`, { method:'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Property application deleted.', 'success');
           fetchProperties();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch(e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };

  const [ledgerStats, setLedgerStats] = useState({ revenue: 0, giftCardRevenue: 0, insuranceRevenue: 0, giftCards: [], insurances: [], topReferrers: [] });
  const fetchLedger = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats/dashboard', { headers: getAuth() });
      if (res.ok) {
        const data = await res.json();
        setLedgerStats(p => ({ ...p, ...data }));
      } else {
        throw new Error('Could not load dashboard statistics');
      }
      
      const gcRes = await fetch('http://localhost:5000/api/admin/stats/gift-cards', { headers: getAuth() });
      if (gcRes.ok) {
        const gcData = await gcRes.json();
        setLedgerStats(p => ({ ...p, giftCards: gcData }));
      }
      
      const insRes = await fetch('http://localhost:5000/api/insurance/admin/all', { headers: getAuth() });
      if (insRes.ok) {
        const insData = await insRes.json();
        setLedgerStats(p => ({ ...p, insurances: insData }));
      }
    } catch (e) { 
        console.error(e);
        showToast('Revenue service is momentarily unavailable.', 'error');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') { fetchBookings(); fetchBookingStats(); }
    if (activeTab === 'users') { fetchUsers(); fetchUserStats(); }
    if (activeTab === 'feedback') { fetchContacts(); }
    if (activeTab === 'jobs') { fetchJobApps(); }
    if (activeTab === 'press') { fetchPressReleases(); }
    if (activeTab === 'blogs') { fetchBlogs(); }
    if (activeTab === 'properties') { fetchProperties(); }
    if (activeTab === 'revenue') { fetchLedger(); }
  }, [activeTab, fetchBookings, fetchBookingStats, fetchUsers, fetchUserStats, fetchContacts, fetchJobApps, fetchPressReleases, fetchBlogs, fetchProperties, fetchLedger]);
  
  // Real-time auto-refresh for applications
  useEffect(() => {
    if (!socket) return;
    const handleNewJob = () => { showToast('New Job Application received!', 'info'); fetchJobApps(); };
    const handleNewProp = () => { showToast('New Property Application received!', 'info'); fetchProperties(); };
    const handleNewFeedback = () => { showToast('New User Feedback received!', 'info'); fetchContacts(); };
    
    const handleNewGC = () => { showToast('New Gift Card purchased!', 'success'); fetchLedger(); };
    const handleNewIns = (p) => { showToast(`New Insurance Plan: ${p.plan}`, 'success'); fetchLedger(); };
    const handleNewRef = () => { showToast('New Referral Invite sent!', 'info'); fetchLedger(); };

    socket.on('NEW_JOB_APPLICATION', handleNewJob);
    socket.on('NEW_PROPERTY_APPLICATION', handleNewProp);
    socket.on('NEW_FEEDBACK', handleNewFeedback);
    socket.on('NEW_GIFTCARD', handleNewGC);
    socket.on('NEW_INSURANCE_PURCHASE', handleNewIns);
    socket.on('NEW_REFERRAL_INVITE', handleNewRef);
    
    return () => {
      socket.off('NEW_JOB_APPLICATION', handleNewJob);
      socket.off('NEW_PROPERTY_APPLICATION', handleNewProp);
      socket.off('NEW_FEEDBACK', handleNewFeedback);
      socket.off('NEW_GIFTCARD', handleNewGC);
      socket.off('NEW_INSURANCE_PURCHASE', handleNewIns);
      socket.off('NEW_REFERRAL_INVITE', handleNewRef);
    };
  }, [socket, fetchJobApps, fetchProperties, fetchContacts]);

  const handleContactStatus = async (id, status) => {
    try {
      await fetch(`${CONTACT_API}/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuth() }, body: JSON.stringify({ status }) });
      fetchContacts();
    } catch (e) { console.error(e); }
  };

  const handleContactDelete = async (id) => {
    showConfirm('Delete Ticket', 'Remove this feedback ticket permanently?', async () => {
      try {
        const res = await fetch(`${CONTACT_API}/${id}`, { method: 'DELETE', headers: getAuth() });
        if (res.ok) {
           showToast('Feedback ticket deleted.', 'success');
           fetchContacts();
        } else {
           const d = await res.json();
           showToast(d.message || 'Error occurred.', 'error');
        }
      } catch (e) { console.error(e); showToast('Offline: Could not delete.', 'error'); }
    });
  };






  const handleSaveUser = async () => {
    try {
      const url = editingUser ? `${USER_API}/${editingUser._id}` : USER_API;
      const method = editingUser ? 'PUT' : 'POST';
      const body = { ...userForm };
      if (editingUser && !body.password) delete body.password; // don't send empty password on edit
      
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json', ...getAuth()}, body: JSON.stringify(body) });
      if (res.ok) { 
        showToast(editingUser ? 'User profile updated!' : 'New user created successfully.', 'success');
        setShowUserModal(false); setEditingUser(null); resetUserForm(); fetchUsers(); fetchUserStats(); 
      }
      else { const d=await res.json(); showToast(d.message, 'error'); }
    } catch(e) { console.error(e); }
  };

  const handleDeleteUser = async (id) => {
    showConfirm('Delete User', 'Delete this user permanently? This is irreversible and will remove all their data.', async () => {
      try {
        const res = await fetch(`${USER_API}/${id}`, { method:'DELETE', headers: getAuth() });
        if (res.ok) { 
          showToast('User deleted successfully.', 'info');
          fetchUsers(); fetchUserStats(); 
        }
        else { const d=await res.json(); showToast(d.message, 'error'); }
      } catch(e) { console.error(e); }
    });
  };

  const openUserEditModal = (u) => {
    setEditingUser(u);
    setUserForm({ name: u.name, email: u.email, phone: u.phone||'', role: u.role, password:'' });
    setShowUserModal(true);
  };
  const resetUserForm = () => setUserForm({ name:'', email:'', phone:'', role:'user', password:'' });

  // Mock chart data
  const monthlyData = [
    {name:'Jan',flights:400,hotels:240,buses:200,packages:150},{name:'Feb',flights:300,hotels:139,buses:221,packages:120},
    {name:'Mar',flights:200,hotels:980,buses:229,packages:170},{name:'Apr',flights:278,hotels:390,buses:200,packages:190},
    {name:'May',flights:189,hotels:480,buses:218,packages:210},{name:'Jun',flights:239,hotels:380,buses:250,packages:240},
    {name:'Jul',flights:349,hotels:430,buses:210,packages:300}
  ];
  const revData = [{name:'Flights',value:45},{name:'Hotels',value:30},{name:'Packages',value:15},{name:'Buses',value:10}];
  const destData = [{name:'Goa',value:300},{name:'Bali',value:250},{name:'Dubai',value:200},{name:'Paris',value:150},{name:'Maldives',value:100}];
  const stats = [
    {label:'Total Users',value:'12,458',change:'+12%',icon:<Users size={28}/>},
    {label:'Total Bookings',value:'8,234',change:'+8%',icon:<Calendar size={28}/>},
    {label:'Properties',value:'1,567',change:'+15%',icon:<Building2 size={28}/>},
    {label:'Revenue',value:'₹45.2M',change:'+23%',icon:<DollarSign size={28}/>},
  ];

  const cardStyle = { background:'var(--card-bg)', padding:'28px', borderRadius:'16px', boxShadow:'0 2px 8px rgba(15,23,42,0.1)' };
  const statCardStyle = { 
    background:'rgba(30,41,59,0.5)', 
    padding:'24px', 
    borderRadius:'20px', 
    border:'1px solid rgba(154,126,174,0.1)', 
    boxShadow:'0 4px 12px rgba(0,0,0,0.1)' 
  };
  const ttStyle = { backgroundColor:'var(--nav-bg,#1e293b)', borderRadius:'8px', border:'none', color:'white' };

  // ── Toggle switch component ──
  const Toggle = ({ on, onToggle, label }) => (
    <div style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={onToggle}>
      {on ? <ToggleRight size={28} color="#4ade80"/> : <ToggleLeft size={28} color="#64748b"/>}
      <span style={{ color: on?'#4ade80':'#64748b', fontWeight:600, fontSize:'0.95rem' }}>{label || (on?'Enabled':'Disabled')}</span>
    </div>
  );

  // ── Service Control Card ──
  const ServiceCard = ({ sKey }) => {
    const meta = SERVICE_META[sKey];
    const svc = config?.services?.[sKey] || { enabled:true, cities:[], surgePricing:1, discount:0, timeStart:'', timeEnd:'' };
    return (
      <div style={{ ...cardStyle, border:`1px solid ${svc.enabled ? meta.color+'40' : 'rgba(255,255,255,0.05)'}`, transition:'all 0.3s' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:meta.color+'20', display:'flex', alignItems:'center', justifyContent:'center', color:meta.color }}>{meta.icon}</div>
            <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:'var(--text-color)' }}>{meta.label}</h3>
          </div>
          <Toggle on={svc.enabled} onToggle={() => updateService(sKey, { enabled: !svc.enabled })} />
        </div>
        {svc.enabled && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Cities */}
            <div>
              <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:1, marginBottom:6, display:'flex', alignItems:'center', gap:4 }}><MapPin size={14}/>Active Cities</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                {(svc.cities||[]).map((c,i)=>(
                  <span key={i} style={{ padding:'4px 12px', borderRadius:20, background:meta.color+'20', color:meta.color, fontSize:'0.82rem', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                    {c}<X size={14} style={{cursor:'pointer'}} onClick={()=>{ const nc = svc.cities.filter((_,j)=>j!==i); updateService(sKey,{cities:nc}); }}/>
                  </span>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input placeholder="Add city..." value={cityInput[sKey]||''} onChange={e=>setCityInput(p=>({...p,[sKey]:e.target.value}))}
                  style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', flex:1, fontSize:'0.9rem' }}
                  onKeyDown={e=>{ 
                    if(e.key==='Enter' && cityInput[sKey]?.trim()){ 
                      const newCities = cityInput[sKey].split(',').map(c => c.trim()).filter(c => c);
                      updateService(sKey,{cities:[...(svc.cities||[]), ...newCities]}); 
                      setCityInput(p=>({...p,[sKey]:''})); 
                    }
                  }}
                />
                <button onClick={()=>{ 
                  if(cityInput[sKey]?.trim()){ 
                    const newCities = cityInput[sKey].split(',').map(c => c.trim()).filter(c => c);
                    updateService(sKey,{cities:[...(svc.cities||[]), ...newCities]}); 
                    setCityInput(p=>({...p,[sKey]:''})); 
                  }
                }}
                  style={{ padding:'8px 16px', borderRadius:8, background:meta.color, color:'#fff', fontWeight:600, border:'none', cursor:'pointer' }}>Add</button>
              </div>
            </div>
            {/* Time-based */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-light)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><Clock size={12}/>Available From</label>
                <input type="time" value={svc.timeStart||''} onChange={e=>updateService(sKey,{timeStart:e.target.value})}
                  style={{ padding:'8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', width:'100%' }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-light)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><Clock size={12}/>Available Until</label>
                <input type="time" value={svc.timeEnd||''} onChange={e=>updateService(sKey,{timeEnd:e.target.value})}
                  style={{ padding:'8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', width:'100%' }}/>
              </div>
            </div>
            {/* Pricing */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-light)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><TrendingUp size={12}/>Surge Multiplier</label>
                <input type="number" min="0.5" max="5" step="0.1" value={svc.surgePricing||1} onChange={e=>updateService(sKey,{surgePricing:parseFloat(e.target.value)})}
                  style={{ padding:'8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', width:'100%' }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-light)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><Percent size={12}/>Discount %</label>
                <input type="number" min="0" max="90" value={svc.discount||0} onChange={e=>updateService(sKey,{discount:parseInt(e.target.value)||0})}
                  style={{ padding:'8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', width:'100%' }}/>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Render tabs ──
  const renderDashboard = () => (
    <div className="animate-fade-in">
      {/* Dashboard Section Header */}
      <div className="ng-admin-section-header">
        <div>
          <h2 className="ng-admin-section-title">Operations Control Center</h2>
          <p className="ng-admin-section-subtitle">Real-time performance metrics and predictive analytics</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <button className="ng-admin-btn ng-admin-btn-ghost" onClick={() => window.location.reload()}><RefreshCw size={14}/> Force Refresh</button>
            <button className="ng-admin-btn ng-admin-btn-primary" onClick={() => showToast('Generating platform audit report...', 'info')}>
                <TrendingUp size={14}/> Generate Audit Report
            </button>
        </div>
      </div>

      {/* Modern High-Impact Stats */}
      <div className="ng-admin-stat-grid">
        {stats.map((s,i)=>(
          <div key={i} className="ng-admin-stat">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="ng-admin-stat-label">{s.label}</div>
                <div className="ng-admin-stat-value">{s.value}</div>
                <div className={`ng-admin-stat-change positive`}>
                  <TrendingUp size={12} /> {s.change} 
                  <span style={{ opacity: 0.6, fontWeight: 500, marginLeft: 4 }}>since last login</span>
                </div>
              </div>
              <div style={{ 
                padding: '12px', 
                borderRadius: '16px', 
                background: 'rgba(129, 140, 248, 0.08)', 
                color: '#818cf8', 
                border: '1px solid rgba(129, 140, 248, 0.15)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)' 
              }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Visualization Center */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 24, marginBottom: 32 }}>
        {/* Main Growth Area Chart */}
        <div className="ng-admin-chart-card">
          <div className="ng-admin-chart-title">
            <Activity size={18} color="#818cf8"/> 
            <span>Booking Velocity (7-Month Period)</span>
          </div>
          <div style={{ width:'100%', height:340 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHotels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <RTooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    padding: '12px 16px' 
                  }} 
                  itemStyle={{ fontWeight: 700 }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: 24 }} />
                <Area type="monotone" dataKey="flights" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorFlights)" />
                <Area type="monotone" dataKey="hotels" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorHotels)" />
                <Area type="monotone" dataKey="buses" stroke="#fbbf24" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart / Pie Breakdown */}
        <div className="ng-admin-chart-card">
          <div className="ng-admin-chart-title">
            <PieChart size={18} color="#fbbf24"/> 
            <span>Revenue Contribution</span>
          </div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={revData} 
                  innerRadius={70} 
                  outerRadius={105} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {revData.map((_, i) => (
                    <Cell 
                      key={i} 
                      fill={['#6366f1', '#818cf8', '#a78bfa', '#c4b5fd', '#e2e8f0'][i % 5]} 
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                    />
                  ))}
                </Pie>
                <RTooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px', 
                    color: '#fff' 
                  }} 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        <div className="ng-admin-chart-card">
          <div className="ng-admin-chart-title"><MapPin size={18} color="#f87171"/> Regional Performance</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={destData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <RTooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                   {destData.map((_, i) => <Cell key={i} fill={i === 0 ? '#818cf8' : 'rgba(129, 140, 248, 0.3)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ng-admin-chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
          <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(129, 140, 248, 0.05)', width: 'fit-content', margin: '0 auto 20px' }}>
             <ShieldCheck size={48} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>Infrastructure Secured</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>System is running on latest enterprise v2.4.0 PRO. All endpoints are encrypted and monitored.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
             <span className="ng-admin-badge ng-admin-badge-active" style={{ fontSize: '0.65rem' }}>SSL ACTIVE</span>
             <span className="ng-admin-badge ng-admin-badge-active" style={{ fontSize: '0.65rem' }}>SOC 2 COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceControls = () => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))', gap:24 }}>
      {Object.keys(SERVICE_META).map(k => <ServiceCard key={k} sKey={k}/>)}
    </div>
  );

  const renderFeatureToggles = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={cardStyle}>
        <h3 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:24, color:'var(--text-color)', display:'flex', alignItems:'center', gap:8 }}><Zap size={20}/>Global Feature Toggles</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
          {[{key:'seatSelection',label:'Seat Selection',desc:'Allow users to pick seats'},
            {key:'liveTracking',label:'Live Tracking',desc:'Real-time vehicle tracking'},
            {key:'aiSuggestions',label:'AI Suggestions',desc:'Smart travel recommendations'}].map(f=>(
            <div key={f.key} style={{ ...cardStyle, border:`1px solid ${config?.features?.[f.key]?'#4ade8040':'rgba(255,255,255,0.05)'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <h4 style={{ fontWeight:700, color:'var(--text-color)' }}>{f.label}</h4>
                <Toggle on={config?.features?.[f.key]??true} onToggle={()=>updateFeatures({[f.key]:!(config?.features?.[f.key]??true)})}/>
              </div>
              <p style={{ color:'var(--text-light)', fontSize:'0.88rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Injected Features */}
      <div style={cardStyle}>
        <h3 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:20, color:'var(--text-color)', display:'flex', alignItems:'center', gap:8 }}><Sparkles size={20}/>Feature Injection System</h3>
        <p style={{ color:'var(--text-light)', fontSize:'0.9rem', marginBottom:20 }}>Create dynamic features that instantly appear on the user-facing frontend.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          <input placeholder="Feature title" value={newFeature.title} onChange={e=>setNewFeature(p=>({...p,title:e.target.value}))}
            style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
          <select value={newFeature.type} onChange={e=>setNewFeature(p=>({...p,type:e.target.value}))}
            style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
            <option value="promotion">Promotion</option><option value="discount">Discount</option><option value="bundle">Bundle</option><option value="announcement">Announcement</option>
          </select>
          <input placeholder="Description" value={newFeature.description} onChange={e=>setNewFeature(p=>({...p,description:e.target.value}))}
            style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', gridColumn:'1/-1' }}/>
          <button onClick={()=>{ if(newFeature.title.trim()){ addInjectedFeature(newFeature); setNewFeature({title:'',description:'',type:'promotion',icon:'🎉'}); }}}
            style={{ padding:'10px 20px', borderRadius:8, background:'#818cf8', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
            <PlusCircle size={18}/>Inject Feature</button>
        </div>
        {(config?.injectedFeatures||[]).length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {config.injectedFeatures.map(f=>(
              <div key={f.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:'1.4rem' }}>{f.icon}</span>
                  <div><div style={{ fontWeight:700, color:'var(--text-color)' }}>{f.title}</div><div style={{ fontSize:'0.82rem', color:'var(--text-light)' }}>{f.description}</div></div>
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ padding:'4px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600, background:f.active?'#4ade8020':'#f8717120', color:f.active?'#4ade80':'#f87171' }}>
                    {f.active?'Live':'Paused'}</span>
                  <Toggle on={f.active} onToggle={()=>toggleInjectedFeature(f.id)}/>
                  <Trash2 size={16} style={{ color:'#f87171', cursor:'pointer' }} onClick={() => showConfirm('Remove Feature', 'Permanently remove this injected feature?', () => removeInjectedFeature(f.id))}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const getStatusIcon = (s) => { switch(s){ case 'confirmed': return <CheckCircle size={14}/>; case 'cancelled': return <XCircle size={14}/>; case 'pending': return <AlertCircle size={14}/>; default: return <FileText size={14}/>; } };
  const getStatusColor = (s) => { switch(s){ case 'confirmed': case 'completed': return '#4ade80'; case 'pending': return '#facc15'; case 'cancelled': return '#f87171'; default: return '#9A7EAE'; } };

  const renderBookings = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Stats row */}
      {bookingStats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
          {[{l:'Total',v:bookingStats.total,c:'#9A7EAE'},{l:'Confirmed',v:bookingStats.confirmed,c:'#4ade80'},{l:'Pending',v:bookingStats.pending,c:'#facc15'},{l:'Cancelled',v:bookingStats.cancelled,c:'#f87171'},{l:'Revenue',v:'₹'+(bookingStats.totalRevenue||0).toLocaleString(),c:'#818cf8'}].map((s,i)=>(
            <div key={i} style={{ ...cardStyle, padding:20, borderLeft:`4px solid ${s.c}` }}>
              <div style={{ fontSize:'0.8rem', color:'var(--text-light)', fontWeight:600, marginBottom:4 }}>{s.l}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      )}
      {/* Toolbar */}
      <div style={{ ...cardStyle, padding:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }}/>
          <input placeholder="Search by name, email, invoice..." value={bookingFilter.search} onChange={e=>setBookingFilter(p=>({...p,search:e.target.value}))}
            style={{ width:'100%', padding:'10px 14px 10px 38px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.9rem' }}/>
        </div>
        <select value={bookingFilter.type} onChange={e=>setBookingFilter(p=>({...p,type:e.target.value}))} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
          <option value="">All Types</option><option value="flight">Flight</option><option value="bus">Bus</option><option value="train">Train</option><option value="hotel">Hotel</option><option value="cab">Cab</option><option value="holiday">Holiday</option>
        </select>
        <select value={bookingFilter.status} onChange={e=>setBookingFilter(p=>({...p,status:e.target.value}))} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
          <option value="">All Status</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option>
        </select>
        <button onClick={()=>{ fetchBookings(); fetchBookingStats(); }} style={{ padding:'10px 14px', borderRadius:8, background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'var(--text-color)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><RefreshCw size={16}/>Refresh</button>
        <button onClick={()=>{ resetBookingForm(); setEditingBooking(null); setShowBookingModal(true); }} style={{ padding:'10px 20px', borderRadius:8, background:'#9A7EAE', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><PlusCircle size={16}/>Add Booking</button>
      </div>
      {/* Table */}
      <div style={{ ...cardStyle, padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
              {['Invoice','User','Type','Route','Date','Amount','Payment','Status','Actions'].map(h=>(
                <th key={h} style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontWeight:600, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {bookingLoading ? (
                <tr><td colSpan={9} style={{ padding:40, textAlign:'center', color:'var(--text-light)' }}>Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} style={{ padding:40, textAlign:'center', color:'var(--text-light)' }}>No bookings found. {bookingFilter.search||bookingFilter.type||bookingFilter.status ? 'Try adjusting filters.' : 'Bookings will appear here when users make reservations.'}</td></tr>
              ) : bookings.map(b=>(
                <tr key={b._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'var(--text-color)', fontSize:'0.88rem', fontFamily:'monospace' }}>{b.invoiceNumber||'—'}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontWeight:600, color:'var(--text-color)', fontSize:'0.9rem' }}>{b.userId?.name||'Unknown'}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-light)' }}>{b.userId?.email||''}</div>
                  </td>
                  <td style={{ padding:'14px 16px' }}><span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(154,126,174,0.15)', color:'#c4b5fd', fontSize:'0.8rem', fontWeight:600, textTransform:'capitalize' }}>{b.type}</span></td>
                  <td style={{ padding:'14px 16px', color:'var(--text-color)', fontSize:'0.88rem' }}>{b.details?.source||'—'} → {b.details?.destination||'—'}</td>
                  <td style={{ padding:'14px 16px', color:'var(--text-light)', fontSize:'0.88rem', whiteSpace:'nowrap' }}>{b.details?.date || new Date(b.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'14px 16px', fontWeight:700, color:'var(--text-color)', fontSize:'0.95rem' }}>₹{(b.amount||0).toLocaleString()}</td>
                  <td style={{ padding:'14px 16px' }}><span style={{ padding:'4px 10px', borderRadius:20, background:getStatusColor(b.paymentStatus)+'18', color:getStatusColor(b.paymentStatus), fontSize:'0.78rem', fontWeight:600, textTransform:'capitalize' }}>{b.paymentStatus}</span></td>
                  <td style={{ padding:'14px 16px' }}>
                    <select value={b.status} onChange={e=>handleStatusChange(b._id, e.target.value)}
                      style={{ padding:'6px 10px', borderRadius:8, border:`1px solid ${getStatusColor(b.status)}40`, background:getStatusColor(b.status)+'12', color:getStatusColor(b.status), fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
                      <option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option>
                    </select>
                  </td>
                   <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=> { setSelectedInvoice(b); setShowInvoiceModal(true); }} style={{ padding:6, borderRadius:6, background:'rgba(74,222,128,0.12)', border:'none', cursor:'pointer', color:'#4ade80', display:'flex' }} title="Generate Invoice"><FileText size={16}/></button>
                      <button onClick={()=>openEditModal(b)} style={{ padding:6, borderRadius:6, background:'rgba(154,126,174,0.15)', border:'none', cursor:'pointer', color:'#9A7EAE', display:'flex' }} title="Edit"><Edit size={16}/></button>
                      <button onClick={()=>handleDeleteBooking(b._id)} style={{ padding:6, borderRadius:6, background:'rgba(248,113,113,0.12)', border:'none', cursor:'pointer', color:'#f87171', display:'flex' }} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Modal */}
      {showBookingModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={()=>setShowBookingModal(false)}>
          <div style={{ ...cardStyle, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', position:'relative' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-color)' }}>{editingBooking ? 'Edit Booking' : 'Create Booking'}</h3>
              <X size={20} style={{ cursor:'pointer', color:'var(--text-light)' }} onClick={()=>setShowBookingModal(false)}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {!editingBooking && <div>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>User Email *</label>
                <input value={bookingForm.userEmail} onChange={e=>setBookingForm(p=>({...p,userEmail:e.target.value}))} placeholder="user@example.com"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
              </div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Type</label>
                  <select value={bookingForm.type} onChange={e=>setBookingForm(p=>({...p,type:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="flight">Flight</option><option value="bus">Bus</option><option value="train">Train</option><option value="hotel">Hotel</option><option value="cab">Cab</option><option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Amount (₹)</label>
                  <input type="number" value={bookingForm.amount} onChange={e=>setBookingForm(p=>({...p,amount:e.target.value}))} placeholder="5000"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Status</label>
                  <select value={bookingForm.status} onChange={e=>setBookingForm(p=>({...p,status:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Payment</label>
                  <select value={bookingForm.paymentStatus} onChange={e=>setBookingForm(p=>({...p,paymentStatus:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Source</label>
                  <input value={bookingForm.details?.source||''} onChange={e=>setBookingForm(p=>({...p,details:{...p.details,source:e.target.value}}))} placeholder="Delhi"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Destination</label>
                  <input value={bookingForm.details?.destination||''} onChange={e=>setBookingForm(p=>({...p,details:{...p.details,destination:e.target.value}}))} placeholder="Mumbai"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Date</label>
                  <input type="date" value={bookingForm.details?.date||''} onChange={e=>setBookingForm(p=>({...p,details:{...p.details,date:e.target.value}}))}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Passengers</label>
                  <input type="number" min="1" value={bookingForm.details?.passengers||1} onChange={e=>setBookingForm(p=>({...p,details:{...p.details,passengers:parseInt(e.target.value)||1}}))}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
              </div>
              <button onClick={handleSaveBooking} style={{ padding:'12px 24px', borderRadius:10, background:'linear-gradient(135deg,#9A7EAE,#7e6691)', color:'#fff', fontWeight:700, fontSize:'1rem', border:'none', cursor:'pointer', marginTop:8 }}>
                {editingBooking ? '💾 Update Booking' : '➕ Create Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {userStats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
          {[{l:'Total Users',v:userStats.totalCount,c:'#818cf8'},{l:'Admins',v:userStats.adminCount,c:'#fbbf24'},{l:'Regular Users',v:userStats.userCount,c:'#34d399'},{l:'New This Month',v:userStats.newThisMonth,c:'#fb923c'}].map((s,i)=>(
            <div key={i} style={{ ...cardStyle, padding:20, borderLeft:`4px solid ${s.c}` }}>
              <div style={{ fontSize:'0.8rem', color:'var(--text-light)', fontWeight:600, marginBottom:4 }}>{s.l}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ ...cardStyle, padding:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }}/>
          <input placeholder="Search by name, email, phone..." value={userFilter.search} onChange={e=>setUserFilter(p=>({...p,search:e.target.value}))}
            style={{ width:'100%', padding:'10px 14px 10px 38px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.9rem' }}/>
        </div>
        <select value={userFilter.role} onChange={e=>setUserFilter(p=>({...p,role:e.target.value}))} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
          <option value="">All Roles</option><option value="admin">Admin</option><option value="user">User</option>
        </select>
        <button onClick={()=>{ fetchUsers(); fetchUserStats(); }} style={{ padding:'10px 14px', borderRadius:8, background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'var(--text-color)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><RefreshCw size={16}/>Refresh</button>
        <button onClick={()=>{ resetUserForm(); setEditingUser(null); setShowUserModal(true); }} style={{ padding:'10px 20px', borderRadius:8, background:'#818cf8', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><PlusCircle size={16}/>Add User</button>
      </div>
      <div style={{ ...cardStyle, padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
              {['Name/Email','Phone','Role','Joined Date','Actions'].map(h=>(
                <th key={h} style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontWeight:600, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {userLoading ? (
                <tr><td colSpan={5} style={{ padding:40, textAlign:'center', color:'var(--text-light)' }}>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:40, textAlign:'center', color:'var(--text-light)' }}>No users found.</td></tr>
              ) : users.map(u=>(
                <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontWeight:600, color:'var(--text-color)', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:8 }}>
                       {u.role==='admin'?<Zap size={14} color="#fbbf24"/>:<Users size={14}/>} {u.name}
                    </div>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-light)', marginLeft:22 }}>{u.email}</div>
                  </td>
                  <td style={{ padding:'14px 16px', color:'var(--text-light)', fontSize:'0.88rem' }}>{u.phone||'—'}</td>
                  <td style={{ padding:'14px 16px' }}><span style={{ padding:'4px 10px', borderRadius:20, background:u.role==='admin'?'#fbbf2422':'#34d39922', color:u.role==='admin'?'#fbbf24':'#34d399', fontSize:'0.78rem', fontWeight:600, textTransform:'capitalize' }}>{u.role}</span></td>
                  <td style={{ padding:'14px 16px', color:'var(--text-light)', fontSize:'0.88rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>openUserEditModal(u)} style={{ padding:6, borderRadius:6, background:'rgba(129,140,248,0.15)', border:'none', cursor:'pointer', color:'#818cf8', display:'flex' }} title="Edit"><Edit size={16}/></button>
                      <button onClick={()=>handleDeleteUser(u._id)} style={{ padding:6, borderRadius:6, background:'rgba(248,113,113,0.12)', border:'none', cursor:'pointer', color:'#f87171', display:'flex' }} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showUserModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={()=>setShowUserModal(false)}>
          <div style={{ ...cardStyle, width:'100%', maxWidth:400, position:'relative' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-color)' }}>{editingUser ? 'Edit User' : 'Create User'}</h3>
              <X size={20} style={{ cursor:'pointer', color:'var(--text-light)' }} onClick={()=>setShowUserModal(false)}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Full Name *</label>
                <input value={userForm.name} onChange={e=>setUserForm(p=>({...p,name:e.target.value}))} placeholder="John Doe"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Email Address *</label>
                <input type="email" value={userForm.email} onChange={e=>setUserForm(p=>({...p,email:e.target.value}))} placeholder="john@example.com"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Phone</label>
                  <input value={userForm.phone} onChange={e=>setUserForm(p=>({...p,phone:e.target.value}))} placeholder="+91 9876543210"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Role</label>
                  <select value={userForm.role} onChange={e=>setUserForm(p=>({...p,role:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="user">User</option><option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Password {editingUser&&'(Optional)'}</label>
                <input type="password" value={userForm.password} onChange={e=>setUserForm(p=>({...p,password:e.target.value}))} placeholder={editingUser?"Leave blank to keep current":"Strong password"}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
              </div>
              <button onClick={handleSaveUser} style={{ padding:'12px 24px', borderRadius:10, background:'#818cf8', color:'#fff', fontWeight:700, fontSize:'1rem', border:'none', cursor:'pointer', marginTop:8 }}>
                {editingUser ? '💾 Update User' : '➕ Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Render Universal Inventory / Cards ──
  const renderCards = () => {
    const filteredCards = bookingCards.filter(c => {
      if (cardFilter.type && c.type !== cardFilter.type) return false;
      if (cardFilter.search) {
        const q = cardFilter.search.toLowerCase();
        return (c.title||'').toLowerCase().includes(q) || (c.source||'').toLowerCase().includes(q) || (c.destination||'').toLowerCase().includes(q);
      }
      return true;
    });

    return (
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Real-time Service Status Bar */}
        <div style={{ ...cardStyle, padding: '20px', background: 'rgba(154,126,174,0.05)', border: '1px solid rgba(154,126,174,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Activity size={18} color="#9A7EAE" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: 1 }}>Live Service Controls</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {Object.entries(config?.services || {}).map(([key, svc]) => (
              <div key={key} style={{ 
                padding: '12px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: 12, 
                border: `1px solid ${svc.enabled ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: svc.enabled ? '#4ade80' : '#f87171' }}>{key}</span>
                  <Toggle on={svc.enabled} onToggle={() => updateService(key, { enabled: !svc.enabled })} />
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span>Price: {svc.surgePricing}x</span>
                  <span>Disc: {svc.discount}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, padding:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }}/>
            <input placeholder="Search title, source or destination..." value={cardFilter.search} onChange={e=>setCardFilter(p=>({...p,search:e.target.value}))}
              style={{ width:'100%', padding:'10px 14px 10px 38px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.9rem' }}/>
          </div>
          <select value={cardFilter.type} onChange={e=>setCardFilter(p=>({...p,type:e.target.value}))} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
            <option value="">All Services</option><option value="flight">Flights</option><option value="bus">Buses</option><option value="hotel">Hotels</option><option value="cab">Cabs</option><option value="train">Trains</option><option value="holiday">Holidays</option>
          </select>
          <button onClick={()=>{ resetCardForm(); setEditingCard(null); setShowCardModal(true); }} style={{ padding:'10px 20px', borderRadius:8, background:'linear-gradient(135deg,#818cf8,#4f46e5)', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><PlusCircle size={16}/>Add Inventory Item</button>
        </div>
        <div style={{ ...cardStyle, padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
                {['Item / Title','Type','Route/Location','Available Seats','Price','Status','Actions'].map(h=>(
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontWeight:600, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredCards.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'var(--text-light)' }}>No inventory found. Create universal cards to populate the frontend.</td></tr>
                ) : filteredCards.map(c=>(
                  <tr key={c._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', transition:'background 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 16px', fontWeight:600, color:'var(--text-color)', fontSize:'0.9rem' }}>{c.title}</td>
                    <td style={{ padding:'14px 16px' }}><span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(255,255,255,0.1)', color:'var(--text-color)', fontSize:'0.8rem', fontWeight:600, textTransform:'capitalize' }}>{c.type}</span></td>
                    <td style={{ padding:'14px 16px', color:'var(--text-color)', fontSize:'0.88rem' }}>
                      <div style={{ fontWeight:700 }}>{c.source||'—'} → {c.destination||'—'}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--text-light)', marginTop:4 }}>{c.date || 'No Date'} · {c.startTime || c.time || '--'} - {c.arrivalTime || '--'}</div>
                    </td>
                    <td style={{ padding:'14px 16px', color:'var(--text-color)', fontSize:'0.88rem' }}>{c.availableSeats} / {c.totalSeats}</td>
                    <td style={{ padding:'14px 16px', fontWeight:700, color:'var(--text-color)', fontSize:'0.95rem' }}>₹{(c.price||0).toLocaleString()}</td>
                    <td style={{ padding:'14px 16px' }}><span style={{ padding:'4px 10px', borderRadius:20, background:c.status==='active'?'#4ade8018':'#f8717118', color:c.status==='active'?'#4ade80':'#f87171', fontSize:'0.78rem', fontWeight:600, textTransform:'capitalize' }}>{c.status}</span></td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={()=>openCardEditModal(c)} style={{ padding:6, borderRadius:6, background:'rgba(251,146,60,0.15)', border:'none', cursor:'pointer', color:'#fb923c', display:'flex' }} title="Edit"><Edit size={16}/></button>
                        <button onClick={()=>handleDeleteCard(c._id)} style={{ padding:6, borderRadius:6, background:'rgba(248,113,113,0.12)', border:'none', cursor:'pointer', color:'#f87171', display:'flex' }} title="Delete"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Inventory Modal */}
        {showCardModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={()=>setShowCardModal(false)}>
            <div style={{ ...cardStyle, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', position:'relative' }} onClick={e=>e.stopPropagation()}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-color)' }}>{editingCard ? 'Edit Inventory Item' : 'Create Inventory Item'}</h3>
                <X size={20} style={{ cursor:'pointer', color:'var(--text-light)' }} onClick={()=>setShowCardModal(false)}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Type *</label>
                  <select value={cardForm.type} onChange={e=>setCardForm(p=>({...p,type:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="flight">Flight</option><option value="bus">Bus</option><option value="train">Train</option><option value="hotel">Hotel</option><option value="cab">Cab</option><option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Title (e.g. Indigo Flight 6E-243) *</label>
                  <input value={cardForm.title} onChange={e=>setCardForm(p=>({...p,title:e.target.value}))} placeholder="Indigo Flight Ahmedabad → Goa"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }} required/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {cardForm.type !== 'hotel' && cardForm.type !== 'holiday' && (
                    <div>
                      <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Source location</label>
                      <input value={cardForm.source} onChange={e=>setCardForm(p=>({...p,source:e.target.value}))} placeholder="Ahmedabad"
                        style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                    </div>
                  )}
                  <div style={{ gridColumn: (cardForm.type === 'hotel' || cardForm.type === 'holiday') ? 'span 2' : 'auto' }}>
                    <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>{(cardForm.type === 'hotel' || cardForm.type === 'holiday') ? 'Location / Destination' : 'Destination Location'}</label>
                    <input value={cardForm.destination} onChange={e=>setCardForm(p=>({...p,destination:e.target.value}))} placeholder="Goa"
                      style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Date & Schedule</label>
                    <input type="date" value={cardForm.date} onChange={e=>setCardForm(p=>({...p,date:e.target.value}))}
                      style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', marginBottom:8 }}/>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      <div>
                        <span style={{ fontSize:'0.65rem', color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>Start Time</span>
                        <input type="time" value={cardForm.startTime} onChange={e=>setCardForm(p=>({...p,startTime:e.target.value}))}
                          style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                      </div>
                      <div>
                        <span style={{ fontSize:'0.65rem', color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>Arrival Time</span>
                        <input type="time" value={cardForm.arrivalTime} onChange={e=>setCardForm(p=>({...p,arrivalTime:e.target.value}))}
                          style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Pricing & Dynamic</label>
                    <input type="number" value={cardForm.price} onChange={e=>setCardForm(p=>({...p,price:e.target.value}))} placeholder="Base Price (₹)"
                      style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', marginBottom:8 }} required/>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)' }}>
                       <span style={{ fontSize:'0.85rem' }}>Dynamic Pricing</span>
                       <Toggle on={cardForm.dynamicPricing} onToggle={()=>setCardForm(p=>({...p,dynamicPricing:!p.dynamicPricing}))}/>
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Total Capacity *</label>
                    <input type="number" value={cardForm.totalSeats} onChange={e=>setCardForm(p=>({...p,totalSeats:e.target.value}))} placeholder="120"
                      style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }} required/>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Available Right Now</label>
                    <input type="number" value={cardForm.availableSeats} onChange={e=>setCardForm(p=>({...p,availableSeats:e.target.value}))} placeholder="Leave empty for Total"
                      style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Listing Status</label>
                  <select value={cardForm.status} onChange={e=>setCardForm(p=>({...p,status:e.target.value}))}
                    style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-color)' }}>
                    <option value="active">🟢 Active & Visible</option>
                    <option value="inactive">🔴 Inactive (Hidden)</option>
                    <option value="sold_out">🟡 Sold Out</option>
                  </select>
                </div>
                {(cardForm.type === 'hotel' || cardForm.type === 'holiday') ? (
                  <div style={{ background:'rgba(255,255,255,0.03)', padding:16, borderRadius:12, border:'1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', margin:0 }}>{cardForm.type === 'hotel' ? 'Room Category' : 'Package Options'} & Pricing</label>
                      <button onClick={()=>setCardForm(p=>({...p, rooms:[...p.rooms, {category:'', price:''}]}))}
                        style={{ background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'none', padding:'4px 10px', borderRadius:6, fontSize:'0.7rem', fontWeight:700, cursor:'pointer' }}>
                        + Add {cardForm.type === 'hotel' ? 'Room' : 'Option'}
                      </button>
                    </div>
                    {cardForm.rooms.length === 0 && (
                       <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                         <button onClick={()=>setCardForm(p=>({...p, rooms:[{category:'Basic', price:''},{category:'Deluxe', price:''},{category:'Super Deluxe', price:''}]}))}
                           style={{ flex:1, fontSize:'0.65rem', padding:'6px', border:'1px solid rgba(255,255,255,0.1)', background:'var(--card-bg)', color:'var(--text-light)', borderRadius:6, cursor:'pointer' }}>
                           ⚡ Quick Add: Basic/Deluxe/Super Deluxe
                         </button>
                       </div>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {cardForm.rooms.map((rm, idx) => (
                        <div key={idx} style={{ display:'grid', gridTemplateColumns:'1fr 120px 40px', gap:10, alignItems:'center' }}>
                          <input placeholder={cardForm.type === 'hotel' ? 'e.g. Deluxe Room' : 'e.g. Basic Package'} value={rm.category} onChange={e=> {
                            const newRooms = [...cardForm.rooms]; newRooms[idx].category = e.target.value; setCardForm(p=>({...p, rooms:newRooms}));
                          }} style={{ width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.85rem' }} />
                          <input placeholder="Price (₹)" type="number" value={rm.price} onChange={e=> {
                            const newRooms = [...cardForm.rooms]; newRooms[idx].price = e.target.value; 
                            const validPrices = newRooms.filter(r=>r.price).map(r=>Number(r.price));
                            const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
                            setCardForm(p=>({...p, rooms:newRooms, price: minPrice > 0 ? minPrice : p.price}));
                          }} style={{ width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.85rem' }} />
                          <button onClick={()=>setCardForm(p=>({...p, rooms: p.rooms.filter((_,i)=>i!==idx)}))}
                            style={{ background:'rgba(248,113,113,0.1)', color:'#f87171', border:'none', padding:8, borderRadius:8, cursor:'pointer' }}><Trash2 size={14}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {TYPE_FIELDS[cardForm.type]?.map(f => (
                      <div key={f.name}>
                        <label style={{ fontSize:'0.75rem', fontWeight:800, color:'var(--text-light)', marginBottom:4, display:'block' }}>{f.label} *</label>
                        <input value={dynamicFeatures[f.name] || ''} onChange={e => setDynamicFeatures({...dynamicFeatures, [f.name]: e.target.value})} placeholder={f.placeholder}
                            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', fontSize:'0.85rem' }}/>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Advanced Metadata (JSON Custom Fields)</label>
                  <textarea value={cardForm.featuresStr} onChange={e=>setCardForm(p=>({...p,featuresStr:e.target.value}))} placeholder='{"wifi": true, "meal": "included"}'
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--text-color)', height:'60px', fontFamily:'monospace', fontSize:'0.8rem' }} />
                </div>
                
                <button onClick={handleSaveCard} style={{ padding:'12px 24px', borderRadius:10, background:'linear-gradient(135deg,#818cf8,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'1rem', border:'none', cursor:'pointer', marginTop:8 }}>
                  {editingCard ? '💾 Update Inventory' : '➕ Push To Live Environment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Render Contacts & Feedback ──
  const renderFeedback = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <div style={{ ...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
        <div>
          <h3 style={{ margin:0, color:'#fff', display:'flex', alignItems:'center', gap:10, fontSize:'1.5rem', fontWeight:800 }}><Mail size={24} color="#fbbf24"/> User Feedback & Inquiries</h3>
          <p style={{ margin:'6px 0 0 0', fontSize:'0.9rem', color:'var(--text-light)' }}>Review and manage customer support tickets and feedback</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <ModernSelect 
            value={contactFilter.type} 
            onChange={v => setContactFilter(p=>({...p,type:v}))}
            options={[
                { value: '', label: 'All Types' },
                { value: 'contact', label: 'Contact' },
                { value: 'feedback', label: 'Feedback' },
                { value: 'corporate', label: 'Corporate' },
                { value: 'newsletter', label: 'Newsletter' },
            ]}
            placeholder="All Types"
          />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:24 }}>
        {contacts.map(c => (
          <div key={c._id} style={{ 
            ...cardStyle, 
            background: c.status === 'new' ? 'rgba(74,222,128,0.05)' : 'rgba(30,41,59,0.5)', 
            border: c.status === 'new' ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)',
            position:'relative', 
            transition:'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            
            <div style={{ display:'flex', gap:14, marginBottom:18 }}>
               <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', border:'1px solid rgba(255,255,255,0.1)' }}>
                  {c.type === 'corporate' ? '🏢' : c.type === 'feedback' ? '🗣️' : '📧'}
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontWeight:800, color:'#fff', fontSize:'1rem', display:'flex', justifyContent:'space-between' }}>
                    {c.name}
                    {c.type === 'corporate' && <span style={{ fontSize:'0.7rem', background:'rgba(129,140,248,0.2)', color:'#818cf8', padding:'2px 8px', borderRadius:8 }}>LEAD</span>}
                  </div>
                  <div style={{ fontSize:'0.82rem', color:'var(--text-light)' }}>{c.email}</div>
                  {c.phone && <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:2 }}>📞 {c.phone}</div>}
               </div>
               {c.status === 'new' && <div style={{ background:'#4ade80', width:10, height:10, borderRadius:'50%', boxShadow:'0 0 10px #4ade80', marginTop:4 }}></div>}
            </div>

            {c.company && (
              <div style={{ display:'flex', gap:10, marginBottom:15, background:'rgba(129,140,248,0.1)', padding:'8px 12px', borderRadius:10, border:'1px solid rgba(129,140,248,0.1)' }}>
                <div style={{ flex:1 }}>
                   <div style={{ fontSize:'0.65rem', fontWeight:900, color:'#818cf8', textTransform:'uppercase' }}>Company</div>

                   <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#fff' }}>{c.company}</div>
                </div>
                {c.employees && (
                   <div style={{ borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:10 }}>
                      <div style={{ fontSize:'0.65rem', fontWeight:900, color:'#9A7EAE', textTransform:'uppercase' }}>Size</div>
                      <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#fff' }}>{c.employees}</div>
                   </div>
                )}
              </div>
            )}

            <div style={{ background:'rgba(0,0,0,0.2)', padding:'14px 18px', borderRadius:14, marginBottom:20, flex:1 }}>
               <div style={{ fontSize:'0.7rem', fontWeight:900, color:'#fbbf24', textTransform:'uppercase', marginBottom:6 }}>{c.type} inquiry</div>
               <div style={{ fontWeight:700, color:'#fff', marginBottom:8, fontSize:'0.95rem' }}>{c.subject || 'No Subject'}</div>
               <p style={{ margin:0, fontSize:'0.85rem', color:'var(--text-light)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {c.message}
               </p>
            </div>

            <div style={{ display:'flex', gap:10, alignItems:'center', paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
               <select 
                  value={c.status} 
                  onChange={(e) => handleContactStatus(c._id, e.target.value)} 
                  style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontWeight:700, fontSize:'0.85rem' }}
               >
                  <option value="new">🆕 New</option>
                  <option value="read">📖 Read</option>
                  <option value="archived">📦 Archived</option>
               </select>
               <button onClick={() => showConfirm('Message Content', c.message, null, 'confirm')} style={{ padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'#fff', border:'none', cursor:'pointer' }}><Eye size={18}/></button>
               <button onClick={() => handleContactDelete(c._id)} style={{ padding:'10px', borderRadius:10, background:'rgba(248,113,113,0.1)', color:'#f87171', border:'none', cursor:'pointer' }}><Trash2 size={18}/></button>
            </div>

          </div>
        ))}
        {contacts.length === 0 && <div style={{ gridColumn:'1/-1', ...cardStyle, padding:80, textAlign:'center', color:'var(--text-light)', background:'rgba(255,255,255,0.02)' }}>No feedback found matching filters.</div>}
      </div>
    </div>
  );

  const renderJobApps = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <div style={{ ...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
        <div>
          <h3 style={{ margin:0, color:'#fff', display:'flex', alignItems:'center', gap:10, fontSize:'1.5rem', fontWeight:800 }}><Briefcase size={24} color="#818cf8"/> Hiring Dashboard</h3>
          <p style={{ margin:'6px 0 0 0', fontSize:'0.9rem', color:'var(--text-light)' }}>Monitor recruitment progress and applicant shortlisting</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <ModernSelect 
            value={jobFilter.status} 
            onChange={v => setJobFilter(p=>({...p,status:v}))}
            options={[
                { value: '', label: 'All Stages' },
                { value: 'pending', label: 'Pending' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' },
            ]}
            placeholder="All Stages"
          />
          <input 
            placeholder="Search applicants..." 
            value={jobFilter.search} 
            onChange={e=>setJobFilter(p=>({...p,search:e.target.value}))} 
            style={{ padding:'10px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', width:220 }} 
          />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(380px, 1fr))', gap:24 }}>
        {jobApps.filter(app => {
          if (jobFilter.status && app.status !== jobFilter.status) return false;
          if (jobFilter.search) {
            const s = jobFilter.search.toLowerCase();
            return (app.user?.name?.toLowerCase().includes(s) || app.jobTitle?.toLowerCase().includes(s) || app.user?.email?.toLowerCase().includes(s));
          }
          return true;
        }).map(app => (
          <div key={app._id} style={{ 
            ...cardStyle, 
            background: 'rgba(30,41,59,0.5)', 
            border: '1px solid rgba(255,255,255,0.08)',
            position:'relative', 
            transition:'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ position:'absolute', top:20, right:20 }}>
               <span style={{ 
                  padding:'6px 14px', borderRadius:20, fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:1,
                  background: app.status==='accepted' ? 'rgba(74,222,128,0.15)' : app.status==='rejected' ? 'rgba(248,113,113,0.15)' : 'rgba(129,140,248,0.15)',
                  color: app.status==='accepted' ? '#4ade80' : app.status==='rejected' ? '#f87171' : '#818cf8',
                  border: `1px solid ${app.status==='accepted' ? '#4ade8040' : app.status==='rejected' ? '#f8717140' : '#818cf840'}`
               }}>{app.status}</span>
            </div>
            
            <div style={{ display:'flex', gap:16, marginBottom:20 }}>
               <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#818cf8,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:900, color:'#fff' }}>
                  {getInitials(app.user?.name)}
               </div>
               <div>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff' }}>{app.user?.name}</div>
                  <div style={{ fontSize:'0.85rem', color:'var(--text-light)', marginTop:2 }}>{app.user?.email}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-light)', opacity:0.6 }}>Experience: {app.experience}</div>
               </div>
            </div>

            <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:12, padding:18, marginBottom:20 }}>
               <div style={{ fontSize:'0.75rem', fontWeight:900, color:'#818cf8', textTransform:'uppercase', marginBottom:8 }}>APPLYING FOR</div>
               <div style={{ fontWeight:700, fontSize:'1.1rem' }}>{app.jobTitle}</div>
               <div style={{ fontSize:'0.85rem', color:'var(--text-light)', marginTop:6 }}>{app.education}</div>
            </div>

            <div style={{ display:'flex', gap:12, marginBottom:24 }}>
               <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:10, background:'rgba(129,140,248,0.1)', color:'#818cf8', fontSize:'0.85rem', fontWeight:700, textDecoration:'none', border:'1px solid rgba(129,140,248,0.2)' }}><FileText size={16}/> Resume</a>
               {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" rel="noreferrer" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:10, background:'rgba(74,222,128,0.1)', color:'#4ade80', fontSize:'0.85rem', fontWeight:700, textDecoration:'none', border:'1px solid rgba(74,222,128,0.2)' }}><Link2 size={16}/> Portfolio</a>}
            </div>

            <div style={{ display:'flex', gap:10, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
               {app.status === 'pending' ? (
                  <>
                     <button onClick={() => updateJobStatus(app._id, 'accepted', 'Profile shortlisted')} style={{ flex:1, padding:'12px', borderRadius:10, background:'#4ade80', color:'#fff', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem' }}>Accept</button>
                     <button onClick={() => updateJobStatus(app._id, 'rejected', 'Profile not matching requirements')} style={{ flex:1, padding:'12px', borderRadius:10, background:'#f87171', color:'#fff', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem' }}>Reject</button>
                  </>
               ) : (
                  <button onClick={() => updateJobStatus(app._id, 'pending')} style={{ flex:1, padding:'12px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'var(--text-light)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontWeight:700, fontSize:'0.85rem' }}><RefreshCw size={14} style={{marginRight:8}}/> Reset Status</button>
               )}
               <button onClick={() => showConfirm('Cover Letter', app.coverLetter || 'No cover letter provided.', null, 'confirm')} style={{ padding:'12px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'#fff', border:'none', cursor:'pointer' }} title="View Cover"><Eye size={18}/></button>
               <button onClick={() => handleDeleteJobApp(app._id)} style={{ padding:'12px', borderRadius:10, background:'rgba(248,113,113,0.1)', color:'#f87171', border:'none', cursor:'pointer' }} title="Delete App"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
        {jobApps.length === 0 && <div style={{ gridColumn:'1/-1', ...cardStyle, padding:80, textAlign:'center', color:'var(--text-light)', background:'rgba(255,255,255,0.02)' }}>No applications found.</div>}
      </div>
    </div>
  );

  const renderPress = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ ...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h3 style={{ margin:0, color:'var(--text-color)', display:'flex', alignItems:'center', gap:8 }}><FileText size={20}/> Press & News Management</h3>
          <p style={{ margin:'4px 0 0 0', fontSize:'0.85rem', color:'var(--text-light)' }}>Manage company announcements and press releases</p>
        </div>
        <button onClick={() => { setEditingPress(null); setPressForm({ title:'', category:'Company News', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), excerpt:'', content:'' }); setShowPressModal(true); }} style={{ padding:'10px 20px', borderRadius:10, background:'#818cf8', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
          <PlusCircle size={18}/> New Release
        </button>
      </div>

      <div style={{ ...cardStyle, padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
            <th style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontSize:'0.85rem' }}>Title & Date</th>
            <th style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontSize:'0.85rem' }}>Category</th>
            <th style={{ padding:'14px 16px', textAlign:'right', color:'var(--text-light)', fontSize:'0.85rem' }}>Actions</th>
          </tr></thead>
          <tbody>
            {pressReleases.map(pr => (
              <tr key={pr._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontWeight:700, color:'var(--text-color)' }}>{pr.title}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-light)' }}>{pr.date}</div>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(154,126,174,0.1)', color:'#9A7EAE', fontSize:'0.75rem', fontWeight:700 }}>{pr.category}</span>
                </td>
                <td style={{ padding:'14px 16px', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button onClick={() => { setEditingPress(pr); setPressForm(pr); setShowPressModal(true); }} style={{ color:'#818cf8', background:'none', border:'none', cursor:'pointer' }}><Edit size={16}/></button>
                    <button onClick={() => handleDeletePress(pr._id)} style={{ color:'#f87171', background:'none', border:'none', cursor:'pointer' }}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {pressReleases.length === 0 && <tr><td colSpan={3} style={{ padding:60, textAlign:'center', color:'var(--text-light)' }}>No press releases created yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showPressModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(5px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setShowPressModal(false)}>
          <div style={{ ...cardStyle, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ margin:0 }}>{editingPress ? 'Edit Press Release' : 'Create Press Release'}</h3>
              <X size={20} style={{ cursor:'pointer' }} onClick={() => setShowPressModal(false)}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>TITLE</label>
                <input value={pressForm.title} onChange={e => setPressForm(p => ({...p, title: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>CATEGORY</label>
                  <select value={pressForm.category} onChange={e => setPressForm(p => ({...p, category: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'var(--card-bg)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}>
                    <option value="Company News">Company News</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Awards">Awards</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>DATE</label>
                  <input value={pressForm.date} onChange={e => setPressForm(p => ({...p, date: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>EXCERPT</label>
                <textarea value={pressForm.excerpt} onChange={e => setPressForm(p => ({...p, excerpt: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', minHeight:80 }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>CONTENT</label>
                <textarea value={pressForm.content} onChange={e => setPressForm(p => ({...p, content: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', minHeight:150 }}/>
              </div>
              <button onClick={handleSavePress} style={{ padding:'14px', borderRadius:10, background:'#818cf8', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', marginTop:10 }}>{editingPress ? 'Update Release' : 'Publish Release'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBlogs = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ ...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h3 style={{ margin:0, color:'var(--text-color)', display:'flex', alignItems:'center', gap:8 }}><BookOpen size={20}/> Blog Content Management</h3>
          <p style={{ margin:'4px 0 0 0', fontSize:'0.85rem', color:'var(--text-light)' }}>Create and edit travel stories, tips, and guides</p>
        </div>
        <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', category: 'Travel Tips', date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), author: '', excerpt: '', content: '', image: '🏝️' }); setShowBlogModal(true); }} style={{ padding:'10px 20px', borderRadius:10, background:'#818cf8', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
          <PlusCircle size={18}/> New Blog Post
        </button>
      </div>

      <div style={{ ...cardStyle, padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
            <th style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontSize:'0.85rem' }}>Title & Author</th>
            <th style={{ padding:'14px 16px', textAlign:'left', color:'var(--text-light)', fontSize:'0.85rem' }}>Category</th>
            <th style={{ padding:'14px 16px', textAlign:'center', color:'var(--text-light)', fontSize:'0.85rem' }}>Icon</th>
            <th style={{ padding:'14px 16px', textAlign:'right', color:'var(--text-light)', fontSize:'0.85rem' }}>Actions</th>
          </tr></thead>
          <tbody>
            {blogs.map(b => (
              <tr key={b._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontWeight:700, color:'var(--text-color)' }}>{b.title}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-light)' }}>By {b.author} • {b.date}</div>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ padding:'4px 10px', borderRadius:20, background:'rgba(129,140,248,0.1)', color:'#818cf8', fontSize:'0.75rem', fontWeight:700 }}>{b.category}</span>
                </td>
                <td style={{ padding:'14px 16px', textAlign:'center', fontSize:'1.4rem' }}>{b.image}</td>
                <td style={{ padding:'14px 16px', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button onClick={() => { setEditingBlog(b); setBlogForm(b); setShowBlogModal(true); }} style={{ color:'#818cf8', background:'none', border:'none', cursor:'pointer' }}><Edit size={16}/></button>
                    <button onClick={() => handleDeleteBlog(b._id)} style={{ color:'#f87171', background:'none', border:'none', cursor:'pointer' }}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && <tr><td colSpan={4} style={{ padding:60, textAlign:'center', color:'var(--text-light)' }}>No blog posts created yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showBlogModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(5px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setShowBlogModal(false)}>
          <div style={{ ...cardStyle, width:'100%', maxWidth:650, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ margin:0 }}>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
              <X size={20} style={{ cursor:'pointer' }} onClick={() => setShowBlogModal(false)}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>TITLE</label>
                <input value={blogForm.title} onChange={e => setBlogForm(p => ({...p, title: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>CATEGORY</label>
                  <select value={blogForm.category} onChange={e => setBlogForm(p => ({...p, category: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'var(--card-bg)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Destination Guide">Destination Guide</option>
                    <option value="Travel Hacks">Travel Hacks</option>
                    <option value="Budget Travel">Budget Travel</option>
                    <option value="Solo Travel">Solo Travel</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>AUTHOR</label>
                  <input value={blogForm.author} onChange={e => setBlogForm(p => ({...p, author: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}/>
                </div>
                <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>ICON (EMOJI)</label>
                    <input value={blogForm.image} onChange={e => setBlogForm(p => ({...p, image: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff' }}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>EXCERPT</label>
                <textarea value={blogForm.excerpt} onChange={e => setBlogForm(p => ({...p, excerpt: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', minHeight:80 }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-light)', display:'block', marginBottom:6 }}>CONTENT</label>
                <textarea value={blogForm.content} onChange={e => setBlogForm(p => ({...p, content: e.target.value}))} style={{ width:'100%', padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', minHeight:150 }}/>
              </div>
              <button onClick={handleSaveBlog} style={{ padding:'14px', borderRadius:10, background:'#818cf8', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', marginTop:10 }}>{editingBlog ? 'Update Blog' : 'Publish Blog'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProperties = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <div style={{ ...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' }}>
        <div>
          <h3 style={{ margin:0, color:'#fff', display:'flex', alignItems:'center', gap:10, fontSize:'1.5rem', fontWeight:800 }}><Building2 size={24} color="#4ade80"/> Property Applications</h3>
          <p style={{ margin:'6px 0 0 0', fontSize:'0.9rem', color:'var(--text-light)' }}>Review and manage new hotel and resort partnership requests</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <ModernSelect 
            value={propertyFilter.status} 
            onChange={v => setPropertyFilter(p=>({...p,status:v}))}
            options={[
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
            ]}
            placeholder="All Statuses"
          />
          <input 
            placeholder="Search properties..." 
            value={propertyFilter.search} 
            onChange={e=>setPropertyFilter(p=>({...p,search:e.target.value}))} 
            style={{ padding:'10px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', width:220 }} 
          />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(400px, 1fr))', gap:24 }}>
        {properties.map(p => (
          <div key={p._id} style={{ 
            ...cardStyle, 
            background: 'rgba(30,41,59,0.5)', 
            border: '1px solid rgba(255,255,255,0.08)',
            position:'relative', 
            transition:'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ position:'absolute', top:20, right:20 }}>
               <span style={{ 
                  padding: '6px 14px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1,
                  background: p.status === 'approved' ? 'rgba(74, 222, 128, 0.15)' : p.status === 'rejected' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(129, 140, 248, 0.15)', 
                  color: p.status === 'approved' ? '#4ade80' : p.status === 'rejected' ? '#f87171' : '#818cf8',
                  border: `1px solid ${p.status === 'approved' ? 'rgba(74, 222, 128, 0.3)' : p.status === 'rejected' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(129, 140, 248, 0.3)'}`
               }}>{p.status}</span>
            </div>

            <div style={{ display:'flex', gap:16, marginBottom:22 }}>
               <div style={{ width:60, height:60, borderRadius:18, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', border:'1px solid rgba(255,255,255,0.1)' }}>
                  {p.propertyType === 'hotel' ? '🏨' : p.propertyType === 'resort' ? '🏝️' : p.propertyType === 'villa' ? '🏡' : '🏢'}
               </div>
               <div>
                  <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff' }}>{p.propertyName}</div>
                  <div style={{ fontSize:'0.85rem', color:'#4ade80', fontWeight:700, textTransform:'uppercase', marginTop:4 }}>{p.propertyType}</div>
               </div>
            </div>

            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
               <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(0,0,0,0.2)', padding:'12px 16px', borderRadius:12 }}>
                  <User size={16} color="#818cf8"/>
                  <div>
                     <div style={{ fontSize:'0.75rem', color:'var(--text-light)', fontWeight:600 }}>Owner / Manager</div>
                     <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{p.ownerName}</div>
                  </div>
               </div>
               <div style={{ display:'flex', gap:12 }}>
                  <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'rgba(0,0,0,0.2)', padding:'12px 16px', borderRadius:12 }}>
                     <Mail size={16} color="#818cf8"/>
                     <div style={{ fontSize:'0.85rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.email}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(0,0,0,0.2)', padding:'12px 16px', borderRadius:12 }}>
                     <Phone size={16} color="#818cf8"/>
                     <div style={{ fontSize:'0.85rem' }}>{p.phone}</div>
                  </div>
               </div>
               <div style={{ display:'flex', gap:12 }}>
                  <div style={{ flex:2, display:'flex', alignItems:'center', gap:10, background:'rgba(0,0,0,0.2)', padding:'12px 16px', borderRadius:12 }}>
                     <MapPin size={16} color="#818cf8"/>
                     <div style={{ fontSize:'0.82rem' }}>{p.city ? `${p.city}, ` : ''}{p.address || 'Address not provided'}</div>
                  </div>
                  {p.rooms && (
                    <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'rgba(0,0,0,0.2)', padding:'12px 16px', borderRadius:12 }}>
                       <Building2 size={16} color="#818cf8"/>
                       <div style={{ fontSize:'0.85rem' }}>{p.rooms} Rms</div>
                    </div>
                  )}
               </div>
               <div style={{ padding:'12px 16px', background:'rgba(255,255,255,0.02)', borderRadius:12, border:'1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-light)', fontWeight:600, marginBottom:4 }}>Submission Date</div>
                  <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{new Date(p.submittedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
               </div>
            </div>

            <div style={{ display:'flex', gap:10, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
               {p.status === 'pending' ? (
                  <>
                    <button onClick={() => updatePropertyStatus(p._id, 'approved')} style={{ flex:1, padding:'12px', borderRadius:10, background:'#4ade80', color:'#fff', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><CheckCircle size={18}/> Accept</button>
                    <button onClick={() => updatePropertyStatus(p._id, 'rejected')} style={{ flex:1, padding:'12px', borderRadius:10, background:'#f87171', color:'#fff', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><XCircle size={18}/> Reject</button>
                  </>
               ) : (
                  <button onClick={() => updatePropertyStatus(p._id, 'pending')} style={{ flex:1, padding:'12px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'var(--text-light)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontWeight:700, fontSize:'0.85rem' }}><RefreshCw size={14} style={{marginRight:8}}/> Reset to Pending</button>
               )}
               <button onClick={()=>showConfirm('Property Description', p.description || 'No description provided.', null, 'confirm')} style={{ padding:'12px', borderRadius:10, background:'rgba(255,255,255,0.05)', color:'#fff', border:'none', cursor:'pointer' }}><Eye size={18}/></button>
               <button onClick={()=>deleteProperty(p._id)} style={{ padding:'12px', borderRadius:10, background:'rgba(248,113,113,0.1)', color:'#f87171', border:'none', cursor:'pointer' }}><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
        {properties.length === 0 && <div style={{ gridColumn:'1/-1', ...cardStyle, padding:80, textAlign:'center', color:'var(--text-light)', background:'rgba(255,255,255,0.02)' }}>No property requests found matching filters.</div>}
      </div>
    </div>
  );

  const renderLedger = () => (
    <div style={{ display:'grid', gap:30 }}>
      {/* Header Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:20 }}>
        <div style={statCardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15 }}>
            <div style={{ padding:10, borderRadius:12, background:'rgba(74,222,128,0.1)', color:'#4ade80' }}><DollarSign size={20}/></div>
            <TrendingUp size={16} style={{ color:'#4ade80' }}/>
          </div>
          <h4 style={{ fontSize:'0.85rem', color:'var(--text-light)', marginBottom:5 }}>Booking Revenue</h4>
          <h2 style={{ fontSize:'1.8rem', fontWeight:800 }}>₹{ledgerStats.revenue.toLocaleString()}</h2>
        </div>
        <div style={statCardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15 }}>
            <div style={{ padding:10, borderRadius:12, background:'rgba(167,139,250,0.1)', color:'#a78bfa' }}><Gift size={20}/></div>
            <Sparkles size={16} style={{ color:'#a78bfa' }}/>
          </div>
          <h4 style={{ fontSize:'0.85rem', color:'var(--text-light)', marginBottom:5 }}>Gift Card Sales</h4>
          <h2 style={{ fontSize:'1.8rem', fontWeight:800 }}>₹{ledgerStats.giftCardRevenue.toLocaleString()}</h2>
        </div>
        <div style={statCardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15 }}>
            <div style={{ padding:10, borderRadius:12, background:'rgba(96,165,250,0.1)', color:'#60a5fa' }}><ShieldCheck size={20}/></div>
            <CheckCircle size={16} style={{ color:'#60a5fa' }}/>
          </div>
          <h4 style={{ fontSize:'0.85rem', color:'var(--text-light)', marginBottom:5 }}>Insurance Premiums</h4>
          <h2 style={{ fontSize:'1.8rem', fontWeight:800 }}>₹{ledgerStats.insuranceRevenue.toLocaleString()}</h2>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:30 }}>
        {/* Recent Gift Cards */}
        <div style={cardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:'1.2rem', fontWeight:800 }}>Recent Gift Cards</h3>
            <button onClick={fetchLedger} className="action-btn" style={{ padding:'8px 12px' }}><RefreshCw size={14} style={{ marginRight:6 }}/> Sync</button>
          </div>
          <div style={{ display:'grid', gap:15 }}>
            {ledgerStats.giftCards.length === 0 ? <p style={{ textAlign:'center', color:'var(--text-light)', padding:20 }}>No gift card activity yet.</p> :
             ledgerStats.giftCards.map(gc => (
              <div key={gc._id} style={{ padding:15, borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <h4 style={{ fontWeight:700, fontSize:'0.95rem' }}>Sent by {gc.senderName}</h4>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-light)' }}>To: {gc.receiverEmail}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, color:'#4ade80' }}>+₹{gc.amount}</div>
                  <div style={{ fontSize:'0.75rem', opacity:0.6 }}>{new Date(gc.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Subscriptions */}
        <div style={cardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:'1.2rem', fontWeight:800 }}>Insurance Activity</h3>
            <ShieldCheck size={20} style={{ color:'#60a5fa' }}/>
          </div>
          <div style={{ display:'grid', gap:15 }}>
            {ledgerStats.insurances.length === 0 ? <p style={{ textAlign:'center', color:'var(--text-light)', padding:20 }}>No insurance plans sold yet.</p> :
             ledgerStats.insurances.map(ins => (
              <div key={ins._id} style={{ padding:15, borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:15 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'rgba(96,165,250,0.1)', color:'#60a5fa', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Shield size={18}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <h4 style={{ fontWeight:700, fontSize:'0.95rem' }}>{ins.userName}</h4>
                    <span style={{ fontWeight:800, color:'#4ade80' }}>₹{ins.price}</span>
                  </div>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-light)' }}>Plan: <span style={{ color:'var(--text-color)', fontWeight:600 }}>{ins.planName}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Leaderboard */}
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:25 }}>
          <div style={{ padding:10, borderRadius:12, background:'rgba(251,191,36,0.1)', color:'#fbbf24' }}><Award size={22}/></div>
          <h3 style={{ fontSize:'1.4rem', fontWeight:800 }}>Referral Growth Leaderboard</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))', gap:20 }}>
          {ledgerStats.topReferrers.length === 0 ? <p style={{ color:'var(--text-light)' }}>No referral data yet.</p> :
           ledgerStats.topReferrers.map((ref, i) => (
            <div key={ref._id} style={{ position:'relative', padding:25, borderRadius:24, background:'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position:'absolute', top:-10, right:20, width:40, height:40, borderRadius:'50%', background:'var(--brand-color,#6366f1)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.2rem', boxShadow:'0 4px 10px rgba(99,102,241,0.3)' }}>#{i+1}</div>
              <div style={{ display:'flex', gap:15, alignItems:'center', marginBottom:20 }}>
                <div style={{ width:50, height:50, borderRadius:15, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:800, color:'var(--text-light)' }}>{getInitials(ref.name)}</div>
                <div>
                  <h4 style={{ fontWeight:800, fontSize:'1.1rem' }}>{ref.name}</h4>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-light)' }}>Code: <strong style={{ color:'var(--brand-color)' }}>{ref.referralCode}</strong></p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:15 }}>
                <div style={{ padding:15, borderRadius:16, background:'rgba(0,0,0,0.2)', textAlign:'center' }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#4ade80' }}>{ref.referralHistory.length}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-light)', textTransform:'uppercase', fontWeight:700 }}>Invites</div>
                </div>
                <div style={{ padding:15, borderRadius:16, background:'rgba(0,0,0,0.2)', textAlign:'center' }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#60a5fa' }}>₹{ref.referralHistory.length * 500}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-light)', textTransform:'uppercase', fontWeight:700 }}>Potential</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'services': return renderServiceControls();
      case 'features': return renderFeatureToggles();
      case 'bookings': return renderBookings();
      case 'users': return renderUsers();
      case 'inventory': return renderCards();
      case 'feedback': return renderFeedback();
      case 'jobs': return renderJobApps();
      case 'press': return renderPress();
      case 'blogs': return renderBlogs();
      case 'properties': return renderProperties();
      case 'revenue': return renderLedger();
      case 'settings': return <div style={{...cardStyle,textAlign:'center',padding:60}}><Settings size={60} style={{color:'var(--text-light)',marginBottom:20}}/><h3 style={{color:'var(--text-color)',marginBottom:8}}>Settings</h3><p style={{color:'var(--text-light)'}}>Application settings</p></div>;
      default: return renderDashboard();
    }
  };

  const sidebarItems = [
    { id:'dashboard', icon:<LayoutDashboard size={20}/>, label:'Dashboard' },
    { id:'inventory', icon:<MapPin size={20}/>, label:'Manage Inventory' },
    { id:'bookings', icon:<Calendar size={20}/>, label:'Manage Bookings' },
    { id:'users', icon:<Users size={20}/>, label:'Manage Users' },
    { id:'services', icon:<Zap size={20}/>, label:'Service Controls' },
    { id:'features', icon:<Sparkles size={20}/>, label:'Feature Toggles' },
    { id:'jobs', icon:<Briefcase size={20}/>, label:'Hiring / Jobs' },
    { id:'press', icon:<FileText size={20}/>, label:'Press / News' },
    { id:'blogs', icon:<BookOpen size={20}/>, label:'Blogs / Stories' },
    { id:'feedback', icon:<Mail size={20}/>, label:'User Feedback' },
    { id:'properties', icon:<Building2 size={20}/>, label:'Property Applications' },
    { id:'revenue', icon:<DollarSign size={20}/>, label:'Revenue & Ledger' },
    { id:'settings', icon:<Settings size={20}/>, label:'Settings' },
  ];

  return (
    <div className="ng-admin-root">
      {/* Premium Sidebar */}
      <div className="ng-admin-sidebar">
        {/* Brand Section */}
        <div className="ng-admin-brand">
          <div className="ng-admin-brand-logo">
            <div className="ng-admin-brand-icon">
              <Plane size={24} />
            </div>
            <div>
              <div className="ng-admin-brand-text">TravelGo</div>
              <div className="ng-admin-brand-sub">Management v2.4</div>
            </div>
          </div>
        </div>

        {/* System Status Tracker */}
        <div className={`ng-admin-status ${connected ? 'online' : 'offline'}`}>
          <div className="ng-admin-status-dot" />
          {connected ? 'System Online' : 'System Offline'}
          <div style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.5 }}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>

        {/* Navigation Sidebar */}
        <nav className="ng-admin-nav">
          <div className="ng-admin-nav-section">Core Modules</div>
          {sidebarItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`ng-admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'bookings' && bookingStats?.pending > 0 && (
                <span className="ng-nav-badge">{bookingStats.pending}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Secure Logout Section */}
        <div className="ng-admin-logout">
          <button 
            className="ng-admin-logout-btn"
            onClick={() => showConfirm('Logout Session', 'Are you sure you want to exit the admin dashboard?', logout)}
          >
            <LogOut size={18}/> Logout Session
          </button>
        </div>
      </div>

      {/* Main Glass Content Area */}
      <div className="ng-admin-main">
        {/* Dynamic Top Bar */}
        <header className="ng-admin-topbar">
          <div>
            <h2 className="ng-admin-topbar-title">
              {sidebarItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="ng-admin-topbar-sub">
              <Activity size={12} /> Real-time System Analytics
              <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
              <Calendar size={12} /> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div className="ng-admin-topbar-user">
            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ position: 'relative' }}>
                  <RefreshCw size={16} className={connected ? 'animate-spin-slow' : ''} style={{ color: connected ? '#4ade80' : '#f87171' }} />
               </div>
               <div className="ng-admin-topbar-name">
                 {user?.name || 'Administrator'}
                 <div className="ng-admin-topbar-role">System Superuser</div>
               </div>
            </div>
            <div className="ng-admin-topbar-avatar">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Primary Content Viewport */}
        <main className="ng-admin-content">
          {renderContent()}
        </main>

        <footer className="ng-admin-footer">
          <div>&copy; 2026 TravelGo Enterprise Control Panel. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
             <span className="ng-admin-footer-version">v2.4.0-PRO-GLASS</span>
             <span>Refreshed: {new Date().toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>

      {/* Invoice Generator Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000 }} onClick={()=>setShowInvoiceModal(false)}>
          <div className="ng-admin-card" style={{ width:'100%', maxWidth:700, padding:0, background:'#fff', color:'#1e293b', border:'none', boxShadow:'0 40px 100px rgba(0,0,0,0.5)', overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
             {/* Invoice Header */}
             <div style={{ background:'#0f172a', color:'#fff', padding:'40px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{ width:40, height:40, background:'#818cf8', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><Plane size={24}/></div>
                    <span style={{ fontSize:'1.5rem', fontWeight:900, letterSpacing:-1 }}>TravelGo <span style={{ fontWeight:400, opacity:0.6 }}>Invoice</span></span>
                  </div>
                  <div style={{ fontSize:'0.85rem', opacity:0.8, lineHeight:1.6 }}>
                    Innovation Hub, Tower 7<br/>
                    Silicon Valley Sector-X<br/>
                    support@travelgo.com
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                   <div style={{ fontSize:'2.5rem', fontWeight:900, letterSpacing:-2, textTransform:'uppercase', opacity:0.1, marginBottom:'-15px' }}>INVOICE</div>
                   <div style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:4 }}>#{selectedInvoice.invoiceNumber || 'INV-88220'}</div>
                   <div style={{ fontSize:'0.85rem', opacity:0.8 }}>Issued: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</div>
                </div>
             </div>

             {/* Invoice Details Container */}
             <div style={{ padding:'40px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginBottom:40 }}>
                   <div>
                      <h4 style={{ fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase', color:'#94a3b8', letterSpacing:1, marginBottom:12 }}>Billed To</h4>
                      <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:4 }}>{selectedInvoice.userId?.name || 'Valued Customer'}</div>
                      <div style={{ fontSize:'0.9rem', color:'#64748b' }}>{selectedInvoice.userId?.email}</div>
                      <div style={{ fontSize:'0.9rem', color:'#64748b' }}>{selectedInvoice.userId?.phone || '+91 90000 00000'}</div>
                   </div>
                   <div style={{ textAlign:'right' }}>
                      <h4 style={{ fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase', color:'#94a3b8', letterSpacing:1, marginBottom:12 }}>Booking Details</h4>
                      <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:4, color:'#818cf8' }}>{selectedInvoice.type.toUpperCase()} RESERVATION</div>
                      <div style={{ fontSize:'0.9rem', color:'#64748b' }}>{selectedInvoice.details?.source} → {selectedInvoice.details?.destination}</div>
                      <div style={{ fontSize:'0.9rem', color:'#64748b' }}>Travel Date: {selectedInvoice.details?.date}</div>
                   </div>
                </div>

                <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:40 }}>
                   <thead>
                      <tr style={{ borderBottom:'2px solid #f1f5f9' }}>
                         <th style={{ padding:'12px 0', textAlign:'left', fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase' }}>Description</th>
                         <th style={{ padding:'12px 0', textAlign:'right', fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase' }}>Qty</th>
                         <th style={{ padding:'12px 0', textAlign:'right', fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase' }}>Amount</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr style={{ borderBottom:'1px solid #f1f5f9' }}>
                         <td style={{ padding:'20px 0' }}>
                           <div style={{ fontWeight:700 }}>Universal {selectedInvoice.type} Ticket Booking</div>
                           <div style={{ fontSize:'0.82rem', color:'#64748b', marginTop:4 }}>Class: Economy / Standard Performance</div>
                         </td>
                         <td style={{ padding:'20px 0', textAlign:'right', fontWeight:600 }}>1</td>
                         <td style={{ padding:'20px 0', textAlign:'right', fontWeight:700 }}>₹{(selectedInvoice.amount * 0.82).toLocaleString()}</td>
                      </tr>
                      <tr>
                         <td style={{ padding:'20px 0' }}>
                           <div style={{ fontWeight:700 }}>GST (18%)</div>
                           <div style={{ fontSize:'0.82rem', color:'#64748b', marginTop:4 }}>Integrated Goods and Services Tax</div>
                         </td>
                         <td style={{ padding:'20px 0', textAlign:'right', fontWeight:600 }}>1</td>
                         <td style={{ padding:'20px 0', textAlign:'right', fontWeight:700 }}>₹{(selectedInvoice.amount * 0.18).toLocaleString()}</td>
                      </tr>
                   </tbody>
                </table>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                   <div style={{ maxWidth:300 }}>
                      <div style={{ fontSize:'0.75rem', color:'#94a3b8', fontStyle:'italic', lineHeight:1.5 }}>
                        This is an electronically generated invoice. Signature is not required. Thank you for choosing TravelGo.
                      </div>
                   </div>
                   <div style={{ background:'#f8fafc', padding:'24px', borderRadius:16, minWidth:240 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:'0.9rem', color:'#64748b' }}>
                         <span>Subtotal:</span>
                         <span style={{ fontWeight:700 }}>₹{selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', borderTop:'2px solid #e2e8f0', paddingTop:12 }}>
                         <span style={{ fontWeight:800, color:'#0f172a' }}>TOTAL:</span>
                         <span style={{ fontWeight:900, color:'#818cf8', fontSize:'1.4rem' }}>₹{selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Footer Actions */}
             <div style={{ background:'#f8fafc', padding:'20px 40px', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:20 }}>
                   <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.75rem', fontWeight:700, color:'#64748b' }}><ShieldCheck size={16}/> VERIFIED</div>
                   <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.75rem', fontWeight:700, color:'#64748b' }}><LogOut size={16} style={{transform:'rotate(90deg)'}}/> DOWNLOAD AS PDF</div>
                </div>
                <button onClick={() => { showToast('Invoice printed successfully', 'success'); setShowInvoiceModal(false); }} 
                  style={{ padding:'10px 24px', background:'#818cf8', color:'#fff', fontWeight:800, borderRadius:10, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                  <TrendingUp size={16}/> Print Invoice
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
