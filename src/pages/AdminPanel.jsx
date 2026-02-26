import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Building2,
    Plane,
    DollarSign,
    TrendingUp,
    Calendar,
    Settings,
    LogOut,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import '../App.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for dashboard
    const stats = [
        { icon: <Users size={32} />, label: 'Total Users', value: '12,458', change: '+12%', color: '#3b82f6' },
        { icon: <Plane size={32} />, label: 'Total Bookings', value: '8,234', change: '+8%', color: '#10b981' },
        { icon: <Building2 size={32} />, label: 'Properties', value: '1,567', change: '+15%', color: '#f59e0b' },
        { icon: <DollarSign size={32} />, label: 'Revenue', value: '₹45.2M', change: '+23%', color: '#8b5cf6' }
    ];

    const recentBookings = [
        { id: 'BK001', user: 'Rahul Sharma', type: 'Flight', destination: 'Dubai', amount: '₹45,000', status: 'confirmed', date: '2026-02-10' },
        { id: 'BK002', user: 'Priya Patel', type: 'Hotel', destination: 'Goa', amount: '₹12,500', status: 'pending', date: '2026-02-10' },
        { id: 'BK003', user: 'Amit Kumar', type: 'Holiday', destination: 'Maldives', amount: '₹1,25,000', status: 'confirmed', date: '2026-02-09' },
        { id: 'BK004', user: 'Sneha Reddy', type: 'Train', destination: 'Mumbai', amount: '₹2,500', status: 'cancelled', date: '2026-02-09' },
        { id: 'BK005', user: 'Vikram Singh', type: 'Cab', destination: 'Delhi', amount: '₹3,200', status: 'confirmed', date: '2026-02-08' }
    ];

    const users = [
        { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', bookings: 12, joined: '2025-06-15', status: 'active' },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com', bookings: 8, joined: '2025-08-22', status: 'active' },
        { id: 3, name: 'Amit Kumar', email: 'amit@example.com', bookings: 15, joined: '2025-04-10', status: 'active' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', bookings: 5, joined: '2025-11-05', status: 'inactive' },
        { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', bookings: 20, joined: '2025-03-18', status: 'active' }
    ];

    const properties = [
        { id: 1, name: 'Grand Plaza Hotel', location: 'Mumbai', rooms: 150, rating: 4.5, status: 'active', bookings: 342 },
        { id: 2, name: 'Beach Resort', location: 'Goa', rooms: 80, rating: 4.8, status: 'active', bookings: 256 },
        { id: 3, name: 'Mountain View Villa', location: 'Manali', rooms: 25, rating: 4.6, status: 'active', bookings: 128 },
        { id: 4, name: 'City Center Inn', location: 'Delhi', rooms: 60, rating: 4.2, status: 'pending', bookings: 89 },
        { id: 5, name: 'Lake View Resort', location: 'Udaipur', rooms: 45, rating: 4.7, status: 'active', bookings: 198 }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': case 'active': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'cancelled': case 'inactive': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const renderDashboard = () => (
        <div>
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px',
                marginBottom: '40px'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '8px' }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>
                                    {stat.value}
                                </div>
                                <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {stat.change} from last month
                                </div>
                            </div>
                            <div style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px',
                marginBottom: '40px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#2d3748' }}>
                        <BarChart3 size={20} style={{ display: 'inline', marginRight: '10px' }} />
                        Revenue Overview
                    </h3>
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
                        Chart visualization would go here
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#2d3748' }}>
                        <PieChart size={20} style={{ display: 'inline', marginRight: '10px' }} />
                        Booking Distribution
                    </h3>
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
                        Chart visualization would go here
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px', color: '#2d3748' }}>
                    Recent Bookings
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Booking ID</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>User</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Type</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Destination</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Amount</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '15px', color: '#2d3748', fontWeight: '600' }}>{booking.id}</td>
                                    <td style={{ padding: '15px', color: '#2d3748' }}>{booking.user}</td>
                                    <td style={{ padding: '15px', color: '#2d3748' }}>{booking.type}</td>
                                    <td style={{ padding: '15px', color: '#2d3748' }}>{booking.destination}</td>
                                    <td style={{ padding: '15px', color: '#2d3748', fontWeight: '600' }}>{booking.amount}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            background: getStatusColor(booking.status) + '20',
                                            color: getStatusColor(booking.status),
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            textTransform: 'capitalize'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Eye size={18} style={{ color: '#3b82f6', cursor: 'pointer' }} />
                                            <Edit size={18} style={{ color: '#10b981', cursor: 'pointer' }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d3748' }}>
                    User Management
                </h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px 15px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.95rem',
                                width: '250px'
                            }}
                        />
                    </div>
                    <button style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Email</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Bookings</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Joined</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '15px', color: '#2d3748', fontWeight: '600' }}>{user.id}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{user.name}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{user.email}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{user.bookings}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{user.joined}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        background: getStatusColor(user.status) + '20',
                                        color: getStatusColor(user.status),
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Eye size={18} style={{ color: '#3b82f6', cursor: 'pointer' }} />
                                        <Edit size={18} style={{ color: '#10b981', cursor: 'pointer' }} />
                                        <Trash2 size={18} style={{ color: '#ef4444', cursor: 'pointer' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProperties = () => (
        <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d3748' }}>
                    Property Management
                </h3>
                <button style={{
                    padding: '10px 20px',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                }}>
                    + Add Property
                </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Property Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Location</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Rooms</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Rating</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Bookings</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '15px', color: '#2d3748', fontWeight: '600' }}>{property.id}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{property.name}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{property.location}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{property.rooms}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>⭐ {property.rating}</td>
                                <td style={{ padding: '15px', color: '#2d3748' }}>{property.bookings}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        background: getStatusColor(property.status) + '20',
                                        color: getStatusColor(property.status),
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {property.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Eye size={18} style={{ color: '#3b82f6', cursor: 'pointer' }} />
                                        <Edit size={18} style={{ color: '#10b981', cursor: 'pointer' }} />
                                        <Trash2 size={18} style={{ color: '#ef4444', cursor: 'pointer' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'users': return renderUsers();
            case 'properties': return renderProperties();
            case 'bookings': return renderDashboard(); // Reuse for now
            case 'settings': return (
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
                    <Settings size={60} style={{ color: '#718096', marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#2d3748', marginBottom: '10px' }}>Settings</h3>
                    <p style={{ color: '#718096' }}>Settings panel coming soon...</p>
                </div>
            );
            default: return renderDashboard();
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                padding: '30px 0',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '0 30px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>TravelGo</h2>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Admin Panel</p>
                </div>

                <nav>
                    {[
                        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                        { id: 'bookings', icon: <Calendar size={20} />, label: 'Bookings' },
                        { id: 'users', icon: <Users size={20} />, label: 'Users' },
                        { id: 'properties', icon: <Building2 size={20} />, label: 'Properties' },
                        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                padding: '15px 30px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer',
                                background: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                                borderLeft: activeTab === item.id ? '4px solid white' : '4px solid transparent',
                                transition: 'all 0.3s ease',
                                fontWeight: activeTab === item.id ? '600' : '400'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== item.id) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== item.id) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </div>
                    ))}
                </nav>

                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '0',
                    right: '0',
                    padding: '0 30px'
                }}>
                    <div style={{
                        padding: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={20} />
                        Logout
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '280px', flex: 1, padding: '40px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3748', marginBottom: '10px' }}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <p style={{ color: '#718096' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;
