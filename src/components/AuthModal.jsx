import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Plane, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, onSuccess, isClosable = true }) => {
    const { login: authLogin, register: authRegister } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsLogin(true);
            setError('');
            setSuccess('');
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setError(''); // clear error when user types
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // ── Client-side validation ───────────────────────────────────────────
        if (!formData.email || !formData.password) {
            setError('Email and password are required.');
            return;
        }
        if (!isLogin) {
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match. Please re-enter.');
                return;
            }
        }

        setLoading(true);
        try {
            let data;
            if (isLogin) {
                data = await authLogin(formData.email, formData.password);
            } else {
                data = await authRegister(formData.name, formData.email, formData.phone, formData.password);
            }
            setSuccess(data.message);
            setTimeout(() => {
                if (onSuccess) onSuccess(data);
                else onClose();
            }, 900);
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Could not connect to server. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.5)',
                maxWidth: '450px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                animation: 'slideUp 0.3s ease',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Close Button */}
                {isClosable && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'rgba(0,0,0,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            zIndex: 10,
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #9A7EAE 0%, #9A7EAE 100%)',
                    padding: '30px',
                    textAlign: 'center',
                    color: 'white',
                    flexShrink: 0
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '10px'
                    }}>
                        <Plane size={28} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>TravelGo</h2>
                    </div>
                    <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: 0 }}>
                        {isLogin ? 'Welcome back! Please login to continue' : 'Create an account to start your journey'}
                    </p>
                </div>

                {/* Form Container (Scrollable if needed) */}
                <div style={{ padding: '30px', overflowY: 'auto' }}>
                    {/* Toggle Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '25px',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '5px',
                        borderRadius: '12px'
                    }}>
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: isLogin ? 'rgba(250, 250, 250, 0.1)' : 'transparent',
                                color: isLogin ? '#9A7EAE' : 'var(--text-light)',
                                boxShadow: isLogin ? '0 2px 4px rgba(15, 23, 42, 0.1)' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: !isLogin ? 'rgba(250, 250, 250, 0.1)' : 'transparent',
                                color: !isLogin ? '#9A7EAE' : 'var(--text-light)',
                                boxShadow: !isLogin ? '0 2px 4px rgba(15, 23, 42, 0.1)' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name Field (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9A7EAE' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required={!isLogin}
                                        style={{
                                            width: '100%', padding: '12px 15px 12px 45px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#9A7EAE'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9A7EAE' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    style={{
                                        width: '100%', padding: '12px 15px 12px 45px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box', background: 'rgba(250, 250, 250, 0.05)', color: 'var(--text-color)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#9A7EAE'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                                />
                            </div>
                        </div>

                        {/* Phone Field (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9A7EAE' }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required={!isLogin}
                                        style={{
                                            width: '100%', padding: '12px 15px 12px 45px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#9A7EAE'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Field */}
                        <div style={{ marginBottom: isLogin ? '15px' : '15px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9A7EAE' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    style={{
                                        width: '100%', padding: '12px 45px 12px 45px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#9A7EAE'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9A7EAE', padding: 0 }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9A7EAE' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required={!isLogin}
                                        style={{
                                            width: '100%', padding: '12px 15px 12px 45px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#9A7EAE'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password (Login Only) */}
                        {isLogin && (
                            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                                <a href="#" style={{ color: '#9A7EAE', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        {/* ── Error Banner ──────────────────────────────── */}
                        {error && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                color: '#f87171',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* ── Success Banner ────────────────────────────── */}
                        {success && (
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.12)',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                color: '#4ade80',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                ✅ {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', background: 'linear-gradient(135deg, #9A7EAE 0%, #9A7EAE 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(154, 126, 174, 0.3)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', marginTop: isLogin ? '0' : '15px', opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(154, 126, 174, 0.4)'; } }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(154, 126, 174, 0.3)'; }}
                        >
                            {loading ? 'Please wait…' : (isLogin ? '🔐 Login' : '🚀 Create Account')}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div style={{ marginTop: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(250, 250, 250, 0.1)' }}></div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(250, 250, 250, 0.1)' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                type="button"
                                style={{ flex: 1, padding: '10px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', background: 'rgba(250, 250, 250, 0.05)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)', transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#9A7EAE'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                            >
                                Google
                            </button>
                            <button
                                type="button"
                                style={{ flex: 1, padding: '10px', border: '2px solid rgba(250, 250, 250, 0.1)', borderRadius: '10px', background: 'rgba(250, 250, 250, 0.05)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)', transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#9A7EAE'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(250, 250, 250, 0.1)'}
                            >
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Switcher */}
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.1)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)', flexShrink: 0, marginTop: 'auto' }}>
                    {isLogin ? (
                        <p style={{ margin: 0 }}>
                            Don't have an account?{' '}
                            <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#9A7EAE', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p style={{ margin: 0 }}>
                            Already have an account?{' '}
                            <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#9A7EAE', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AuthModal;
