import React from 'react';

const LiveStatusBadge = () => {
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px', 
      padding: '2px 8px', 
      background: 'rgba(239, 68, 68, 0.1)', 
      borderRadius: '12px',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    }}>
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: '#ef4444', 
        display: 'inline-block',
        animation: 'pulse 2s infinite'
      }}></span>
      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px' }}>LIVE</span>
    </div>
  );
};

export default LiveStatusBadge;
