import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, MapPin, Plane, Hotel, Car } from 'lucide-react';
import { getChatbotResponse } from '../utils/aiEngine';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m your AI Travel Assistant.\n\nI can help you find the cheapest flights, best hotels, and plan complete trips!\n\nTry: "Ahmedabad to Goa" or "cheap flights"', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getChatbotResponse(userMsg.text);
      let botText = response.text;

      // Format recommendation data
      if (response.type === 'recommendation' && response.data) {
        const d = response.data;
        botText += '\n\n✈️ **Flights:**\n';
        d.flights.forEach(f => { botText += `• ${f.airline} — ₹${f.price.toLocaleString('en-IN')} (${f.duration}) ${f.tip}\n`; });
        botText += '\n🏨 **Hotels:**\n';
        d.hotels.forEach(h => { botText += `• ${h.name} — ₹${h.price.toLocaleString('en-IN')}/night ⭐${h.rating} ${h.tip}\n`; });
        botText += '\n🚗 **Cabs:**\n';
        d.cabs.forEach(c => { botText += `• ${c.type} — ₹${c.price.toLocaleString('en-IN')} ${c.tip}\n`; });
        botText += '\n🎯 **Activities:**\n';
        d.activities.forEach(a => { botText += `• ${a}\n`; });
        botText += `\n💰 **Estimated Total: ₹${d.totalEstimate.toLocaleString('en-IN')}** (Save ${d.savingsPercent}% vs booking separately!)`;
      }

      setMessages(prev => [...prev, { role: 'bot', text: botText, time: new Date() }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  const quickActions = [
    { label: 'Ahmedabad → Goa', icon: <Plane size={12} /> },
    { label: 'Cheap flights', icon: <Sparkles size={12} /> },
    { label: 'Hotel tips', icon: <Hotel size={12} /> },
    { label: 'Delhi → Manali', icon: <MapPin size={12} /> },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 100); }}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = isOpen ? 'scale(0)' : 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
      >
        <MessageCircle size={26} color="#fff" />
        {/* Pulse ring */}
        <div style={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          border: '2px solid rgba(129,140,248,0.5)',
          animation: 'chatPulse 2s infinite'
        }} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 400, maxWidth: 'calc(100vw - 48px)', height: 560, maxHeight: 'calc(100vh - 100px)',
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg, #0c0b1d, #1a1833)',
          border: '1px solid rgba(129,140,248,0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          animation: 'chatSlideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>AI Travel Assistant</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                Online — Ready to help
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              padding: 8, cursor: 'pointer', color: '#fff', display: 'flex'
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'rgba(129,140,248,0.2)' : 'rgba(74,222,128,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {msg.role === 'user' ? <User size={14} color="#818cf8" /> : <Bot size={14} color="#4ade80" />}
                </div>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #818cf8, #6366f1)'
                    : 'rgba(255,255,255,0.06)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '0.85rem', lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={14} color="#4ade80" />
                </div>
                <div style={{
                  padding: '12px 18px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: 4
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#818cf8',
                      animation: `typingDot 1.4s infinite ${i * 0.2}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {quickActions.map((qa, i) => (
              <button key={i} onClick={() => { setInput(qa.label); setTimeout(() => { setInput(qa.label); sendMessage(); }, 50); }}
                style={{
                  background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
                  borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
                  color: '#818cf8', fontSize: '0.72rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; }}
              >
                {qa.icon} {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Ask me anything about travel..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: '0.88rem',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#818cf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button onClick={sendMessage} style={{
              background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              border: 'none', borderRadius: 10, padding: '10px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
