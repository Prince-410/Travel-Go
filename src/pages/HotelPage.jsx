import React,{useState,useEffect,useRef,useMemo} from 'react';
import {Hotel,MapPin,Calendar,Users,Star,ChevronDown,ArrowRight,X,CheckCircle2,Shield,Gift,Zap} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import { useUI } from '../context/UIContext';
import PaymentModal from '../components/PaymentModal';
import { getDefaultHotels } from '../utils/hotelData';

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
    const { showConfirm } = useUI();
    const [tab,setTab]=useState('rooms');
    const [bookingRoom,setBookingRoom]=useState(null);
    const hotelStars = hotel.features?.starRating || 4;
    const hotelReviews = Array.isArray(hotel.features?.reviews) ? hotel.features.reviews : [];
    const avgRating = (hotelReviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / Math.max(hotelReviews.length, 1)).toFixed(1);
    const roomsFromFeatures = Array.isArray(hotel.features?.rooms) ? hotel.features.rooms : null;
    const fallbackRooms = [
        { type: 'Standard Room', pricePerNight: hotel.price, availableRooms: hotel.availableSeats || 0, features: ['Free WiFi','TV'], icon: '🛏️' }
    ];
    // If the backend sends `rooms: []`, the normal `|| fallback` would not kick in.
    const hotelRooms = roomsFromFeatures && roomsFromFeatures.length > 0 ? roomsFromFeatures : fallbackRooms;

    // If user switches hotels while the modal is open, make sure we
    // always land on the rooms tab (and close any booking flow).
    useEffect(() => {
        setTab('rooms');
        setBookingRoom(null);
    }, [hotel?._id]);

    return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(10px)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,overflowY:'auto'}}>
        <div style={{background:'linear-gradient(135deg,#1c1108,#1a1200)',border:`1px solid rgba(245,158,11,0.25)`,borderRadius:24,width:'100%',maxWidth:860,boxShadow:'0 30px 60px rgba(0,0,0,0.7)',overflow:'hidden'}}>
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
                {tab==='rooms'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
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
                            <button onClick={()=>setBookingRoom(rm)} style={{background:`linear-gradient(135deg,${ACC},#d97706)`,color:'#000',border:'none',borderRadius:8,padding:'7px 12px',fontWeight:800,fontSize:'0.75rem',cursor:'pointer'}}>Book</button>
                        </div>
                    </div>
                    );
                    })}
                </div>}

                {bookingRoom && (
                   showConfirm('Booking Initialized', `Your request for a ${bookingRoom.type} at ${hotel.title} has been logged. Our concierge will contact you shortly to confirm your check-in on ${hotel.features?.checkIn || 'the requested date'}.`, () => setBookingRoom(null), 'alert') || setBookingRoom(null)
                )}
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
        </div>
    </div>);
};

