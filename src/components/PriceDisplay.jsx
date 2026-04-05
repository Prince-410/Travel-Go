import React, { useEffect, useState } from 'react';

const PriceDisplay = ({ basePrice, isDynamic, surgeMultiplier = 1 }) => {
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [isSurging, setIsSurging] = useState(false);

  useEffect(() => {
    let finalPrice = basePrice;
    if (isDynamic) {
      finalPrice = basePrice * surgeMultiplier;
    }
    
    if (finalPrice > currentPrice) {
      setIsSurging(true);
      setTimeout(() => setIsSurging(false), 2000);
    }
    setCurrentPrice(finalPrice);
  }, [basePrice, isDynamic, surgeMultiplier]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isDynamic && isSurging && (
        <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px', animation: 'bounce 1s infinite' }}>
          High Demand!
        </div>
      )}
      <div style={{
        fontSize: '1.4rem',
        fontWeight: '900',
        color: isSurging ? '#ef4444' : 'var(--text-color)',
        transition: 'color 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        ₹ {Math.round(currentPrice).toLocaleString()}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase' }}>
        Per person
      </div>
    </div>
  );
};

export default PriceDisplay;
