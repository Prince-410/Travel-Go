import React from 'react';
import '../App.css';

const BlogPage = () => {
    const blogPosts = [
        {
            title: '10 Hidden Gems in Southeast Asia You Must Visit',
            category: 'Travel Tips',
            date: 'Feb 5, 2026',
            image: '🏝️',
            excerpt: 'Discover the most beautiful and underrated destinations in Southeast Asia that will take your breath away.'
        },
        {
            title: 'How to Pack Light for a 2-Week Trip',
            category: 'Travel Hacks',
            date: 'Feb 3, 2026',
            image: '🎒',
            excerpt: 'Master the art of packing light with our expert tips and tricks for long-term travel.'
        },
        {
            title: 'Best Time to Visit India: A Complete Guide',
            category: 'Destination Guide',
            date: 'Jan 28, 2026',
            image: '🇮🇳',
            excerpt: 'Plan your perfect Indian adventure with our comprehensive guide to the best seasons for each region.'
        },
        {
            title: 'Budget Travel: How to Explore Europe for Under $50/Day',
            category: 'Budget Travel',
            date: 'Jan 25, 2026',
            image: '💰',
            excerpt: 'Explore Europe without breaking the bank with these money-saving strategies and insider tips.'
        },
        {
            title: 'Top 15 Adventure Activities for Thrill Seekers',
            category: 'Adventure',
            date: 'Jan 20, 2026',
            image: '🏔️',
            excerpt: 'From bungee jumping to scuba diving, discover the most exhilarating adventures around the world.'
        },
        {
            title: 'Solo Female Travel: Safety Tips and Destinations',
            category: 'Solo Travel',
            date: 'Jan 15, 2026',
            image: '✈️',
            excerpt: 'Empower yourself with essential safety tips and the best destinations for solo female travelers.'
        }
    ];

    return (
        <div style={{ minHeight: '70vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                padding: '80px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        TravelGo Blog
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Travel stories, tips, and inspiration to fuel your wanderlust
                    </p>
                </div>
            </section>

            {/* Blog Posts */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '30px'
                    }}>
                        {blogPosts.map((post, index) => (
                            <div key={index} style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{
                                    background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '5rem'
                                }}>
                                    {post.image}
                                </div>
                                <div style={{ padding: '25px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <span style={{
                                            background: '#e3f2fd',
                                            color: '#008cff',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}>
                                            {post.category}
                                        </span>
                                        <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                                            {post.date}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '700',
                                        marginBottom: '15px',
                                        color: '#2d3748',
                                        lineHeight: '1.4'
                                    }}>
                                        {post.title}
                                    </h3>
                                    <p style={{
                                        color: '#718096',
                                        lineHeight: '1.7',
                                        marginBottom: '20px'
                                    }}>
                                        {post.excerpt}
                                    </p>
                                    <a href="#" style={{
                                        color: '#008cff',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        Read More →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section style={{
                padding: '60px 20px',
                background: '#f7fafc',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                        Subscribe to Our Newsletter
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '30px' }}>
                        Get the latest travel tips and stories delivered to your inbox
                    </p>
                    <div style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                flex: 1,
                                padding: '15px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        <button style={{
                            padding: '15px 30px',
                            background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
