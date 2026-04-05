import React from 'react';
import LiveStatusBadge from './LiveStatusBadge';
import PriceDisplay from './PriceDisplay';
import { Plane, Bus, Train, Building2, Car, Briefcase } from 'lucide-react';

const ICONS = {
  flight: <Plane size={24} style={{ color: '#818cf8' }} />,
  bus: <Bus size={24} style={{ color: '#34d399' }} />,
  train: <Train size={24} style={{ color: '#fbbf24' }} />,
  hotel: <Building2 size={24} style={{ color: '#a78bfa' }} />,
  cab: <Car size={24} style={{ color: '#f87171' }} />,
  holiday: <Briefcase size={24} style={{ color: '#fb923c' }} />
};

const DynamicCard = ({ data, onSelect }) => {
  const isSoldOut = data.availableSeats <= 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0b1d 0%, #1a1833 100%)',
      border: '1px solid rgba(129,140,248,0.15)',
      borderRadius: 16, overflow: 'hidden',
      transition: 'transform 0.25s, box-shadow 0.25s',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      width: '100%'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.45), 0 0 0 2px rgba(129,140,248,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; }}>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', flexWrap: 'wrap' }}>
        {data.dynamicPricing && (
          <span style={{ 
            background: 'rgba(74,222,128,0.12)', 
            color: '#4ade80', 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            padding: '4px 12px', 
            borderRadius: 20, 
            border: '1px solid rgba(74,222,128,0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4 
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }}></span>
            LIVE PRICE
          </span>
        )}
        {data.availableSeats < 10 && (
          <span style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(248,113,113,0.25)', textTransform: 'uppercase' }}>
            ⚡ Filling Fast
          </span>
        )}
      </div>

      <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        
        {/* Type Icon & Identity */}
        <div style={{ minWidth: 150 }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>ID & TYPE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#818cf8' }}>
              {ICONS[data.type]}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', lineHeight: 1.2 }}>{data.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, textTransform: 'capitalize' }}>{data.type} &bull; {data.time || 'Schedule'}</div>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.time || 'Live'}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: 4, textTransform: 'uppercase' }}>{data.source || 'START'}</div>
        </div>

        {/* Route Visualizer */}
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #818cf8, rgba(129,140,248,0.2))' }} />
            {ICONS[data.type] ? React.cloneElement(ICONS[data.type], { size: 16 }) : '✈️'}
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, rgba(129,140,248,0.2), #818cf8)' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', letterSpacing: 0.5 }}>{data.date}</div>
            <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase' }}>Direct Connection</div>
          </div>
        </div>

        {/* Destination */}
        <div style={{ textAlign: 'center', minWidth: 100 }}>
           <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>Arrival</div>
           <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: 4, textTransform: 'uppercase' }}>{data.destination || 'END'}</div>
        </div>

        {/* Pricing & CTA */}
        <div style={{ textAlign: 'right', minWidth: 160, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 20 }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginBottom: 2 }}>TOTAL PRICE</div>
          <PriceDisplay basePrice={data.price || 0} isDynamic={data.dynamicPricing} surgeMultiplier={data.surgeMultiplier} />
          <div style={{ fontSize: '0.72rem', color: isSoldOut ? '#f87171' : '#64748b', fontWeight: 600, marginTop: 4 }}>
             {isSoldOut ? 'Sold Out' : `${data.availableSeats} seats left`}
          </div>
          <button 
            onClick={() => onSelect(data)}
            disabled={isSoldOut}
            style={{ 
              marginTop: 12,
              padding: '10px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: isSoldOut ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #818cf8, #6366f1)', 
              color: isSoldOut ? 'var(--text-light)' : '#fff', 
              fontWeight: 800, 
              fontSize: '0.9rem',
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              boxShadow: isSoldOut ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseEnter={e => { if(!isSoldOut) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { if(!isSoldOut) e.currentTarget.style.transform = 'none'; }}>
            {isSoldOut ? 'Unavailable' : 'Select'}
          </button>
        </div>

      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
};

export default DynamicCard;
