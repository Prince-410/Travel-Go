import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import '../App.css';

const PressPage = () => {
    const { showToast } = useUI();
    const [pressReleases, setPressReleases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPress = async () => {
            try {
                const res = await fetch(`\/api/press`);
                if (res.ok) setPressReleases(await res.json());
            } catch (err) {
                console.error('Failed to fetch press releases', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPress();
    }, []);

    const handleDownload = (title, filename) => {
        const link = document.createElement('a');
        link.href = `/images/press/${filename}`;
        link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_travelgo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Initializing download for ${title}...`, 'info');
    };

    const mediaKit = [
        {
            title: 'Company Logo',
            description: 'High-resolution logo with transparent background',
            icon: '🎨',
            file: 'logo.png'
        },
        {
            title: 'Brand Guidelines',
            description: 'Typography, color codes and usage rules',
            icon: '📋',
            file: 'guidelines.png'
        },
        {
            title: 'Press Kit',
            description: 'Complete pack with bio and company deck',
            icon: '📦',
            file: 'presskit.png'
        },
        {
            title: 'Media Assets',
            description: 'Product lifestyle and interface screenshots',
            icon: '🖼️',
            file: 'lifestyle.png'
        }
    ];

    return (
        <div style={{ minHeight: '70vh' }}>
            {/* Hero Section */}
            <section style={{
                padding: '100px 20px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Press & Media
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '750px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        The latest stories, news, and official brand assets from the world of TravelGo.
                    </p>
                </div>
            </section>

            {/* Press Contact */}
            <section style={{ padding: '60px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(16px)',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center'
                    }}>
                        <h2 className="section-title">
                            Media Inquiries
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '30px', lineHeight: '1.7' }}>
                            For press inquiries, interviews, or media partnerships, please contact our PR team
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                            <div>
                                <p style={{ color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800' }}>Email</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#9A7EAE' }}>
                                    press@travelgo.com
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800' }}>Phone</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#9A7EAE' }}>
                                    +91-80-9876-5432
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Press Releases */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Latest Updates</h2>
                    <div style={{ marginTop: '40px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)' }}>
                                <div className="loader" style={{ marginBottom: 20 }}></div>
                                Fetching latest news...
                            </div>
                        ) : pressReleases.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', background:'rgba(255,255,255,0.02)', borderRadius:16 }}>
                                <FileText size={48} style={{ opacity:0.3, marginBottom:20 }}/>
                                <p>No press releases available at the moment.</p>
                            </div>
                        ) : (
                            pressReleases.map((release, index) => (
                                <div key={release._id || index} style={{
                                    background: 'rgba(30, 41, 59, 0.4)',
                                    backdropFilter: 'blur(12px)',
                                    padding: '35px',
                                    borderRadius: '24px',
                                    marginBottom: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = 'rgba(154, 126, 174, 0.3)';
                                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                        <span style={{
                                            background: 'rgba(154, 126, 174, 0.1)',
                                            color: '#9A7EAE',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {release.category}
                                        </span>
                                        <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                            {release.date}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-color)', lineHeight:1.3 }}>
                                        {release.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '20px', fontSize: '1.05rem' }}>
                                        {release.excerpt}
                                    </p>
                                    <div style={{ color: '#9A7EAE', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        Read Full Story <span style={{ fontSize: '1.2rem' }}>→</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Media Kit */}
            <section style={{ padding: '100px 20px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign:'center', marginBottom:50 }}>
                        <h2 className="section-title">Brand Assets</h2>
                        <p style={{ color:'var(--text-light)', fontSize:'1.1rem' }}>Download our official media resources for press use</p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '30px'
                    }}>
                        {mediaKit.map((item, index) => (
                            <div key={index} style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                backdropFilter: 'blur(16px)',
                                padding: '40px 30px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ 
                                    width: 80, height: 80, borderRadius: '20px', background: 'rgba(154, 126, 174, 0.1)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', 
                                    margin: '0 auto 24px auto'
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-color)' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--text-light)', marginBottom: '24px', lineHeight: '1.6', minHeight: 48 }}>
                                    {item.description}
                                </p>
                                <button 
                                    onClick={() => handleDownload(item.title, item.file)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 25px',
                                        background: 'linear-gradient(135deg, #9A7EAE 0%, #7c3aed 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(154, 126, 174, 0.3)'
                                    }}>
                                    Download Assets
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Executive Leadership */}
            <section style={{ padding: '100px 20px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="section-title">Leadership Team</h2>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:40, marginTop:50 }}>
                        <div style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: 30, display: 'flex', gap: 20, alignItems: 'center' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '24px', background: 'linear-gradient(45deg, #9A7EAE, #818cf8)' }}></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>Shreya Patel</h4>
                                <p style={{ color: '#9A7EAE', fontWeight: 700, margin: '4px 0 10px 0' }}>Founder & CEO</p>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>A visionary leader driving TravelGo's growth and strategy with innovation.</p>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: 30, display: 'flex', gap: 20, alignItems: 'center' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '24px', background: 'linear-gradient(45deg, #34d399, #9A7EAE)' }}></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>Dr. Prince Lakhani</h4>
                                <p style={{ color: '#34d399', fontWeight: 700, margin: '4px 0 10px 0' }}>CTO</p>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>The technical architect behind our high-scale travel infrastructure.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Facts */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title">Quick Facts</h2>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(16px)',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        marginTop: '40px'
                    }}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ borderBottom: '1px solid rgba(250, 250, 250, 0.1)', paddingBottom: '15px' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Founded</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>2015</p>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(250, 250, 250, 0.1)', paddingBottom: '15px' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Headquarters</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>Bangalore, India</p>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(250, 250, 250, 0.1)', paddingBottom: '15px' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Registered Users</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>10+ Million</p>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(250, 250, 250, 0.1)', paddingBottom: '15px' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Countries Served</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>100+</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Services</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>
                                    Flights, Hotels, Trains, Buses, Cabs, Holiday Packages
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PressPage;
