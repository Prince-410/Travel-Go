import React,{useState} from 'react';
import {Plane,Hotel,MapPin,Clock,Star,ArrowRight,X,Zap,ChevronDown,CheckCircle2,Gift,Shield,Navigation, Sparkles} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useAuth } from '../context/AuthContext';
import Offers from '../components/Offers';
import { useUI } from '../context/UIContext';
import BookingReceipt from '../components/BookingReceipt';

const ACC='#f472b6';
const TYPES=['all','Beach','Adventure','City Tour','Honeymoon','Nature','Hills'];

const ItineraryModal=({pkg,onClose,setCurrentBooking})=>{
    const { addLocalBooking, authFetch, user } = useAuth();
    const { showToast } = useUI();
    const [bookingLoading, setBookingLoading] = useState(false);
    const tips=pkg.features?.aiTips || ['Pack light clothing','Carry local currency'];
    const itinerary = pkg.features?.itinerary || ['Arrival & Check-in','Local sightseeing','Departure'];
    const inclusions = pkg.features?.inclusions || ['Flights','Hotels'];
    const exclusions = pkg.features?.exclusions || ['Personal expenses'];
    const hotelsList = pkg.features?.hotels || ['Standard Hotel'];
    const flightsList = pkg.features?.flights || ['Economy Class'];
    const activitiesList = pkg.features?.activities || ['Sightseeing'];
    const startDatesList = pkg.features?.startDates || ['Coming soon'];

    const handleConfirmHolidayBooking = async () => {
        if (bookingLoading) return;
        setBookingLoading(true);
        const bookingData = {
            userId: user?._id,
            type: 'holiday',
            amount: pkg.price,
            status: 'confirmed',
            paymentStatus: 'completed',
            details: {
                cardId: pkg._id,
                holidayId: pkg._id,
                source: 'TravelGo HQ',
                destination: pkg.destination,
                date: startDatesList[0] || new Date().toLocaleDateString(),
                duration: pkg.features?.duration,
                meals: pkg.features?.meals
            }
        };

        try {
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
            onClose();
            setCurrentBooking(finalBooking);
            showToast('Holiday package booked!', 'success');
        } catch (err) {
            console.error('Holiday booking failed:', err);
            showToast(err.message || 'Failed to book holiday', 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    return(<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,overflowY:'auto',borderRadius:'inherit'}}>
        <div style={{background:'linear-gradient(135deg,#1a0a18,#0d0a1a)',border:`1px solid rgba(244,114,182,0.25)`,borderRadius:24,width:'100%',maxWidth:820,boxShadow:'0 30px 60px rgba(0,0,0,0.7)',overflow:'hidden'}}>
            {/* Header */}
            <div style={{padding:'24px 28px',background:'linear-gradient(135deg,rgba(244,114,182,0.08),rgba(30,10,30,0.95))',borderBottom:`1px solid rgba(244,114,182,0.12)`,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                    <div style={{fontSize:'2.5rem',marginBottom:6}}>{pkg.features?.image || '🌴'}</div>
                    <h2 style={{margin:0,fontWeight:900,fontSize:'1.5rem'}}>{pkg.title}</h2>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginTop:6,flexWrap:'wrap'}}>
                        <span style={{background:`rgba(244,114,182,0.15)`,color:ACC,fontSize:'0.75rem',fontWeight:700,padding:'3px 10px',borderRadius:20}}>{pkg.features?.holidayType || 'Holiday'}</span>
                        <span style={{color:'#64748b',fontSize:'0.82rem'}}>📍 {pkg.destination}</span>
                        <span style={{color:'#64748b',fontSize:'0.82rem'}}>⏱️ {pkg.features?.duration || '3N/4D'}</span>
                        <div style={{display:'flex',alignItems:'center',gap:3,color:'#fbbf24',fontWeight:800,fontSize:'0.82rem'}}><Star size={11} fill="currentColor"/>{pkg.features?.rating || 4.5}</div>
                    </div>
                </div>
                <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:8,padding:8,cursor:'pointer',color:'#94a3b8'}}><X size={18}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
                {/* Left: itinerary + inclusions */}
                <div style={{padding:'22px 24px',borderRight:`1px solid rgba(255,255,255,0.06)`,maxHeight:440,overflowY:'auto'}}>
                    <h3 style={{margin:'0 0 14px',fontSize:'0.95rem',color:ACC,fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>📅 Day-by-Day Itinerary</h3>
                    {itinerary.map((day,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:14}}>
                        <div style={{flexShrink:0,width:26,height:26,borderRadius:'50%',background:`rgba(244,114,182,0.15)`,border:`1px solid rgba(244,114,182,0.3)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:800,color:ACC}}>{i+1}</div>
                        <div style={{flex:1,fontSize:'0.82rem',color:'#cbd5e1',paddingTop:4,borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:10}}>{day}</div>
                    </div>)}
                    <h3 style={{margin:'14px 0 10px',fontSize:'0.95rem',color:'#4ade80',fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>✅ Inclusions</h3>
                    {inclusions.map(inc=><div key={inc} style={{display:'flex',alignItems:'center',gap:6,marginBottom:6,fontSize:'0.8rem',color:'#94a3b8'}}><CheckCircle2 size={13} color="#4ade80"/>{inc}</div>)}
                    <h3 style={{margin:'14px 0 10px',fontSize:'0.95rem',color:'#f87171',fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>❌ Exclusions</h3>
                    {exclusions.map(exc=><div key={exc} style={{display:'flex',alignItems:'center',gap:6,marginBottom:6,fontSize:'0.8rem',color:'#94a3b8'}}><X size={11} color="#f87171"/>{exc}</div>)}
                </div>
                {/* Right: hotels, flights, AI tips, book */}
                <div style={{padding:'22px 24px',maxHeight:440,overflowY:'auto'}}>
                    <h3 style={{margin:'0 0 12px',fontSize:'0.95rem',color:'#fbbf24',fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>🏨 Included Hotels</h3>
                    {hotelsList.map(h=><div key={h} style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.15)',borderRadius:10,padding:'10px 14px',marginBottom:8,fontSize:'0.82rem',display:'flex',alignItems:'center',gap:7}}><Hotel size={13} color="#fbbf24"/>{h}</div>)}
                    <h3 style={{margin:'14px 0 12px',fontSize:'0.95rem',color:'#818cf8',fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>✈️ Included Flights</h3>
                    {flightsList.map(f=><div key={f} style={{background:'rgba(129,140,248,0.06)',border:'1px solid rgba(129,140,248,0.15)',borderRadius:10,padding:'10px 14px',marginBottom:8,fontSize:'0.82rem',display:'flex',alignItems:'center',gap:7}}><Plane size={13} color="#818cf8"/>{f}</div>)}
                    <h3 style={{margin:'14px 0 12px',fontSize:'0.95rem',color:ACC,fontWeight:800,textTransform:'uppercase',letterSpacing:1}}>🎯 Activities</h3>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                        {activitiesList.map(a=><span key={a} style={{background:`rgba(244,114,182,0.08)`,border:`1px solid rgba(244,114,182,0.2)`,borderRadius:20,padding:'4px 10px',fontSize:'0.72rem',color:'#e2e8f0'}}>{a}</span>)}
                    </div>
                    <div style={{background:'rgba(129,140,248,0.07)',border:'1px solid rgba(129,140,248,0.2)',borderRadius:12,padding:'14px 16px',marginBottom:18}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:9}}><Zap size={14} color="#818cf8"/><span style={{fontWeight:800,fontSize:'0.8rem',color:'#818cf8',textTransform:'uppercase',letterSpacing:1}}>AI Travel Tips</span></div>
                        {tips.map((tip,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:7,marginBottom:6,fontSize:'0.78rem',color:'#94a3b8'}}><span style={{color:'#818cf8',flexShrink:0}}>💡</span>{tip}</div>)}
                    </div>
                    {/* Book */}
                    <div style={{background:`rgba(244,114,182,0.08)`,border:`1px solid rgba(244,114,182,0.2)`,borderRadius:14,padding:'16px 18px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}><div><div style={{fontSize:'0.7rem',color:'#64748b'}}>Package Price</div><div style={{fontSize:'1.8rem',fontWeight:900,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{pkg.price.toLocaleString('en-IN')}</div><div style={{fontSize:'0.7rem',color:'#64748b'}}>per person · {(pkg.features?.meals||'Breakfast Included')}</div></div></div>
                        <div style={{fontSize:'0.72rem',color:'#64748b',marginBottom:12}}>Next start dates: {startDatesList.slice(0,3).join(' · ')}</div>
                        <button 
                          onClick={() => {
                            if (startDatesList[0] === 'Coming soon') {
                               showToast('Registration for this package is coming soon! We will notify you once dates are announced.', 'info');
                            } else {
                               handleConfirmHolidayBooking();
                            }
                          }} 
                          style={{width:'100%',background:`linear-gradient(135deg,${ACC},#ec4899)`,color:'#fff',border:'none',borderRadius:11,padding:'12px',fontWeight:800,fontSize:'0.95rem',cursor:'pointer',boxShadow:`0 8px 25px rgba(244,114,182,0.35)`,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}
                        >
                          {startDatesList[0] === 'Coming soon' ? 'Notify Me' : (bookingLoading ? 'Booking...' : 'Book This Package')} <ArrowRight size={15}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

// Compare modal
const CompareModal=({packages,onClose})=>(
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,overflowY:'auto',borderRadius:'inherit'}}>
        <div style={{background:'linear-gradient(135deg,#1a0a18,#0d0a1a)',border:`1px solid rgba(244,114,182,0.25)`,borderRadius:24,width:'100%',maxWidth:860,boxShadow:'0 30px 60px rgba(0,0,0,0.7)',overflow:'hidden'}}>
            <div style={{padding:'22px 28px',borderBottom:`1px solid rgba(244,114,182,0.12)`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:900,fontSize:'1.2rem'}}>Package Comparison</span>
                <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:8,padding:8,cursor:'pointer',color:'#94a3b8'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 28px',overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr>
                        <th style={{textAlign:'left',padding:'10px 12px',fontSize:'0.75rem',color:'#64748b',fontWeight:700}}>Feature</th>
                        {packages.map(p=><th key={p._id} style={{textAlign:'center',padding:'10px 12px',fontSize:'0.78rem',color:ACC,fontWeight:800}}>{p.features?.image||'🌴'} {p.title}</th>)}
                    </tr></thead>
                    <tbody>
                        {[['Destination',p=>p.destination],['Duration',p=>p.features?.duration||'N/A'],['Type',p=>p.features?.holidayType||'Holiday'],['Price',p=>`₹${p.price.toLocaleString('en-IN')}`],['Rating',p=>`⭐ ${p.features?.rating||4.5}`],['Meals',p=>p.features?.meals||'Breakfast'],['Hotels',p=>(p.features?.hotels?.length||1)+' hotels'],['Activities',p=>(p.features?.activities?.length||3)+' activities']].map(([label,fn])=>(
                            <tr key={label} style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                                <td style={{padding:'10px 12px',fontSize:'0.8rem',color:'#64748b',fontWeight:700}}>{label}</td>
                                {packages.map(p=><td key={p._id} style={{padding:'10px 12px',textAlign:'center',fontSize:'0.82rem',color:'#e2e8f0',fontWeight:600}}>{fn(p)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const PkgCard=({pkg,onView,onCompare,comparing})=>{
    const activities = pkg.features?.activities || ['Sightseeing','Transfers'];
    return (<div style={{background:'linear-gradient(135deg,#1a0a18,#10091a)',border:`1px solid ${comparing?`rgba(244,114,182,0.4)`:'rgba(244,114,182,0.12)'}`,borderRadius:20,overflow:'hidden',transition:'transform .25s,box-shadow .25s',boxShadow:comparing?`0 0 0 2px ${ACC},0 8px 30px rgba(0,0,0,0.4)`:'0 4px 24px rgba(0,0,0,0.35)'}} onMouseEnter={e=>{if(!comparing){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(244,114,182,0.3)'}}} onMouseLeave={e=>{if(!comparing){e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.35)'}}}>
        {/* Banner */}
        <div style={{height:150,background:`linear-gradient(135deg,rgba(244,114,182,0.1),rgba(20,10,25,0.95))`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,position:'relative'}}>
            <div style={{fontSize:'3.5rem'}}>{pkg.features?.image || '🌴'}</div>
            <div style={{position:'absolute',top:10,left:12,background:`rgba(244,114,182,0.15)`,border:`1px solid rgba(244,114,182,0.3)`,borderRadius:20,padding:'3px 10px',fontSize:'0.65rem',color:ACC,fontWeight:800}}>{pkg.features?.holidayType || 'Holiday'}</div>
            <div style={{position:'absolute',top:10,right:12,display:'flex',alignItems:'center',gap:4,background:'rgba(251,191,36,0.15)',borderRadius:20,padding:'3px 10px',fontSize:'0.7rem',color:'#fbbf24',fontWeight:800}}><Star size={10} fill="currentColor"/>{pkg.features?.rating||4.5}</div>
        </div>
        <div style={{padding:'18px 20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
                <h3 style={{margin:'0 0 4px',fontSize:'1.05rem',fontWeight:800}}>{pkg.title}</h3>
                {pkg.dynamicPricing&&<span style={{background:'rgba(248,113,113,0.1)',color:'#f87171',fontSize:'0.55rem',fontWeight:800,padding:'2px 6px',borderRadius:20,border:'1px solid rgba(248,113,113,0.25)'}}><Zap size={8} style={{display:'inline'}}/> Trending</span>}
            </div>
            <div style={{display:'flex',gap:12,marginBottom:10,fontSize:'0.75rem',color:'#64748b'}}><span>📍 {pkg.destination}</span><span>⏱️ {pkg.features?.duration||'4 Days'}</span></div>
            <p style={{fontSize:'0.8rem',color:'#94a3b8',marginBottom:12,lineHeight:1.5}}>{pkg.features?.desc||'A beautiful customized holiday package.'}</p>
            {/* Activities preview */}
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                {activities.slice(0,3).map(a=><span key={a} style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:'3px 9px',fontSize:'0.65rem',color:'#94a3b8'}}>{a}</span>)}
                {activities.length>3&&<span style={{fontSize:'0.65rem',color:'#64748b'}}>+{activities.length-3}</span>}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:14}}>
                <div><div style={{fontSize:'0.68rem',color:'#64748b'}}>per person</div><div style={{fontSize:'1.6rem',fontWeight:900,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{pkg.price.toLocaleString('en-IN')}</div></div>
                <div style={{display:'flex',gap:7}}>
                    <button onClick={()=>onCompare(pkg)} style={{background:comparing?`rgba(244,114,182,0.2)`:'rgba(255,255,255,0.05)',border:`1px solid ${comparing?ACC:'rgba(255,255,255,0.1)'}`,borderRadius:9,padding:'8px 12px',color:comparing?ACC:'#64748b',fontWeight:700,fontSize:'0.75rem',cursor:'pointer'}}>Compare</button>
                    <button onClick={()=>onView(pkg)} style={{background:`linear-gradient(135deg,${ACC},#ec4899)`,color:'#fff',border:'none',borderRadius:9,padding:'8px 14px',fontWeight:800,fontSize:'0.8rem',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>View <ArrowRight size={12}/></button>
                </div>
            </div>
        </div>
    </div>);
};

const HolidayPage=()=>{
    const { bookingCards } = useAdminConfig();
    const { showConfirm, showToast } = useUI();
    const liveHolidays = bookingCards.filter(c=>c.type==='holiday'&&c.status==='active');

    const [typeFilter,setTypeFilter]=useState('all');const [maxPrice,setMaxPrice]=useState('');const [dest,setDest]=useState('');
    const [selectedPkg,setSelectedPkg]=useState(null);const [selectedPackages,setComparing]=useState([]);const [showCompare,setShowCompare]=useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);

    const results=liveHolidays.filter(p=>{
        if(dest&&!p.destination.toLowerCase().includes(dest.toLowerCase()))return false;
        if(typeFilter!=='all'&&p.features?.holidayType!==typeFilter)return false;
        if(maxPrice&&p.price>Number(maxPrice))return false;
        return true;
    });

    const toggleCompare=(pkg)=>{
        setComparing(prev=>prev.find(p=>p._id===pkg._id)?prev.filter(p=>p._id!==pkg._id):[...prev.slice(-1),pkg]);
    };

    return(<div style={{position:'relative',minHeight:'100vh',background:'transparent',fontFamily:"'Outfit',sans-serif",color:'#fff',paddingBottom:60}}>
        {/* Hero */}
        <div style={{position:'relative',padding:'80px 20px 50px',background:'rgba(26, 10, 24, 0.5)',borderBottom:`1px solid rgba(244,114,182,0.15)`,overflow:'hidden'}}>
            <div style={{position:'absolute',top:-80,left:'20%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(244,114,182,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',top:-60,right:'10%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{maxWidth:1200,margin:'0 auto',position:'relative',textAlign:'center'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:12}}><span style={{fontSize:'1.5rem'}}>🌴</span><span style={{fontSize:'0.8rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:2}}>Holiday Packages</span></div>
                <h1 style={{fontSize:'3.2rem',fontWeight:900,marginBottom:12,lineHeight:1.1}}>Your Dream <span style={{background:`linear-gradient(135deg,${ACC},#ec4899)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Holiday</span> Awaits</h1>
                <p style={{color:'#94a3b8',fontSize:'1.05rem',maxWidth:600,margin:'0 auto 28px'}}>Curated packages with flights, hotels & activities · AI travel tips · Compare packages side-by-side</p>
                {/* Quick search */}
                <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:8}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.07)',border:`1px solid rgba(244,114,182,0.2)`,borderRadius:12,padding:'10px 16px'}}>
                        <MapPin size={14} color={ACC}/>
                        <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="Search destination (e.g. Goa, Dubai...)" style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',width:240}}/>
                    </div>
                </div>
            </div>
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            {/* Filters */}
            <div style={{display:'flex',gap:12,marginBottom:28,overflowX:'auto',padding:'10px 0',scrollbarWidth:'none'}}>
                {TYPES.map(t=><button key={t} onClick={()=>setTypeFilter(t)} style={{padding:'8px 18px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.82rem',background:typeFilter===t?`linear-gradient(135deg,${ACC},#ec4899)`:'rgba(255,255,255,0.06)',color:typeFilter===t?'#fff':'#94a3b8',boxShadow:typeFilter===t?`0 4px 14px rgba(244,114,182,0.35)`:'none'}}>{t==='all'?'🌍 All':t}</button>)}
            </div>
            {/* Compare bar */}
            {selectedPackages.length>0&&<div style={{background:`rgba(244,114,182,0.07)`,border:`1px solid rgba(244,114,182,0.25)`,borderRadius:14,padding:'14px 20px',marginBottom:20,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:'0.85rem',color:ACC}}>Comparing {selectedPackages.length}/2 packages:</span>
                {selectedPackages.map(p=><span key={p._id} style={{background:`rgba(244,114,182,0.12)`,borderRadius:20,padding:'5px 12px',fontWeight:700,fontSize:'0.8rem'}}>{p.features?.image||'🌴'} {p.title}</span>)}
                <button onClick={()=>setShowCompare(true)} disabled={selectedPackages.length<2} style={{marginLeft:'auto',background:selectedPackages.length>=2?`linear-gradient(135deg,${ACC},#ec4899)`:'rgba(255,255,255,0.07)',color:selectedPackages.length>=2?'#fff':'#64748b',border:'none',borderRadius:9,padding:'8px 18px',fontWeight:800,fontSize:'0.82rem',cursor:selectedPackages.length>=2?'pointer':'not-allowed'}}>Compare Now</button>
                <button onClick={()=>setComparing([])} style={{background:'rgba(255,255,255,0.06)',border:'none',borderRadius:8,padding:'7px 12px',color:'#64748b',cursor:'pointer',fontWeight:700,fontSize:'0.78rem'}}>Clear</button>
            </div>}
            {/* Result count */}
            <div style={{marginBottom:18}}><h2 style={{fontSize:'1.4rem',fontWeight:800,margin:0}}>{dest?`Results for "${dest}"`:'Popular Packages'}</h2><p style={{color:ACC,fontSize:'0.82rem',margin:'4px 0 0',fontWeight:600}}>{results.length} unique experiences found</p></div>
            {/* Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:22, marginBottom: 40}}>
                {results.map(p=><PkgCard key={p._id} pkg={p} onView={setSelectedPkg} onCompare={toggleCompare} comparing={!!selectedPackages.find(c=>c._id===p._id)}/>)}
            </div>
            {results.length===0&&<div style={{textAlign:'center',padding:'80px 0'}}><div style={{fontSize:'3rem',marginBottom:16}}>🌍</div><p style={{fontWeight:700,fontSize:'1.2rem'}}>No packages found</p><p style={{color:'#64748b'}}>Try a different destination or budget.</p></div>}

            {/* Offers */}
            <Offers type="holiday" />

            {/* Trust */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,marginTop:48}}>
                {[{icon:<Shield size={19} color={ACC}/>,t:'Safe Holidays',d:'Bonded tour operators'},{icon:<Navigation size={19} color={'#4ade80'}/>,t:'Full Support',d:'24/7 travel assistance'},{icon:<Zap size={19} color={'#fbbf24'}/>,t:'Instant Booking',d:'Confirmed itineraries'},{icon:<Star size={19} color={'#f472b6'}/>,t:'Top Rated',d:'Handpicked experiences'}].map((b,i)=>(<div key={i} style={{background:'rgba(15,23,42,0.85)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}><div style={{flexShrink:0}}>{b.icon}</div><div><div style={{fontWeight:700,fontSize:'0.88rem'}}>{b.t}</div><div style={{fontSize:'0.73rem',color:'#64748b',marginTop:2}}>{b.d}</div></div></div>))}
            </div>
        </div>
            {selectedPkg && <ItineraryModal pkg={selectedPkg} onClose={()=>setSelectedPkg(null)} setCurrentBooking={setCurrentBooking} />}
            {showCompare && <CompareModal packages={selectedPackages} onClose={()=>setShowCompare(false)} />}
            {currentBooking && (
                <BookingReceipt 
                    booking={currentBooking} 
                    onClose={() => setCurrentBooking(null)} 
                />
            )}
    </div>);
};
export default HolidayPage;
