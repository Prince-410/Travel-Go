import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
                },
                {
                    question: 'Can I modify my booking after confirmation?',
                    answer: 'Yes, you can modify your booking through "My Bookings" section. However, modification charges may apply depending on the airline/hotel policy and fare type.'
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
                },
                {
                    question: 'Are there any hidden charges?',
                    answer: 'No hidden charges! The final price you see at checkout includes all taxes, fees, and charges. We believe in complete transparency.'
                },
                {
                    question: 'Do you offer EMI options?',
                    answer: 'Yes, we offer EMI options on bookings above ₹10,000 with select credit cards. You can choose from 3, 6, 9, or 12-month EMI plans at checkout.'
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
                },
                {
                    question: 'What are the cancellation charges?',
                    answer: 'Cancellation charges vary based on the service type, provider policy, and how close to the travel date you cancel. Please refer to our detailed Cancellation & Refund Policy page for specific information.'
                },
                {
                    question: 'Can I get a full refund?',
                    answer: 'Full refunds are possible if you cancel well in advance (typically 72+ hours for flights, 7+ days for hotels). However, a small service fee may apply. Check the specific terms for your booking.'
                }
            ]
        },
        {
            category: 'Account & Profile',
            questions: [
                {
                    question: 'Do I need to create an account to book?',
                    answer: 'While you can browse without an account, creating one makes booking faster and helps you manage all your trips in one place. You can also earn rewards and get exclusive deals!'
                },
                {
                    question: 'I forgot my password. What should I do?',
                    answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and we\'ll send you a password reset link.'
                },
                {
                    question: 'How do I update my contact information?',
                    answer: 'Log in to your account, go to "Profile Settings", and update your contact details. Make sure to save the changes.'
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Yes, you can request account deletion by contacting our customer support at support@travelgo.com. Please note this action is irreversible.'
                }
            ]
        },
        {
            category: 'Travel Documents & Requirements',
            questions: [
                {
                    question: 'What documents do I need for domestic travel?',
                    answer: 'For domestic flights, you need a valid government-issued photo ID (Aadhaar Card, Passport, Driving License, Voter ID, or PAN Card).'
                },
                {
                    question: 'What documents are required for international travel?',
                    answer: 'You need a valid passport (with at least 6 months validity), visa (if required for your destination), and any health certificates or vaccination records as per destination requirements.'
                },
                {
                    question: 'Do children need ID proof for travel?',
                    answer: 'For domestic travel, children under 12 don\'t need ID if traveling with parents. For international travel, all passengers including infants need a valid passport.'
                },
                {
                    question: 'How do I check visa requirements?',
                    answer: 'Visa requirements vary by destination and nationality. We recommend checking with the embassy or consulate of your destination country well in advance of travel.'
                }
            ]
        },
        {
            category: 'Customer Support',
            questions: [
                {
                    question: 'How can I contact customer support?',
                    answer: 'You can reach us 24/7 via phone at 1800-123-4567 (toll-free), email at support@travelgo.com, or use the live chat feature on our website.'
                },
                {
                    question: 'What are your customer support hours?',
                    answer: 'Our customer support team is available 24/7, 365 days a year to assist you with any queries or issues.'
                },
                {
                    question: 'How quickly will I get a response?',
                    answer: 'Phone and live chat support provide immediate assistance. Email queries are typically responded to within 2-4 hours during business hours and within 24 hours otherwise.'
                },
                {
                    question: 'Can I get support in regional languages?',
                    answer: 'Yes! We offer support in Hindi, English, and several regional languages including Tamil, Telugu, Kannada, Bengali, and Marathi.'
                }
            ]
        }
    ];

    const toggleFAQ = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

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
                        Frequently Asked Questions
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        Find answers to common questions about booking, payments, cancellations, and more
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section style={{ padding: '80px 20px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex} style={{ marginBottom: '50px' }}>
                            <h2 style={{
                                fontSize: '1.8rem',
                                fontWeight: '700',
                                marginBottom: '30px',
                                color: '#2d3748',
                                borderBottom: '3px solid #008cff',
                                paddingBottom: '10px'
                            }}>
                                {category.category}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {category.questions.map((faq, qIndex) => {
                                    const isOpen = openIndex === `${catIndex}-${qIndex}`;
                                    return (
                                        <div key={qIndex} style={{
                                            background: 'white',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <button
                                                onClick={() => toggleFAQ(catIndex, qIndex)}
                                                style={{
                                                    width: '100%',
                                                    padding: '20px 25px',
                                                    background: isOpen ? '#f7fafc' : 'white',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '15px',
                                                    transition: 'background 0.3s ease'
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: '#2d3748',
                                                    flex: 1
                                                }}>
                                                    {faq.question}
                                                </span>
                                                <span style={{ color: '#008cff', flexShrink: 0 }}>
                                                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div style={{
                                                    padding: '0 25px 25px 25px',
                                                    background: '#f7fafc'
                                                }}>
                                                    <p style={{
                                                        color: '#4a5568',
                                                        lineHeight: '1.8',
                                                        fontSize: '1rem'
                                                    }}>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still Have Questions */}
            <section style={{
                padding: '60px 20px',
                background: '#f7fafc',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '15px', color: '#2d3748' }}>
                        Still Have Questions?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '30px' }}>
                        Our customer support team is here to help 24/7
                    </p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        style={{
                            padding: '15px 40px',
                            background: 'linear-gradient(135deg, #008cff 0%, #0066cc 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0, 140, 255, 0.3)'
                        }}
                    >
                        Contact Support
                    </button>
                </div>
            </section>
        </div>
    );
};

export default FAQsPage;
