import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null); // { title, message, onConfirm, onCancel, type: 'confirm' | 'alert' }

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, type = 'confirm') => {
    setModal({
      title,
      message,
      type,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  }, []);

  const hideToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const getModalTheme = () => {
    if (!modal) return {};
    switch(modal.type) {
        case 'success':
        case 'alert':
            return { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', icon: <CheckCircle size={40}/>, btn: 'linear-gradient(135deg, #4ade80, #22c55e)' };
        case 'error':
            return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: <XCircle size={40}/>, btn: 'linear-gradient(135deg, #f87171, #ef4444)' };
        case 'info':
            return { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', icon: <Info size={40}/>, btn: 'linear-gradient(135deg, #60a5fa, #3b82f6)' };
        case 'confirm':
        default:
            return { color: '#818cf8', bg: 'rgba(129,140,248,0.1)', icon: <AlertCircle size={40}/>, btn: 'linear-gradient(135deg, #818cf8, #6366f1)' };
    }
  };

  const theme = getModalTheme();

  // Handle body scroll lock
  React.useEffect(() => {
    if (modal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [modal]);

  return (
    <UIContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 12,
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.3)' : toast.type === 'warning' ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.3)'}`,
            borderRadius: 16, padding: '16px 20px', minWidth: 280, maxWidth: 400,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.1, 1)',
            pointerEvents: 'auto'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: toast.type === 'error' ? 'rgba(248,113,113,0.15)' : toast.type === 'warning' ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
              color: toast.type === 'error' ? '#f87171' : toast.type === 'warning' ? '#fbbf24' : '#4ade80'
            }}>
              {toast.type === 'error' ? <XCircle size={20}/> : toast.type === 'warning' ? <AlertCircle size={20}/> : toast.type === 'info' ? <Info size={20}/> : <CheckCircle size={20}/>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{toast.message}</p>
            </div>
            <button onClick={() => hideToast(toast.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
              <X size={16}/>
            </button>
          </div>
        ))}
      </div>

      {/* Modern Modal / Confirm Dialog */}
      {modal && (
        <>
          <div className="premium-modal-overlay" onClick={modal.onCancel} />
          <div className="premium-modal-container">
            <div style={{
              background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 32, padding: 48, width: '100%', textAlign: 'center',
              boxShadow: '0 50px 120px rgba(0,0,0,0.7)', animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%', margin: '0 auto 28px',
                background: theme.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: theme.color,
                border: `1px solid ${theme.color}30`
              }}>
                {theme.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 14, color: '#fff', letterSpacing: '-0.5px' }}>{modal.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 40 }}>{modal.message}</p>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={modal.onConfirm} style={{
                  flex: 1, padding: '18px', borderRadius: 18, border: 'none',
                  background: theme.btn,
                  color: '#fff', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
                  boxShadow: `0 12px 24px ${theme.color}40`,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  {modal.type === 'confirm' ? 'Confirm Action' : 'Accept'}
                </button>
                {modal.type === 'confirm' && (
                  <button onClick={modal.onCancel} style={{
                    flex: 1, padding: '18px', borderRadius: 18, 
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
