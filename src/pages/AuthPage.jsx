import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Plane } from 'lucide-react';
import '../App.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
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
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(0, 140, 255, 0.85) 0%, rgba(0, 102, 204, 0.85) 100%), url(/login-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '450px',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                    }}>
                        <Plane size={32} />
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>TravelGo</h1>
                    </div>
                    <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
                        {isLogin ? 'Welcome back! Please login to continue' : 'Create an account to start your journey'}
                    </p>
                </div>

                {/* Form */}
                <div style={{ padding: '40px 30px' }}>
                    {/* Toggle Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '30px',
                        background: '#f7fafc',
                        padding: '5px',
                        borderRadius: '12px'
                    }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: isLogin ? 'white' : 'transparent',
                                color: isLogin ? '#008cff' : '#718096',
                                boxShadow: isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: !isLogin ? 'white' : 'transparent',
                                color: !isLogin ? '#008cff' : '#718096',
                                boxShadow: !isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name Field (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: '#2d3748'
                                }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={20} style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#a0aec0'
                                    }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            padding: '14px 15px 14px 45px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#008cff'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#2d3748'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#a0aec0'
                                }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 15px 14px 45px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#008cff'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        {/* Phone Field (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: '#2d3748'
                                }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={20} style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#a0aec0'
                                    }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            padding: '14px 15px 14px 45px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#008cff'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Field */}
                        <div style={{ marginBottom: isLogin ? '20px' : '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#2d3748'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#a0aec0'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 45px 14px 45px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#008cff'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#a0aec0',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Sign Up Only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: '#2d3748'
                                }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={20} style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#a0aec0'
                                    }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            padding: '14px 15px 14px 45px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#008cff'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password (Login Only) */}
                        {isLogin && (
                            <div style={{ textAlign: 'right', marginBottom: '25px' }}>
                                <a href="#" style={{
                                    color: '#008cff',
                                    fontSize: '0.9rem',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 140, 255, 0.4)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                marginTop: isLogin ? '0' : '25px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(0, 140, 255, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(0, 140, 255, 0.4)';
                            }}
                        >
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>

                        {/* Social Login */}
                        <div style={{ marginTop: '30px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Or continue with</span>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    type="button"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        color: '#2d3748',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = '#008cff';
                                        e.target.style.background = '#f7fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = 'white';
                                    }}
                                >
                                    Google
                                </button>
                                <button
                                    type="button"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        color: '#2d3748',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = '#008cff';
                                        e.target.style.background = '#f7fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = 'white';
                                    }}
                                >
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 30px',
                    background: '#f7fafc',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#718096'
                }}>
                    {isLogin ? (
                        <p style={{ margin: 0 }}>
                            Don't have an account?{' '}
                            <button
                                onClick={toggleMode}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#008cff',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    textDecoration: 'underline'
                                }}
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p style={{ margin: 0 }}>
                            Already have an account?{' '}
                            <button
                                onClick={toggleMode}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#008cff',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    textDecoration: 'underline'
                                }}
                            >
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
