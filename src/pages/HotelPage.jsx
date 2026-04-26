import React,{useState,useEffect,useRef} from 'react';
import {Hotel,MapPin,Calendar,Users,Star,ChevronDown,ArrowRight,X,CheckCircle2,Shield,Gift,Zap} from 'lucide-react';
import BookingReceipt from '../components/BookingReceipt';
import { useAdminConfig } from '../context/AdminConfigContext';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import { useUI } from '../context/UIContext';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';

const ACC='#f59e0b';

const CityDrop=({value,onChange,placeholder,availableCities})=>{
    const [open,setOpen]=useState(false);const [q,setQ]=useState('');const ref=useRef();
    useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
    const list = (availableCities || []).filter(c => c && c.toLowerCase().includes((q || '').toLowerCase()));
    return(<div ref={ref} style={{position:'relative'}}>
        <div onClick={()=>setOpen(!open)} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',background:'rgba(255,255,255,0.05)',border:`1px solid ${open?ACC:'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'10px 14px'}}>
            <MapPin size={15} color={ACC}/><span style={{flex:1,fontSize:'0.95rem',color:value?'#fff':'rgba(255,255,255,0.4)',fontWeight:value?600:400}}>{value||placeholder}</span>
            <ChevronDown size={13} color={ACC} style={{transform:open?'rotate(180deg)':'none',transition:'transform .2s'}}/>
        </div>
        {open&&<div style={{position:'absolute',top:'calc(100% + 6px)',left:0,right:0,zIndex:300,background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,boxShadow:'0 20px 40px rgba(0,0,0,0.4)',overflow:'hidden'}}>
            <div style={{padding:'8px 10px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search city..." style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem'}}/></div>
            {list.map(c=><div key={c} onClick={()=>{onChange(c);setOpen(false);setQ('')}} style={{padding:'10px 14px',cursor:'pointer',fontWeight:600,transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(245,158,11,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>📍 {c}</div>)}
        </div>}
    </div>);
};

const HotelModal=({hotel,onClose})=>{
    const { showConfirm, showToast } = useUI();
    const { addLocalBooking, authFetch, user } = useAuth();
    const [tab,setTab]=useState('rooms');
    const [currentBooking, setCurrentBooking] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Handle body scroll lock
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    const handleConfirmBooking = async (room) => {
        // ... (existing logic)
        if (bookingLoading) return;
        setBookingLoading(true);
        try {
            const bookingData = {
                userId: user?._id,
                type: 'hotel',
                amount: Number(room.pricePerNight) || 0,
                status: 'confirmed',
                paymentStatus: 'completed',
                details: {
                    cardId: hotel._id,
                    hotelId: hotel._id,
                    hotelName: hotel.title,
                    source: hotel.title,
                    destination: hotel.destination,
                    date: hotel.features?.checkIn || 'TBD',
                    checkIn: hotel.features?.checkIn || '12:00 PM',
                    checkOut: hotel.features?.checkOut || '11:00 AM',
                    rooms: 1,
                    roomType: room.type
                }
            };

            const response = await authFetch('/booking', {
                method: 'POST',
                body: JSON.stringify(bookingData)
            });

            const finalBooking = response.booking || {
                ...bookingData,
                _id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                invoiceNumber: 'INV-' + Math.floor(100000 + Math.random() * 900000),
                createdAt: new Date().toISOString()
            };

            addLocalBooking(finalBooking);
            setCurrentBooking(finalBooking);
            showToast('Hotel booking confirmed!', 'success');
        } catch (err) {
            console.error('Hotel booking failed:', err);
            showToast(err.message || 'Failed to book hotel', 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    if(!hotel) return null;
    const hotelStars = hotel.features?.starRating || 4;
    const hotelReviews = Array.isArray(hotel.features?.reviews) ? hotel.features.reviews : [];
    const avgRating = (hotelReviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / Math.max(hotelReviews.length, 1)).toFixed(1);
    const roomsFromFeatures = Array.isArray(hotel.features?.rooms) ? hotel.features.rooms : null;
    const fallbackRooms = [
        { type: 'Standard Room', pricePerNight: hotel.price, availableRooms: hotel.availableSeats || 0, features: ['Free WiFi','TV'], icon: '🛏️' }
    ];
    const hotelRooms = roomsFromFeatures && roomsFromFeatures.length > 0 ? roomsFromFeatures : fallbackRooms;

    useEffect(() => {
        setTab('rooms');
    }, [hotel?._id]);

    return(<>
        <div className="premium-modal-overlay" onClick={onClose} />
        <div className="premium-modal-container" style={{ maxWidth: 860 }}>
            <div style={{background:'linear-gradient(135deg,#1c1108,#1a1200)',border:`1px solid rgba(245,158,11,0.25)`,borderRadius:24,width:'100%',boxShadow:'0 30px 60px rgba(0,0,0,0.7)',overflow:'hidden'}}>
                <div style={{padding:'24px 28px',borderBottom:`1px solid rgba(245,158,11,0.12)`,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div>
                        <div style={{display:'flex',gap:3,marginBottom:4}}>{'★'.repeat(Math.floor(hotelStars)).split('').map((s,i)=><span key={i} style={{color:ACC}}>{s}</span>)}</div>
                        <h2 style={{margin:0,fontWeight:900,fontSize:'1.5rem'}}>{hotel.title}</h2>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
                            {hotelReviews.length > 0 && <div style={{background:`rgba(245,158,11,0.15)`,borderRadius:8,padding:'3px 10px',display:'flex',alignItems:'center',gap:4,fontWeight:800,color:ACC,fontSize:'0.82rem'}}><Star size={12} fill="currentColor"/>{avgRating}</div>}
                            <span style={{color:'#64748b',fontSize:'0.8rem'}}>({hotelReviews.length} reviews) · 📍 {hotel.features?.address || hotel.destination}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:8,padding:8,cursor:'pointer',color:'#94a3b8'}}><X size={18}/></button>
                </div>
                <div style={{display:'flex',borderBottom:`1px solid rgba(245,158,11,0.1)`}}>
                    {['rooms','reviews','amenities','map'].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'12px',background:'none',border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.82rem',textTransform:'capitalize',color:tab===t?ACC:'#64748b',borderBottom:`2px solid ${tab===t?ACC:'transparent'}`}}>{t}</button>)}
                </div>
                <div style={{padding:'20px 28px',maxHeight:420,overflowY:'auto'}}>
                    {tab==='rooms'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
                        {hotelRooms.map((rm, idx) => {
                            const roomFeatures = Array.isArray(rm.features) ? rm.features : [];
                            return (
                            <div key={rm.type || idx} style={{background:'rgba(255,255,255,0.04)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:14,padding:'16px'}}>
                                <div style={{fontSize:'1.6rem',marginBottom:6}}>{rm.icon}</div>
                                <div style={{fontWeight:800,fontSize:'0.92rem',marginBottom:2}}>{rm.type}</div>
                                <div style={{fontSize:'0.72rem',color:'#64748b',marginBottom:8}}>{rm.availableRooms} rooms left</div>
                                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:10}}>
                                    {roomFeatures.slice(0,3).map(f=><span key={f} style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:'2px 7px',fontSize:'0.62rem',color:'#94a3b8'}}>{f}</span>)}
                                </div>
                                <div style={{borderTop:`1px solid rgba(255,255,255,0.07)`,paddingTop:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                    <div><div style={{fontSize:'1.1rem',fontWeight:900}}>₹{(Number(rm.pricePerNight) || 0).toLocaleString('en-IN')}</div><div style={{fontSize:'0.62rem',color:'#64748b'}}>per night</div></div>
                                    <button disabled={bookingLoading} onClick={()=>handleConfirmBooking(rm)} style={{background:bookingLoading?'rgba(255,255,255,0.05)':`linear-gradient(135deg,${ACC},#d97706)`,color:bookingLoading?'rgba(255,255,255,0.3)':'#000',border:'none',borderRadius:8,padding:'7px 12px',fontWeight:800,fontSize:'0.75rem',cursor:bookingLoading?'not-allowed':'pointer'}}>{bookingLoading?'...':'Book'}</button>
                                </div>
                            </div>
                            );
                        })}
                    </div>}

                    {tab==='reviews'&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
                        {hotelReviews.map((rv,i)=><div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'14px'}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontWeight:700,fontSize:'0.88rem'}}>{rv.author}</span><div style={{display:'flex',alignItems:'center',gap:4,color:ACC,fontWeight:800,fontSize:'0.82rem'}}><Star size={11} fill="currentColor"/>{rv.rating}</div></div>
                            <p style={{color:'#94a3b8',fontSize:'0.82rem',margin:0}}>{rv.text}</p>
                            <div style={{fontSize:'0.68rem',color:'#475569',marginTop:6}}>{rv.date}</div>
                        </div>)}
                    </div>}
                    {tab==='amenities'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:9}}>
                        {(hotel.features?.amenities||['Pool','Spa']).map(a=><div key={a} style={{background:'rgba(255,255,255,0.04)',border:`1px solid rgba(245,158,11,0.12)`,borderRadius:9,padding:'10px 13px',display:'flex',alignItems:'center',gap:7,fontWeight:700,fontSize:'0.82rem'}}><CheckCircle2 size={13} color={ACC}/>{a}</div>)}
                    </div>}
                    {tab==='map'&&<div>
                        <div style={{background:'rgba(255,255,255,0.03)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:14,height:220,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,position:'relative',overflow:'hidden'}}>
                            <div style={{position:'absolute',inset:0,opacity:0.05}}>{Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:`${i*11}%`,top:0,bottom:0,width:1,background:'#fff'}}/>)}{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',top:`${i*15}%`,left:0,right:0,height:1,background:'#fff'}}/>)}</div>
                            <div style={{fontSize:'2.5rem',position:'relative'}}>📍</div>
                            <div style={{fontWeight:800,position:'relative'}}>{hotel.title}</div>
                            <div style={{color:'#94a3b8',fontSize:'0.8rem',position:'relative'}}>{hotel.features?.address||hotel.destination}</div>
                            <button onClick={()=>window.open(`https://maps.google.com/?q=${encodeURIComponent(hotel.title+' '+hotel.destination)}`,'_blank')} style={{background:`rgba(245,158,11,0.15)`,border:`1px solid rgba(245,158,11,0.3)`,borderRadius:8,padding:'7px 14px',color:ACC,fontWeight:700,fontSize:'0.78rem',cursor:'pointer',position:'relative',marginTop:6}}>Open in Google Maps ↗</button>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:12}}>
                            {[['Check-In',hotel.features?.checkIn||'12:00 PM'],['Check-Out',hotel.features?.checkOut||'11:00 AM']].map(([k,v])=><div key={k} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'11px 14px'}}><div style={{fontSize:'0.68rem',color:'#64748b',fontWeight:700}}>{k}</div><div style={{fontWeight:800,color:ACC,marginTop:2}}>{v}</div></div>)}
                        </div>
                    </div>}
                </div>
                {currentBooking && (
                    <BookingReceipt 
                        booking={currentBooking} 
                        onClose={() => setCurrentBooking(null)} 
                    />
                )}
            </div>
        </div>
    </>);
};

