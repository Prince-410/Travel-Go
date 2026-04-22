import React, { useState } from 'react';
import { Trash2, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import '../App.css';

const CartPage = () => {
    const { showConfirm } = useUI();
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            type: 'Flight',
            title: 'Delhi (DEL) to Mumbai (BOM)',
            details: 'IndiGo | 28 Mar 2026 | 1 Adult',
            price: 3249,
            image: '/images/flight.png' 
        },
        {
            id: 2,
            type: 'Hotel',
            title: 'Taj Mahal Palace, Mumbai',
            details: '2 Nights | 28 Mar - 30 Mar | Deluxe Room',
            price: 15998,
            image: '/images/hotel.png'
        }
    ]);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        showConfirm(
            'Confirm Checkout',
            `You are about to pay ₹${totalPrice.toLocaleString('en-IN')}. Proceed?`,
            () => {
                setCartItems([]);
                showConfirm('Payment Successful!', 'Your bookings are confirmed.', null, 'success');
            }
        );
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="cart-page" style={{ color: '#fff', padding: '120px 20px 80px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '900', 
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <ShoppingBag size={32} style={{ marginRight: '15px', color: '#818cf8' }} />
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(30,41,59,0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <ShoppingBag size={64} style={{ color: '#475569', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem', color: '#cbd5e1', marginBottom: '15px' }}>Your cart is empty</h2>
                        <p style={{ color: '#64748b', marginBottom: '30px' }}>Looks like you haven't added any travel plans yet.</p>
                        <Link to="/" style={{
                            background: '#818cf8',
                            color: '#fff',
                            textDecoration: 'none',
                            padding: '14px 30px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            Start Exploring <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
                        {/* Cart Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{
                                    background: 'rgba(30,41,59,0.7)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'rgba(15,23,42,0.6)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Fallback styling for images */}
                                        <div style={{
                                            width: '100%', height: '100%',
                                            background: item.type === 'Flight' ? 'linear-gradient(45deg, #818cf8, #4f46e5)' : 'linear-gradient(45deg, #f472b6, #db2777)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}>
                                            {item.type}
                                        </div>
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{item.type}</div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '5px' }}>{item.title}</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.details}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <Trash2 size={16} style={{ marginRight: '5px' }} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{
                            background: 'rgba(30,41,59,0.7)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '30px'
                        }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                Order Summary
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#94a3b8' }}>
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#94a3b8' }}>
                                <span>Taxes & Fees</span>
                                <span>₹{(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginTop: '20px', 
                                paddingTop: '20px', 
                                borderTop: '1px dashed rgba(255,255,255,0.2)',
                                fontSize: '1.5rem',
                                fontWeight: '900',
                                color: '#fff'
                            }}>
                                <span>Total</span>
                                <span>₹{(totalPrice * 1.18).toLocaleString('en-IN')}</span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                style={{
                                    width: '100%',
                                    marginTop: '30px',
                                    background: 'linear-gradient(to right, #818cf8, #6366f1)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                <CreditCard size={20} style={{ marginRight: '10px' }} /> Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
