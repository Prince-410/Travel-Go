import React,{useState,useEffect} from 'react';
import {Car,MapPin,Clock,Star,ArrowRight,X,Navigation,Zap,Shield,ChevronDown} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import Offers from '../components/Offers';
import { useUI } from '../context/UIContext';

const CAB_TYPES=[{id:'local',label:'Local',desc:'Within city',icon:'🚕'},{id:'outstation',label:'Outstation',desc:'Inter-city trips',icon:'🛣️'},{id:'hourly',label:'Hourly Rental',desc:'Keep cab for hours',icon:'⏱️'}];
const VEHICLE_TYPES=[{type:'Go Mini',icon:'🚗'},{type:'Go Sedan',icon:'🚙'},{type:'Go SUV',icon:'🚐'}];

const ACC='#a78bfa';

// Live tracking modal
const TrackModal=({cab,onClose})=>{
    const [pos,setPos]=useState(20);
    useEffect(()=>{const t=setInterval(()=>setPos(p=>Math.min(p+2,95)),600);return()=>clearInterval(t)},[]);
    return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.87)',backdropFilter:'blur(8px)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:'linear-gradient(135deg,#0d0a1a,#120d24)',border:`1px solid rgba(167,139,250,0.25)`,borderRadius:24,width:'100%',maxWidth:520,padding:28,boxShadow:'0 30px 60px rgba(0,0,0,0.6)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:9,height:9,borderRadius:'50%',background:ACC,boxShadow:`0 0 8px ${ACC}`,animation:'pulse 1.5s infinite'}}/><span style={{fontWeight:800,fontSize:'1.1rem'}}>Driver is on the way</span></div>
                <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:8,padding:7,cursor:'pointer',color:'#94a3b8'}}><X size={17}/></button>
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
            <div style={{background:'rgba(167,139,250,0.07)',border:`1px solid rgba(167,139,250,0.18)`,borderRadius:14,padding:'14px 18px',marginBottom:20}}>
                <div style={{fontWeight:800}}>{cab.features?.vehicleType||'Go Mini'} {cab.features?.icon||'🚗'} — {cab.features?.operator||'City Taxi'}</div>
                <div style={{color:'#64748b',fontSize:'0.8rem',marginTop:4}}>Driver: {cab.features?.driver||'Ramesh'} · ⭐ {cab.features?.driverRating||4.8}</div>
            </div>
            {/* Progress */}
            <div style={{marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'#64748b',marginBottom:8}}>
                    <span>🚗 Driver location</span><span>📍 Your pickup</span>
                </div>
                <div style={{position:'relative',height:8,background:'rgba(255,255,255,0.08)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pos}%`,background:`linear-gradient(90deg,${ACC},#7c3aed)`,borderRadius:4,transition:'width .6s'}}/>
                    <div style={{position:'absolute',top:'50%',left:`${pos}%`,transform:'translate(-50%,-50%)',fontSize:'0.9rem',transition:'left .6s'}}>🚗</div>
                </div>
                <div style={{textAlign:'center',marginTop:8,fontSize:'0.8rem',color:ACC,fontWeight:700}}>ETA: ~{Math.max(1,Math.round((cab.features?.eta||5)*(1-pos/100)))} mins away</div>
            </div>
            {/* Map stub */}
            <div style={{background:'rgba(255,255,255,0.03)',borderRadius:14,height:148,position:'relative',overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div style={{position:'absolute',inset:0,opacity:0.05}}>{Array.from({length:10},(_,i)=><div key={i} style={{position:'absolute',left:`${i*11}%`,top:0,bottom:0,width:1,background:'#fff'}}/>)}{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',top:`${i*15}%`,left:0,right:0,height:1,background:'#fff'}}/>)}</div>
                <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 400 148">
                    <path d="M40,120 C120,60 260,90 360,30" stroke={ACC} strokeWidth="2.5" strokeDasharray="6,3" fill="none" opacity="0.5"/>
                    <circle cx={40+(360-40)*pos/100} cy={120-(90)*pos/100} r="8" fill={ACC}/>
                    <circle cx="40" cy="120" r="5" fill={ACC}/>
                    <circle cx="360" cy="30" r="7" fill="#4ade80"/>
                    <text x="35" y="140" fill="#818cf8" fontSize="10">Driver</text>
                    <text x="340" y="25" fill="#4ade80" fontSize="10">You</text>
                </svg>
                <div style={{position:'absolute',bottom:8,right:12,fontSize:'0.68rem',color:ACC,display:'flex',alignItems:'center',gap:4}}><div style={{width:6,height:6,borderRadius:'50%',background:ACC,animation:'pulse 1.5s infinite'}}/>LIVE</div>
            </div>
        </div>
    </div>);
};

// Cab Card
const CabCard=({cab,onTrack,onBook})=>{
    return(<div style={{background:'linear-gradient(135deg,#0d0a1a,#1a1133)',border:`1px solid rgba(167,139,250,0.12)`,borderRadius:16,transition:'transform .25s,box-shadow .25s',boxShadow:'0 4px 24px rgba(0,0,0,0.35)',overflow:'hidden'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(167,139,250,0.3)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.35)'}}>
        {cab.dynamicPricing&&<div style={{background:'rgba(251,191,36,0.08)',borderBottom:'1px solid rgba(251,191,36,0.15)',padding:'6px 16px',fontSize:'0.67rem',color:'#fbbf24',fontWeight:800,display:'flex',alignItems:'center',gap:5}}><Zap size={10}/>Surge pricing active</div>}
        <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            {/* Vehicle */}
            <div style={{fontSize:'2.5rem'}}>{cab.features?.icon||'🚕'}</div>
            <div style={{flex:1,minWidth:130}}>
                <div style={{fontWeight:800,fontSize:'1rem'}}>{cab.features?.vehicleType||'Go City'}</div>
                <div style={{fontSize:'0.75rem',color:ACC,marginTop:2}}>{cab.features?.operator||'TravelGo Fleet'}</div>
                <div style={{display:'flex',alignItems:'center',gap:3,marginTop:4}}><Star size={11} color="#fbbf24" fill="#fbbf24"/><span style={{fontSize:'0.75rem',fontWeight:700,color:'#fbbf24'}}>{cab.features?.driverRating||4.8}</span><span style={{fontSize:'0.7rem',color:'#64748b',marginLeft:4}}>Driver: {cab.features?.driver||'Assigning...'}</span></div>
            </div>
            {/* Details */}
            <div style={{display:'flex',gap:20}}>
                <div style={{textAlign:'center'}}><div style={{fontSize:'0.65rem',color:'#64748b',fontWeight:600,marginBottom:2}}>ETA</div><div style={{fontWeight:800,color:'#fff'}}>{cab.features?.eta||5} min</div></div>
                <div style={{textAlign:'center'}}><div style={{fontSize:'0.65rem',color:'#64748b',fontWeight:600,marginBottom:2}}>CAPACITY</div><div style={{fontWeight:800,color:'#fff'}}>👥 {cab.availableSeats||4}</div></div>
                <div style={{textAlign:'center'}}><div style={{fontSize:'0.65rem',color:'#64748b',fontWeight:600,marginBottom:2}}>AC</div><div style={{fontWeight:800,color:(cab.features?.acAvailable??true)?'#4ade80':'#64748b'}}>{(cab.features?.acAvailable??true)?'Yes':'No'}</div></div>
            </div>
            {/* Features */}
            <div style={{flex:1,minWidth:130}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                    {(cab.features?.features||['Sanitized','Top Rated']).map(f=><span key={f} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'2px 8px',fontSize:'0.65rem',color:'#94a3b8'}}>{f}</span>)}
                </div>
            </div>
            {/* Price & book */}
            <div style={{textAlign:'right',minWidth:140}}>
                <div style={{fontSize:'0.65rem',color:'#64748b'}}>ESTIMATED FARE</div>
                <div style={{fontSize:'1.8rem',fontWeight:900,lineHeight:1.1,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{cab.price.toLocaleString('en-IN')}</div>
                <div style={{fontSize:'0.68rem',color:'#64748b',marginBottom:10}}>{cab.features?.estimatedTime||'~'} · {cab.features?.distanceKm||'~'} km</div>
                <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                    <button onClick={()=>onTrack(cab)} style={{background:`rgba(167,139,250,0.1)`,border:`1px solid rgba(167,139,250,0.25)`,borderRadius:9,padding:'8px 12px',color:ACC,fontWeight:700,fontSize:'0.78rem',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}><Navigation size={13}/>Track</button>
                    <button onClick={()=>onBook(cab)} style={{background:`linear-gradient(135deg,${ACC},#7c3aed)`,color:'#fff',border:'none',borderRadius:9,padding:'8px 14px',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',display:'flex',alignItems:'center',gap:5,boxShadow:`0 4px 15px rgba(167,139,250,0.3)`}}>Book <ArrowRight size={13}/></button>
                </div>
            </div>
        </div>
    </div>);
};

const CabPage=()=>{
    const { bookingCards } = useAdminConfig();
    const { showConfirm } = useUI();

    const [source,setSource]=useState('Ahmedabad');const [destination,setDestination]=useState('');const [cabType,setCabType]=useState('local');const [vehicleType,setVehicleType]=useState('');
    const [date,setDate]=useState('');const [hours,setHours]=useState(4);const [distKm,setDistKm]=useState(10);
    const [results,setResults]=useState([]);const [loading,setLoading]=useState(false);const [resultMsg,setResultMsg]=useState('');const [trackingCab,setTrackingCab]=useState(null);

    const liveCabs=bookingCards.filter(c=>c.type==='cab'&&c.status==='active');
    const liveCities=[...new Set(liveCabs.map(c=>[c.source,c.destination]).flat())].filter(Boolean);
    if(liveCities.length===0) liveCities.push('Ahmedabad');

    useEffect(()=>{
        setResults(liveCabs);
        setResultMsg(`${liveCabs.length} cabs available globally`);
    },[bookingCards]);

    const handleSearch=()=>{
        setLoading(true);
        setTimeout(()=>{
            const r=liveCabs.filter(c=>{
                if(source&&c.source.toLowerCase()!==source.toLowerCase())return false;
                if(cabType==='outstation'&&destination&&c.destination.toLowerCase()!==destination.toLowerCase())return false;
                if(vehicleType&&c.features?.vehicleType!==vehicleType)return false;
                return true;
            });
            setResults(r);setLoading(false);setResultMsg(`${r.length} dynamic cabs available in ${source}`);
        },400);
    };

    return(<div style={{minHeight:'100vh',background:'transparent',fontFamily:"'Outfit',sans-serif",color:'#fff',paddingBottom:60}}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        {/* Hero */}
        <div style={{position:'relative',padding:'80px 20px 40px',background:'rgba(13, 10, 26, 0.5)',borderBottom:`1px solid rgba(167,139,250,0.15)`,overflow:'hidden'}}>
            <div style={{position:'absolute',top:-80,left:'25%',width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><Car size={28} color={ACC}/><span style={{fontSize:'0.8rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:2}}>Cab Booking</span></div>
                <h1 style={{fontSize:'3rem',fontWeight:900,marginBottom:8,lineHeight:1.1}}>Ride in <span style={{background:`linear-gradient(135deg,${ACC},#7c3aed)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Comfort</span></h1>
                <p style={{color:'#94a3b8',fontSize:'1.05rem'}}>Airport transfer · Outstation · Local · Hourly rental · Live driver tracking</p>
            </div>
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            {/* Trip type tabs */}
            <div style={{marginTop:-20,marginBottom:24,display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',position:'relative',zIndex:10}}>
                {CAB_TYPES.map(t=><button key={t.id} onClick={()=>setCabType(t.id)} style={{padding:'12px 20px',borderRadius:14,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.85rem',background:cabType===t.id?`linear-gradient(135deg,${ACC},#7c3aed)`:'rgba(255,255,255,0.07)',color:cabType===t.id?'#fff':'#94a3b8',boxShadow:cabType===t.id?`0 6px 20px rgba(167,139,250,0.35)`:'none',transition:'all .2s'}}>
                    <div style={{fontSize:'1.2rem',marginBottom:3}}>{t.icon}</div>
                    <div>{t.label}</div>
                    <div style={{fontSize:'0.65rem',opacity:0.7,marginTop:2}}>{t.desc}</div>
                </button>)}
            </div>
            {/* Search Card */}
            <div style={{background:'rgba(13,10,26,0.97)',backdropFilter:'blur(20px)',border:`1px solid rgba(167,139,250,0.2)`,borderRadius:20,padding:'22px 26px',marginBottom:28,boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
                <div style={{display:'grid',gridTemplateColumns:`1fr 1fr${cabType==='outstation'?' 1fr':''} ${cabType==='hourly'?'1fr':''} auto`,gap:11,alignItems:'end'}}>
                    <div>
                        <label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Pickup City</label>
                        <div style={{background:'rgba(255,255,255,0.05)',border:`1px solid rgba(167,139,250,0.2)`,borderRadius:9,padding:'10px 13px'}}>
                            <select value={source} onChange={e=>setSource(e.target.value)} style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',fontWeight:600}}>
                                {liveCities.map(c=><option key={c} value={c} style={{background:'#1e293b'}}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    {cabType==='outstation'&&<div>
                        <label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Drop City</label>
                        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'10px 13px'}}>
                            <select value={destination} onChange={e=>setDestination(e.target.value)} style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',fontWeight:600}}>
                                <option value="" style={{background:'#1e293b'}}>Select city</option>
                                {liveCities.filter(c=>c!==source).map(c=><option key={c} value={c} style={{background:'#1e293b'}}>{c}</option>)}
                            </select>
                        </div>
                    </div>}
                    <div>
                        <label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Vehicle Type</label>
                        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'10px 13px'}}>
                            <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',fontWeight:600}}>
                                <option value="" style={{background:'#1e293b'}}>All Vehicles</option>
                                {VEHICLE_TYPES.map(v=><option key={v.type} value={v.type} style={{background:'#1e293b'}}>{v.icon} {v.type}</option>)}
                            </select>
                        </div>
                    </div>
                    {cabType==='hourly'?<div>
                        <label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Hours</label>
                        <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'10px 13px'}}><Clock size={13} color={ACC}/><input type="number" min={4} max={24} value={hours} onChange={e=>setHours(e.target.value)} style={{width:35,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',fontWeight:600}}/><span style={{color:'#64748b',fontSize:'0.8rem'}}>hrs</span></div>
                    </div>:<div>
                        <label style={{fontSize:'0.68rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:5}}>Distance (km)</label>
                        <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,padding:'10px 13px'}}><MapPin size={13} color={ACC}/><input type="number" min={1} value={distKm} onChange={e=>setDistKm(e.target.value)} style={{width:40,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem',fontWeight:600}}/><span style={{color:'#64748b',fontSize:'0.8rem'}}>km</span></div>
                    </div>}
                    <button onClick={handleSearch} disabled={loading} style={{background:`linear-gradient(135deg,${ACC},#7c3aed)`,color:'#fff',border:'none',borderRadius:11,padding:'11px 22px',fontWeight:800,fontSize:'0.92rem',cursor:'pointer',display:'flex',alignItems:'center',gap:7,whiteSpace:'nowrap',boxShadow:'0 8px 25px rgba(167,139,250,0.35)'}}>{loading?'⏳…':<><Car size={14}/>Find Cabs</>}</button>
                </div>
            </div>
            {/* Results */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
                <div><h2 style={{fontSize:'1.4rem',fontWeight:800,margin:0}}>Available Cabs</h2>{resultMsg&&<p style={{color:ACC,fontSize:'0.82rem',margin:'4px 0 0',fontWeight:600}}>{resultMsg}</p>}</div>
            </div>
            {loading?<div style={{textAlign:'center',padding:'80px 0'}}><div style={{fontSize:'3rem',marginBottom:16}}>🚗</div><p style={{color:ACC,fontWeight:700}}>Finding cabs near you…</p></div>:
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
                {results.map(c=><CabCard key={c._id} cab={c} onTrack={setTrackingCab} onBook={(cab)=>showConfirm('Confirm Ride', `Booking ${cab.features?.vehicleType || 'Cab'} with ${cab.features?.operator || 'fleet'}\nEstimated Fare: ₹${cab.price}\nDriver Assignment: ${cab.features?.driver || 'Will be assigned in 2 mins'}`, null, 'alert')}/>)}
            </div>}
            {/* Offers */}
            <Offers type="cab" />

            {/* Trust */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(165px,1fr))',gap:12,marginTop:44}}>
                {[{icon:<Shield size={18} color={ACC}/>,t:'OTP Verified Drivers',d:'Safety first'},{icon:<Navigation size={18} color={'#4ade80'}/>,t:'Live Tracking',d:'Real-time location'},{icon:<Zap size={18} color={'#fbbf24'}/>,t:'Quick Pickup',d:'Avg. 5 min ETA'},{icon:<Star size={18} color={'#f472b6'}/>,t:'Rated Drivers',d:'4.5+ average rating'}].map((b,i)=><div key={i} style={{background:'rgba(15,23,42,0.85)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:13,padding:'14px 16px',display:'flex',alignItems:'center',gap:11}}><div style={{flexShrink:0}}>{b.icon}</div><div><div style={{fontWeight:700,fontSize:'0.85rem'}}>{b.t}</div><div style={{fontSize:'0.7rem',color:'#64748b',marginTop:1}}>{b.d}</div></div></div>)}
            </div>
        </div>
        {trackingCab&&<TrackModal cab={trackingCab} onClose={()=>setTrackingCab(null)}/>}
    </div>);
};
export default CabPage;
