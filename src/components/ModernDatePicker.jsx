import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ModernDatePicker = ({ value, onChange, placeholder, accentColor = '#818cf8' }) => {
    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const today = new Date();

    const handleSelect = (day) => {
        const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Format as YYYY-MM-DD
        const formatted = selected.toLocaleDateString('en-CA'); 
        onChange(formatted);
        setOpen(false);
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const displayDate = value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <div onClick={() => setOpen(!open)} style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', transition: 'all 0.2s',
                borderColor: open ? accentColor : 'rgba(255,255,255,0.1)',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <Calendar size={16} color={accentColor} />
                <span style={{ 
                    flex: 1, 
                    fontSize: '0.95rem', 
                    color: value ? '#fff' : 'rgba(255,255,255,0.4)', 
                    fontWeight: value ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {displayDate || placeholder}
                </span>
            </div>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 1000,
                    background: 'rgba(15,23,42,0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: 16,
                    padding: 16,
                    width: 300,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <ChevronLeft size={16} />
                        </button>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Days of week */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                            
                            let isSelected = false;
                            if (value) {
                                const valDate = new Date(value);
                                isSelected = day === valDate.getDate() && currentDate.getMonth() === valDate.getMonth() && currentDate.getFullYear() === valDate.getFullYear();
                            }

                            // Optional: Disable past dates
                            const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(today.setHours(0,0,0,0));

                            return (
                                <button key={day} 
                                    onClick={() => !isPast && handleSelect(day)}
                                    disabled={isPast}
                                    style={{
                                        width: '100%', aspectRatio: '1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 8, border: 'none',
                                        fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600,
                                        cursor: isPast ? 'not-allowed' : 'pointer',
                                        background: isSelected ? accentColor : isToday ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: isPast ? '#334155' : isSelected ? '#fff' : '#cbd5e1',
                                        transition: 'all 0.1s'
                                    }}
                                    onMouseEnter={e => { if(!isSelected && !isPast) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                    onMouseLeave={e => { if(!isSelected && !isPast) e.currentTarget.style.background = isToday ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernDatePicker;