const HotelCard=({hotel,onClick})=>{
    const hotelStars = Math.max(0, Math.floor(Number(hotel.features?.starRating) || 4));
    const roomsFromFeatures = Array.isArray(hotel.features?.rooms) ? hotel.features.rooms : null;
    const hotelRooms = roomsFromFeatures && roomsFromFeatures.length > 0 ? roomsFromFeatures : [{ availableRooms: hotel.availableSeats || 0 }];
    const minRoomsList = hotelRooms.map(r => Number(r.availableRooms) || 0);
    const minRooms = minRoomsList.length > 0 ? Math.min(...minRoomsList) : (Number(hotel.availableSeats) || 0);
    const urgent = minRooms <= 2;
    const amenities = Array.isArray(hotel.features?.amenities) ? hotel.features.amenities : ['Pool', 'Spa', 'WiFi'];
    const hotelPrice = Number(hotel.price) || 0;
    const hotelTitle = hotel.title || 'Unknown Hotel';
    const hotelDest = hotel.destination || 'Unknown Location';
    return(<div onClick={onClick} style={{background:'linear-gradient(135deg,#1c1108,#1a1200)',border:`1px solid rgba(245,158,11,0.12)`,borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'transform .25s,box-shadow .25s',boxShadow:'0 4px 24px rgba(0,0,0,0.35)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(245,158,11,0.3)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.35)'}}>
        <div style={{height:130,background:`linear-gradient(135deg,rgba(245,158,11,0.08),rgba(30,20,0,0.9))`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem',position:'relative'}}>
            🏨
            {urgent&&<span style={{position:'absolute',top:8,right:8,background:'rgba(248,113,113,0.2)',color:'#f87171',fontSize:'0.62rem',fontWeight:800,padding:'2px 8px',borderRadius:20}}>⚡ Only {minRooms} rooms left</span>}
            <div style={{position:'absolute',top:8,left:8,display:'flex',gap:2}}>{'★'.repeat(Math.floor(hotelStars)).split('').map((s,i)=><span key={i} style={{color:ACC,fontSize:'0.75rem'}}>{s}</span>)}</div>
        </div>
        <div style={{padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <div>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{fontWeight:800,fontSize:'0.95rem'}}>{hotelTitle}</div>
                        {hotel.dynamicPricing&&<span style={{background:'rgba(248,113,113,0.1)',color:'#f87171',fontSize:'0.55rem',fontWeight:800,padding:'2px 6px',borderRadius:20,border:'1px solid rgba(248,113,113,0.25)'}}><Zap size={8} style={{display:'inline'}}/> Surge</span>}
                    </div>
                    <div style={{fontSize:'0.72rem',color:'#64748b',marginTop:1}}>📍 {hotelDest}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:3,background:`rgba(245,158,11,0.12)`,borderRadius:7,padding:'3px 9px',fontWeight:800,color:ACC,fontSize:'0.8rem',flexShrink:0}}><Star size={11} fill="currentColor"/>{hotel.features?.rating||4.5}</div>
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
                {amenities && Array.isArray(amenities) && amenities.slice(0,3).map(a=><span key={a} style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:'2px 8px',fontSize:'0.64rem',color:'#94a3b8'}}>{a}</span>)}
                {amenities && Array.isArray(amenities) && amenities.length>3&&<span style={{fontSize:'0.64rem',color:'#64748b'}}>+{amenities.length-3}</span>}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:10}}>
                <div><div style={{fontSize:'0.65rem',color:'#64748b'}}>from</div><div style={{fontSize:'1.4rem',fontWeight:900,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{hotelPrice.toLocaleString('en-IN')}</div><div style={{fontSize:'0.65rem',color:'#64748b'}}>per night</div></div>
                <button
                    type="button"
                    onClick={(e) => {
                        // Keep wrapper click consistent, but ensure the modal opens
                        // even if event bubbling is affected by layout/CSS.
                        e.stopPropagation();
                        onClick?.();
                    }}
                    style={{background:`linear-gradient(135deg,${ACC},#d97706)`,color:'#000',border:'none',borderRadius:9,padding:'8px 14px',fontWeight:800,fontSize:'0.8rem',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}
                >
                    View Rooms <ArrowRight size={12}/>
                </button>
            </div>
        </div>
    </div>);
};

const HotelPage=()=>{
    const { bookingCards } = useAdminConfig(); // Live inventory
    const [city,setCity]=useState('');const [checkIn,setCheckIn]=useState('');const [checkOut,setCheckOut]=useState('');const [guests,setGuests]=useState(2);const [stars,setStars]=useState('');const [maxPrice,setMaxPrice]=useState('');
    const [results,setResults]=useState([]);const [searched,setSearched]=useState(false);const [loading,setLoading]=useState(false);const [resultMsg,setResultMsg]=useState('');const [selectedHotel,setSelectedHotel]=useState(null);const [sortBy,setSortBy]=useState('rating');const resultsRef=useRef();
    
    const fallbackHotelCards = useMemo(() => {
        const defaults = getDefaultHotels();
        return defaults.map((h) => {
            const rooms = Array.isArray(h.rooms) ? h.rooms : [];
            const prices = rooms.map(r => Number(r.pricePerNight) || 0).filter(Boolean);
            const availableRoomCounts = rooms.map(r => Number(r.availableRooms) || 0).filter(r => r > 0);
            const totalSeats = rooms.reduce((a, r) => a + (Number(r.totalRooms) || 0), 0);
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const minAvailableRooms = availableRoomCounts.length ? Math.min(...availableRoomCounts) : 0;

            return {
                _id: h._id,
                type: 'hotel',
                status: 'active',
                title: h.name,
                source: h.city,
                destination: h.city,
                date: '',
                startTime: '',
                arrivalTime: '',
                price: minPrice,
                totalSeats,
                availableSeats: minAvailableRooms,
                dynamicPricing: true,
                lockedSeats: [],
                features: {
                    starRating: h.starRating,
                    rating: h.rating,
                    reviews: Array.isArray(h.reviews) ? h.reviews : [],
                    amenities: Array.isArray(h.amenities) ? h.amenities : [],
                    rooms,
                    address: h.address,
                    checkIn: h.checkIn,
                    checkOut: h.checkOut,
                },
            };
        });
    }, []);

    // Dynamically derive live data (fallback to sample hotels if backend inventory is missing)
    const liveHotelsFromCards = bookingCards.filter(c => c.type === 'hotel' && c.status === 'active');
    const usingFallbackHotels = liveHotelsFromCards.length === 0;
    const liveHotels = usingFallbackHotels ? fallbackHotelCards : liveHotelsFromCards;
    const liveCities = [...new Set(liveHotels.map(c => [c.destination, c.source]).flat())].filter(Boolean);

    useEffect(()=>{
        if(!searched){
            setResults(liveHotels);
            setResultMsg(usingFallbackHotels ? `Showing ${liveHotels.length} sample hotels (backend not connected)` : `Showing ${liveHotels.length} dynamic hotels from live inventory`);
        }
    },[bookingCards,searched]);

    const handleSearch=()=>{
        setLoading(true);
        setTimeout(()=>{
            const r = liveHotels.filter(h => {
                const hDest = (h.destination || '').toLowerCase();
                const hSource = (h.source || '').toLowerCase();
                const qCity = (city || '').toLowerCase();
                if (city && hDest !== qCity && hSource !== qCity) return false;
                if (stars && stars !== '') {
                    const hStars = Math.floor(Number(h.features?.starRating) || 4);
                    if (hStars < parseInt(stars)) return false;
                }
                if (maxPrice && maxPrice !== '') {
                    if ((Number(h.price) || 0) > parseInt(maxPrice)) return false;
                }
                return true;
            });
            setResults(r);setSearched(true);setLoading(false);
            setResultMsg(`Found ${r.length} hotel${r.length!==1?'s':''}`);
            setTimeout(()=>resultsRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100);
        },300);
    };
    const sorted = [...results].sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === 'rating') return (Number(b.features?.rating) || 4.5) - (Number(a.features?.rating) || 4.5);
        if (sortBy === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0);
        return (Number(b.features?.starRating) || 4) - (Number(a.features?.starRating) || 4);
    });
    return(<div style={{minHeight:'100vh',background:'transparent',fontFamily:"'Outfit',sans-serif",color:'#fff',paddingBottom:60}}>
        <div style={{position:'relative',padding:'80px 20px 40px',background:'rgba(28, 15, 0, 0.5)',borderBottom:`1px solid rgba(245,158,11,0.15)`,overflow:'hidden'}}>
            <div style={{position:'absolute',top:-80,left:'25%',width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><Hotel size={28} color={ACC}/><span style={{fontSize:'0.8rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:2}}>Hotel Booking</span></div>
                <h1 style={{fontSize:'3rem',fontWeight:900,marginBottom:8,lineHeight:1.1}}>Find Your Perfect <span style={{background:`linear-gradient(135deg,${ACC},#d97706)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Stay</span></h1>
                <p style={{color:'#94a3b8',fontSize:'1.05rem'}}>10 cities · Room types · Reviews · Map · Price comparison</p>
            </div>
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            <div style={{background:'rgba(30,18,0,0.95)',backdropFilter:'blur(20px)',border:`1px solid rgba(245,158,11,0.2)`,borderRadius:20,padding:'22px 26px',marginTop:-24,marginBottom:28,boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
                <div style={{display:'flex',gap:7,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
                    <span style={{fontSize:'0.72rem',color:'#64748b',fontWeight:700}}>STARS:</span>
                    {['','2','3','4','5'].map(s=><button key={s} onClick={()=>setStars(s)} style={{padding:'5px 12px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.76rem',background:stars===s?`linear-gradient(135deg,${ACC},#d97706)`:'rgba(255,255,255,0.05)',color:stars===s?'#000':'#94a3b8'}}>{s===''?'All':s+'★+'}</button>)}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr auto',gap:11,alignItems:'end'}}>
                    <div><label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>City</label><CityDrop value={city} onChange={setCity} placeholder="Select City" availableCities={liveCities} /></div>
                    <div style={{ zIndex: 100 }}><label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Check-In</label><ModernDatePicker value={checkIn} onChange={setCheckIn} placeholder="Check-In" accentColor={ACC} /></div>
                    <div style={{ zIndex: 90 }}><label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Check-Out</label><ModernDatePicker value={checkOut} onChange={setCheckOut} placeholder="Check-Out" accentColor={ACC} /></div>
                    <div><label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Guests</label><div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'9px 11px'}}><Users size={13} color={ACC}/><input type="number" min={1} max={10} value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{width:28,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.85rem',fontWeight:600}}/></div></div>
                    <div><label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Max ₹/Night</label><div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'9px 11px'}}><span style={{color:'#64748b',fontSize:'0.82rem'}}>₹</span><input type="number" placeholder="Any" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} style={{flex:1,background:'transparent',border:'none',outline:'none',color:maxPrice?'#fff':'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}/></div></div>
                    <button onClick={handleSearch} disabled={loading} style={{background:`linear-gradient(135deg,${ACC},#d97706)`,color:'#000',border:'none',borderRadius:11,padding:'11px 22px',fontWeight:800,fontSize:'0.92rem',cursor:'pointer',display:'flex',alignItems:'center',gap:7,whiteSpace:'nowrap',boxShadow:'0 8px 25px rgba(245,158,11,0.35)'}}>{loading?'⏳…':<><Hotel size={14}/>Search</>}</button>
                </div>
            </div>
            <div ref={resultsRef} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
                <div><h2 style={{fontSize:'1.4rem',fontWeight:800,margin:0}}>{searched?'Hotels Found':'Popular Hotels'}</h2>{resultMsg&&<p style={{color:ACC,fontSize:'0.82rem',margin:'4px 0 0',fontWeight:600}}>{resultMsg}</p>}</div>
                <div style={{display:'flex',gap:8}}>{[{id:'rating',l:'Top Rated'},{id:'price',l:'Cheapest'},{id:'stars',l:'Stars'}].map(s=><button key={s.id} onClick={()=>setSortBy(s.id)} style={{padding:'6px 13px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.76rem',background:sortBy===s.id?`rgba(245,158,11,0.15)`:'rgba(255,255,255,0.05)',color:sortBy===s.id?ACC:'#94a3b8',outline:sortBy===s.id?`1px solid rgba(245,158,11,0.4)`:'none'}}>{s.l}</button>)}</div>
            </div>
            {loading ? (
                <div style={{textAlign:'center',padding:'80px 0'}}>
                    <div style={{fontSize:'3rem',marginBottom:16}}>🏨</div>
                    <p style={{color:ACC,fontWeight:700}}>Searching hotels…</p>
                </div>
            ) : sorted.length === 0 ? (
                <div style={{textAlign:'center',padding:'80px 0'}}>
                    <p style={{fontWeight:700,fontSize:'1.2rem'}}>{searched ? 'No hotels found' : 'No hotels in live inventory yet'}</p>
                    <p style={{color:'#64748b'}}>{searched ? 'Try different filters.' : 'Admin inventory might still be loading.'}</p>
                </div>
            ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}}>
                    {sorted.map((h, i) => h && (
                        <HotelCard
                            key={h._id || i}
                            hotel={h}
                            onClick={() => setSelectedHotel(h)}
                        />
                    ))}
                </div>
            )}

            {/* Offers */}
            <Offers type="hotel" />

            {/* Trust Badges */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:14,marginTop:48}}>
                {[{icon:<Shield size={19} color={ACC}/>,t:'Secure Stay',d:'Verified properties'},{icon:<CheckCircle2 size={19} color={'#4ade80'}/>,t:'Best Price',d:'Price match guarantee'},{icon:<Star size={19} color={'#fbbf24'}/>,t:'Rated 4.5+',d:'Top guest reviews'},{icon:<Gift size={19} color={'#f472b6'}/>,t:'Free Extras',d:'Breakfast & WiFi'}].map((b,i)=>(<div key={i} style={{background:'rgba(15,23,42,0.85)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}><div style={{flexShrink:0}}>{b.icon}</div><div><div style={{fontWeight:700,fontSize:'0.88rem'}}>{b.t}</div><div style={{fontSize:'0.73rem',color:'#64748b',marginTop:2}}>{b.d}</div></div></div>))}
            </div>
        </div>
        {selectedHotel&&<HotelModal hotel={selectedHotel} onClose={()=>setSelectedHotel(null)}/>}
    </div>);
};
export default HotelPage;