const HotelCard=({hotel,onClick})=>{
    const hotelStars = Number(hotel.features?.stars) || 4;
    const roomsFromFeatures = Array.isArray(hotel.features?.rooms) ? hotel.features.rooms : null;
    const hotelRooms = roomsFromFeatures && roomsFromFeatures.length > 0 
        ? roomsFromFeatures.map(r => ({ ...r, availableRooms: r.availableRooms || hotel.availableSeats }))
        : [{ availableRooms: hotel.availableSeats || 0 }];
    const minRoomsList = hotelRooms.map(r => Number(r.availableRooms) || 0);
    const minRooms = minRoomsList.length > 0 ? Math.min(...minRoomsList) : (Number(hotel.availableSeats) || 0);
    const urgent = minRooms > 0 && minRooms <= 3;
    let amenities = [];
    if (Array.isArray(hotel.features?.amenities)) amenities = hotel.features.amenities;
    else if (typeof hotel.features?.amenities === 'string') amenities = hotel.features.amenities.split(',').map(a => a.trim()).filter(Boolean);
    if (amenities.length === 0) amenities = ['Pool', 'Spa', 'WiFi'];

    return(<div onClick={onClick} style={{background:'linear-gradient(135deg,#1c1108,#1a1200)',border:`1px solid rgba(245,158,11,0.12)`,borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'transform .25s,box-shadow .25s',boxShadow:'0 4px 24px rgba(0,0,0,0.35)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(245,158,11,0.3)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.35)'}}>
        <div style={{height:130,background:`linear-gradient(135deg,rgba(245,158,11,0.08),rgba(30,20,0,0.9))`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem',position:'relative'}}>
            🏨
            {urgent&&<span style={{position:'absolute',top:8,right:8,background:'rgba(248,113,113,0.2)',color:'#f87171',fontSize:'0.62rem',fontWeight:800,padding:'2px 8px',borderRadius:20}}>⚡ Only {minRooms} rooms left</span>}
            <div style={{position:'absolute',top:8,left:8,display:'flex',gap:2}}>{'★'.repeat(Math.min(5, Math.max(1, hotelStars))).split('').map((s,i)=><span key={i} style={{color:ACC,fontSize:'0.75rem'}}>{s}</span>)}</div>
        </div>
        <div style={{padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <div>
                    <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{fontWeight:800,fontSize:'0.95rem'}}>{hotel.title}</div></div>
                    <div style={{fontSize:'0.72rem',color:'#64748b',marginTop:1}}>📍 {hotel.destination}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:3,background:`rgba(245,158,11,0.12)`,borderRadius:7,padding:'3px 9px',fontWeight:800,color:ACC,fontSize:'0.8rem'}}><Star size={11} fill="currentColor"/>{hotel.features?.rating||4.5}</div>
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
                {amenities.slice(0,3).map(a=><span key={a} style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:'2px 8px',fontSize:'0.64rem',color:'#94a3b8'}}>{a}</span>)}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:10}}>
                <div><div style={{fontSize:'0.65rem',color:'#64748b'}}>from</div><div style={{fontSize:'1.4rem',fontWeight:900,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{Number(hotel.price).toLocaleString('en-IN')}</div></div>
                <button style={{background:`linear-gradient(135deg,${ACC},#d97706)`,color:'#000',border:'none',borderRadius:9,padding:'8px 14px',fontWeight:800,fontSize:'0.8rem',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>View Rooms <ArrowRight size={12}/></button>
            </div>
        </div>
    </div>);
};

const HotelPage=()=>{
    const { bookingCards } = useAdminConfig();
    const [city,setCity]=useState('');const [checkIn,setCheckIn]=useState('');const [checkOut,setCheckOut]=useState('');const [guests,setGuests]=useState(2);const [stars,setStars]=useState('');const [maxPrice,setMaxPrice]=useState('');
    const [results,setResults]=useState([]);const [searched,setSearched]=useState(false);const [loading,setLoading]=useState(false);const [resultMsg,setResultMsg]=useState('');const [selectedHotel,setSelectedHotel]=useState(null);const [sortBy,setSortBy]=useState('rating');const resultsRef=useRef();
    
    const liveHotels = bookingCards.filter(c => c.type === 'hotel' && c.status === 'active');
    const liveCities = [...new Set(liveHotels.map(c => [c.destination, c.source]).flat())].filter(Boolean);

    useEffect(()=>{
        if(!searched) setResults(liveHotels);
    },[bookingCards,searched]);

    const handleSearch=()=>{
        setLoading(true);
        setTimeout(()=>{
            const r = liveHotels.filter(h => {
                if (city && (h.destination||'').toLowerCase() !== city.toLowerCase() && (h.source||'').toLowerCase() !== city.toLowerCase()) return false;
                if (stars && Math.floor(Number(h.features?.stars)||4) < parseInt(stars)) return false;
                if (maxPrice && (Number(h.price)||0) > parseInt(maxPrice)) return false;
                return true;
            });
            setResults(r);setSearched(true);setLoading(false);
            setResultMsg(`Found ${r.length} hotel${r.length!==1?'s':''}`);
        },300);
    };

    const sorted = [...results].sort((a, b) => {
        if (sortBy === 'rating') return (Number(b.features?.rating) || 4.5) - (Number(a.features?.rating) || 4.5);
        if (sortBy === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0);
        return (Number(b.features?.stars) || 4) - (Number(a.features?.stars) || 4);
    });

    return(<div style={{position:'relative',minHeight:'100vh',background:'#0d0a05',fontFamily:"'Outfit',sans-serif",color:'#fff',paddingBottom:60}}>
        <div style={{position:'relative',padding:'80px 20px 40px',background:'linear-gradient(rgba(28, 15, 0, 0.85), rgba(28, 15, 0, 0.85)), url("/images/hotel.png")',backgroundSize:'cover',backgroundPosition:'center',borderBottom:`1px solid rgba(245,158,11,0.15)`,overflow:'hidden'}}>
            <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><Hotel size={28} color={ACC}/><span style={{fontSize:'0.8rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:2}}>Hotel Booking</span></div>
                <h1 style={{fontSize:'3rem',fontWeight:900,marginBottom:8,lineHeight:1.1}}>Find Your Perfect <span style={{background:`linear-gradient(135deg,${ACC},#d97706)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Stay</span></h1>
            </div>
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            <div style={{background:'rgba(30,18,0,0.95)',backdropFilter:'blur(20px)',border:`1px solid rgba(245,158,11,0.2)`,borderRadius:20,padding:'22px 26px',marginTop:-24,marginBottom:28,boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr auto',gap:11,alignItems:'end'}}>
                    <div><CityDrop value={city} onChange={setCity} placeholder="Select City" availableCities={liveCities} /></div>
                    <div><ModernDatePicker value={checkIn} onChange={setCheckIn} placeholder="Check-In" accentColor={ACC} /></div>
                    <div><ModernDatePicker value={checkOut} onChange={setCheckOut} placeholder="Check-Out" accentColor={ACC} /></div>
                    <button onClick={handleSearch} disabled={loading} style={{background:`linear-gradient(135deg,${ACC},#d97706)`,color:'#000',border:'none',borderRadius:11,padding:'11px 22px',fontWeight:800,fontSize:'0.92rem',cursor:'pointer'}}>Search</button>
                </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}}>
                {sorted.map(h => <HotelCard key={h._id} hotel={h} onClick={()=>setSelectedHotel(h)} />)}
            </div>
            <Offers type="hotel" />
        </div>
        {selectedHotel&&<HotelModal hotel={selectedHotel} onClose={()=>setSelectedHotel(null)}/>}
    </div>);
};
export default HotelPage;
