import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, MessageCircle } from 'lucide-react';
import '../App.css';

const FAQsPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqCategories = [
        {
            category: 'Booking & Reservations',
            questions: [
                {
                    question: 'How do I book a flight on TravelGo?',
                    answer: 'Simply enter your departure and destination cities, select your travel dates, choose the number of passengers, and click "Search Flights". Browse through available options, select your preferred flight, and proceed to payment.'
                },
                {
                    question: 'Can I book for multiple passengers at once?',
                    answer: 'Yes! You can book for up to 9 passengers in a single booking. Just select the number of adults, children, and infants when searching for flights.'
                },
                {
                    question: 'How will I receive my booking confirmation?',
                    answer: 'You will receive a booking confirmation via email and SMS immediately after successful payment. The confirmation includes your booking reference number and all travel details.'
                }
            ]
        },
        {
            category: 'Payment & Pricing',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), net banking, UPI, digital wallets (Paytm, PhonePe, Google Pay), and EMI options for eligible bookings.'
                },
                {
                    question: 'Is it safe to make payments on TravelGo?',
                    answer: 'Absolutely! All transactions are secured with 256-bit SSL encryption. We never store your complete card details. Your payment information is processed through PCI-DSS compliant payment gateways.'
                }
            ]
        },
        {
            category: 'Cancellations & Refunds',
            questions: [
                {
                    question: 'How do I cancel my booking?',
                    answer: 'Log in to your account, go to "My Bookings", select the booking you want to cancel, and click "Cancel Booking". Follow the prompts to complete the cancellation process.'
                },
                {
                    question: 'When will I receive my refund?',
                    answer: 'Refunds are processed within 7-10 business days from the date of cancellation. The amount will be credited to your original payment method.'
                }
            ]
        }
    ];

    const toggleFAQ = (catIndex, qIndex) => {
        const index = `${catIndex}-${qIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '900', 
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #9A7EAE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        lineHeight: '1.8', 
                        color: '#94a3b8' 
                    }}>
                        Quick answers to common questions about your travels. We're here to make your journey smoother.
                    </p>
                </div>
            </section>

            {/* FAQs Grid */}
            <section className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(154, 126, 174, 0.1)', color: '#9A7EAE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HelpCircle size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>{category.category}</h2>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {category.questions.map((faq, qIndex) => {
                                    const isOpen = openIndex === `${catIndex}-${qIndex}`;
                                    return (
                                        <div key={qIndex} style={{
                                            background: 'rgba(30, 41, 59, 0.4)',
                                            backdropFilter: 'blur(12px)',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <button
                                                onClick={() => toggleFAQ(catIndex, qIndex)}
                                                style={{
                                                    width: '100%',
                                                    padding: '24px 30px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '20px'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.15rem', fontWeight: '700', color: isOpen ? '#9A7EAE' : '#fff', flex: 1, transition: 'color 0.2s' }}>
                                                    {faq.question}
                                                </span>
                                                <span style={{ color: '#9A7EAE', transition: 'transform 0.3s' }}>
                                                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                </span>
                                            </button>
                                            <div style={{ 
                                                maxHeight: isOpen ? '500px' : '0', 
                                                overflow: 'hidden', 
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                                            }}>
                                                <div style={{ padding: '0 30px 24px 30px' }}>
                                                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '20px' }} />
                                                    <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div style={{ 
                    marginTop: '100px', 
                    background: 'linear-gradient(135deg, rgba(154, 126, 174, 0.1), rgba(124, 58, 237, 0.05))',
                    borderRadius: '32px',
                    padding: '60px',
                    textAlign: 'center',
                    border: '1px solid rgba(154, 126, 174, 0.2)'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>Still have questions?</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '35px' }}>Our dedicated support team is available 24/7 to assist you.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button onClick={() => window.location.href = '/contact'} style={{ 
                            padding: '16px 40px', 
                            borderRadius: '16px', 
                            background: '#9A7EAE', 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: '800', 
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}>Contact Support</button>
                        <button style={{ 
                            padding: '16px 40px', 
                            borderRadius: '16px', 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            color: '#fff', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            fontWeight: '800', 
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}>Live Chat</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQsPage;
