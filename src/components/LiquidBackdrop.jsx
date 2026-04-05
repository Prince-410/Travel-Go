import React from 'react';

const LiquidBackdrop = () => {
  return (
    <div className="ng-liquid-container" style={{ background: 'transparent' }}>
      <div className="ng-orb ng-orb-1"></div>
      <div className="ng-orb ng-orb-2"></div>
      <div className="ng-orb ng-orb-3"></div>
      <div className="ng-orb ng-orb-4"></div>
      <div className="ng-noise-overlay"></div>
    </div>
  );
};

export default LiquidBackdrop;
