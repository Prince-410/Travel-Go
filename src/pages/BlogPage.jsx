import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import '../App.css';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Travel Tips', 'Destination Guide', 'Travel Hacks', 'Budget Travel', 'Solo Travel', 'Adventure'];

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blogs`);
            if (res.ok) {
                setBlogs(await res.json());
            }
        } catch (e) {
            console.error('Failed to fetch blogs:', e);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{
                padding: '100px 20px',
                textAlign: 'center',
                position: 'relative'
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
                        TravelGo Blog
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto 40px', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Travel stories, expert tips, and inspiration to fuel your next adventure across the globe.
                    </p>

                    {/* Search and Filter */}
                    <div style={{ 
                        maxWidth: '800px', 
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input 
                                type="text" 
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    width: '100%',
                                    padding: '15px 15px 15px 50px',
                                    borderRadius: '50px',
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            overflowX: 'auto', 
                            padding: '10px 0',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}>
                             <style>{`
                                div::-webkit-scrollbar { display: none; }
                            `}</style>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '30px',
                                        background: selectedCategory === cat ? '#9A7EAE' : 'rgba(154, 126, 174, 0.1)',
                                        color: selectedCategory === cat ? '#fff' : '#9A7EAE',
                                        border: `1px solid ${selectedCategory === cat ? '#9A7EAE' : 'rgba(154, 126, 174, 0.2)'}`,
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: '700',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: selectedCategory === cat ? '0 8px 20px rgba(154, 126, 174, 0.3)' : 'none'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>
                        <BookOpen size={48} className="animate-pulse" style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <p>Discovering stories...</p>
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '30px'
                    }}>
                        {filteredBlogs.map((blog) => (
                            <div key={blog._id} style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }} className="blog-card">
                                <div style={{ 
                                    height: '220px', 
                                    background: 'linear-gradient(45deg, #1e293b, #334155)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '5rem'
                                }}>
                                    {blog.image}
                                </div>
                                <div style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            background: 'rgba(154, 126, 174, 0.15)', 
                                            color: '#9A7EAE',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>
                                            {blog.category}
                                        </span>
                                    </div>
                                    <h3 style={{ 
                                        fontSize: '1.4rem', 
                                        fontWeight: '800', 
                                        lineHeight: 1.4,
                                        marginBottom: '15px',
                                        color: '#fff'
                                    }}>
                                        {blog.title}
                                    </h3>
                                    <p style={{ 
                                        color: '#94a3b8', 
                                        fontSize: '0.95rem', 
                                        lineHeight: 1.7,
                                        marginBottom: '25px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 5,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {blog.excerpt}
                                    </p>
                                    <div style={{ 
                                        paddingTop: '20px', 
                                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#9A7EAE', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                {blog.author.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600' }}>{blog.author}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.8rem' }}>
                                            <Calendar size={14} />
                                            {blog.date}
                                        </div>
                                    </div>
                                    <button style={{ 
                                        width: '100%',
                                        marginTop: '25px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#fff',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#9A7EAE'; e.currentTarget.style.border = '1px solid #9A7EAE'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)'; }}
                                    >
                                        Read Story <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>
                        <Search size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <h3 style={{ color: '#fff' }}>No stories match your criteria</h3>
                        <p>Try different keywords or categories</p>
                        <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} style={{ color: '#9A7EAE', background: 'none', border: 'none', marginTop: '20px', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>Clear all filters</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default BlogPage;
