import React,{useState,useEffect,useRef} from 'react';
import {Train,MapPin,Calendar,Users,ChevronDown,Star,ArrowRight,X,Search,Clock,Wifi,AlertCircle,CheckCircle2,Shield,Gift} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAdminConfig } from '../context/AdminConfigContext';
import Offers from '../components/Offers';
import ModernDatePicker from '../components/ModernDatePicker';
import PaymentModal from '../components/PaymentModal';

const CLASSES = [
    { code: '1A', icon: '💎', name: 'First AC' },
    { code: '2A', icon: '❄️', name: 'Second AC' },
    { code: '3A', icon: '🧊', name: 'Third AC' },
    { code: 'SL', icon: '🛏️', name: 'Sleeper' },
    { code: 'CC', icon: '💺', name: 'Chair Car' }
];

const ACC='#818cf8';

const StationDrop=({value,onChange,placeholder,exclude,availableStations})=>{
    const [open,setOpen]=useState(false);const [q,setQ]=useState('');const ref=useRef();
    useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
    const list=availableStations.filter(c=>c!==exclude&&c.toLowerCase().includes(q.toLowerCase()));
    return(<div ref={ref} style={{position:'relative'}}>
        <div onClick={()=>setOpen(!open)} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',background:'rgba(255,255,255,0.05)',border:`1px solid ${open?ACC:'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'10px 14px',transition:'border-color .2s'}}>
            <MapPin size={15} color={ACC}/><span style={{flex:1,fontSize:'0.95rem',color:value?'#fff':'rgba(255,255,255,0.4)',fontWeight:value?600:400}}>{value||placeholder}</span>
            <ChevronDown size={13} color={ACC} style={{transform:open?'rotate(180deg)':'none',transition:'transform .2s'}}/>
        </div>
        {open&&(<div style={{position:'absolute',top:'calc(100% + 6px)',left:0,right:0,zIndex:300,background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,boxShadow:'0 20px 40px rgba(0,0,0,0.4)',overflow:'hidden'}}>
            <div style={{padding:'8px 10px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search station..." style={{width:'100%',background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'0.9rem'}}/>
            </div>
            {list.map(c=>(<div key={c} onClick={()=>{onChange(c);setOpen(false);setQ('')}} style={{padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(129,140,248,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <Train size={12} color={ACC}/><span style={{fontWeight:600}}>{c}</span>
            </div>))}
        </div>)}
    </div>);
};

// PNR Status Modal
const PNRModal=({onClose})=>{
    const [pnr,setPnr]=useState('');const [result,setResult]=useState(null);const [err,setErr]=useState('');
    const check=()=>{
        if(pnr.length<5){setErr('Enter a valid PNR');return;}
        setErr('');
        // mock: generate fake status
        const statuses=['Confirmed','Waitlist WL/4','RAC/2'];
        setResult({pnr,status:statuses[Math.floor(Math.random()*statuses.length)],train:'Shatabdi Express #12009',from:'Ahmedabad',to:'Mumbai',date:new Date().toISOString().split('T')[0],classType:'Second AC (2A)',coach:'B3',seat:'42 Lower'});
    };
    return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:'linear-gradient(135deg,#0c0b1d,#1a1833)',border:`1px solid rgba(129,140,248,0.25)`,borderRadius:24,width:'100%',maxWidth:480,padding:32,boxShadow:'0 30px 60px rgba(0,0,0,0.6)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}><Search size={20} color={ACC}/><span style={{fontWeight:800,fontSize:'1.1rem'}}>PNR Status</span></div>
                <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:8,padding:8,cursor:'pointer',color:'#94a3b8'}}><X size={18}/></button>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:20}}>
                <input value={pnr} onChange={e=>setPnr(e.target.value)} placeholder="Enter 10-digit PNR number" style={{flex:1,background:'rgba(255,255,255,0.06)',border:`1px solid rgba(129,140,248,0.3)`,borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:'0.95rem',outline:'none'}}/>
                <button onClick={check} style={{background:`linear-gradient(135deg,${ACC},#6366f1)`,color:'#fff',border:'none',borderRadius:10,padding:'11px 20px',fontWeight:800,cursor:'pointer'}}>Check</button>
            </div>
            {err&&<p style={{color:'#f87171',fontSize:'0.82rem',marginBottom:12}}>{err}</p>}
            {result&&(<div style={{background:'rgba(129,140,248,0.07)',border:`1px solid rgba(129,140,248,0.2)`,borderRadius:14,padding:20}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                    <span style={{fontWeight:700,fontSize:'0.8rem',color:'#64748b'}}>PNR: {result.pnr}</span>
                    <span style={{background:result.status.startsWith('C')?'rgba(74,222,128,0.15)':'rgba(251,191,36,0.15)',color:result.status.startsWith('C')?'#4ade80':'#fbbf24',fontSize:'0.78rem',fontWeight:800,padding:'3px 10px',borderRadius:20,border:`1px solid ${result.status.startsWith('C')?'rgba(74,222,128,0.3)':'rgba(251,191,36,0.3)'}`}}>{result.status}</span>
                </div>
                {[['Train',result.train],['From',result.from],['To',result.to],['Date',result.date],['Class',result.classType],['Coach/Seat',`${result.coach} — Seat ${result.seat}`]].map(([k,v])=>(
                    <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                        <span style={{fontSize:'0.8rem',color:'#64748b'}}>{k}</span><span style={{fontSize:'0.85rem',fontWeight:600}}>{v}</span>
                    </div>
                ))}
            </div>)}
        </div>
    </div>);
};

// Train Card
const TrainCard=({train,selectedClass,onBook})=>{
    const dClasses = train.features?.classes || [
        { code: '3A', name: 'Third AC', price: train.price, availableSeats: train.availableSeats, waitlist: 0, icon: '🧊' },
        { code: 'SL', name: 'Sleeper', price: Math.floor(train.price * 0.4), availableSeats: Math.floor(train.availableSeats * 2), waitlist: 5, icon: '🛏️' }
    ];
    const cls=dClasses.find(c=>c.code===selectedClass)||dClasses[0];
    const [exp,setExp]=useState(false);
    const urgency=cls.availableSeats<10;
    
    const tName = train.title.split('-')[0] || train.title;
    const tNum = train.features?.trainNumber || train._id.substring(0,5).toUpperCase();

    return(<div style={{background:'linear-gradient(135deg,#0c0b1d,#1a1833)',border:`1px solid rgba(129,140,248,0.12)`,borderRadius:16,overflow:'hidden',transition:'transform .25s,box-shadow .25s',boxShadow:'0 4px 24px rgba(0,0,0,0.35)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(129,140,248,0.25)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.35)'}}>
        {/* Header */}
        <div style={{padding:'12px 20px 0',display:'flex',gap:8,flexWrap:'wrap'}}>
            {train.dynamicPricing && <span style={{background:'rgba(248,113,113,0.1)',color:'#f87171',fontSize:'0.62rem',fontWeight:800,padding:'3px 10px',borderRadius:20,border:'1px solid rgba(248,113,113,0.25)'}}>⚡ Premium Tatkal Live</span>}
            <span style={{background:'rgba(129,140,248,0.1)',color:ACC,fontSize:'0.62rem',fontWeight:800,padding:'3px 10px',borderRadius:20,border:`1px solid rgba(129,140,248,0.25)`,display:'flex',alignItems:'center',gap:4}}><Wifi size={9}/>WiFi</span>
            {urgency&&<span style={{background:'rgba(248,113,113,0.1)',color:'#f87171',fontSize:'0.62rem',fontWeight:800,padding:'3px 10px',borderRadius:20,border:'1px solid rgba(248,113,113,0.25)'}}>⚡ Filling Fast</span>}
        </div>
        {/* Main */}
        <div style={{padding:'12px 20px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div style={{minWidth:170}}>
                <div style={{fontWeight:900,color:'#fff',fontSize:'0.95rem'}}>{tName}</div>
                <div style={{fontSize:'0.72rem',color:ACC,marginTop:2}}>#{tNum} · {train.features?.trainType || 'Superfast Exps'}</div>
                <div style={{fontSize:'0.7rem',color:'#64748b',marginTop:4}}>{train.features?.distance || '560 km'} · {train.features?.runsOn?.join(', ')||'Daily'}</div>
            </div>
            <div style={{textAlign:'center'}}>
                <div style={{fontSize:'1.7rem',fontWeight:900,lineHeight:1}}>{train.startTime || train.departureTime || train.time || '10:00 AM'}</div>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:3}}>{train.source}</div>
                <div style={{fontSize:'0.68rem',color:ACC,marginTop:2}}>Pf: {train.features?.platform || '1'}</div>
            </div>
            <div style={{flex:1,minWidth:90,textAlign:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:4}}><div style={{flex:1,height:1.5,background:`linear-gradient(90deg,${ACC},rgba(129,140,248,0.2))`}}/><Train size={13} color={ACC}/><div style={{flex:1,height:1.5,background:`linear-gradient(90deg,rgba(129,140,248,0.2),${ACC})`}}/></div>
                <div style={{marginTop:5,fontSize:'0.78rem',fontWeight:700,color:ACC}}>{train.features?.duration || '8h 00m'}</div>
            </div>
            <div style={{textAlign:'center'}}>
                <div style={{fontSize:'1.7rem',fontWeight:900,lineHeight:1}}>{train.arrivalTime || '06:00 PM'}</div>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:3}}>{train.destination}</div>
            </div>
            <div style={{flex:1,minWidth:100}}>
                <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
                    <div style={{background:'rgba(129,140,248,0.12)',borderRadius:6,padding:'3px 8px',display:'flex',alignItems:'center',gap:4,fontSize:'0.8rem',fontWeight:800,color:ACC}}><Star size={11} fill="currentColor"/>{train.features?.rating || 4.2}</div>
                </div>
                <div style={{fontSize:'0.72rem',color:urgency?'#f87171':'#64748b',fontWeight:urgency?700:400}}>{cls.availableSeats} seats · {cls.waitlist>0?`WL ${cls.waitlist}`:'Available'}</div>
            </div>
            <div style={{textAlign:'right',minWidth:140}}>
                <div style={{fontSize:'0.68rem',color:'#64748b'}}>{cls.icon} {cls.name}</div>
                <div style={{fontSize:'1.8rem',fontWeight:900,lineHeight:1.1,background:`linear-gradient(135deg,#fff 30%,${ACC})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>₹{cls.price.toLocaleString('en-IN')}</div>
                <div style={{fontSize:'0.68rem',color:'#64748b',marginBottom:8}}>per person</div>
                <button onClick={()=>onBook(train,cls)} style={{background:`linear-gradient(135deg,${ACC},#6366f1)`,color:'#fff',border:'none',borderRadius:10,padding:'9px 18px',fontWeight:800,fontSize:'0.85rem',cursor:'pointer',display:'flex',alignItems:'center',gap:6,marginLeft:'auto',transition:'all .2s',boxShadow:'0 4px 15px rgba(99,102,241,0.35)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none'}}>Book Now <ArrowRight size={14}/></button>
            </div>
        </div>
        {/* Class availability expand */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
            <button onClick={()=>setExp(!exp)} style={{width:'100%',background:'none',border:'none',color:ACC,cursor:'pointer',padding:'9px 0',fontSize:'0.75rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                    {exp?'Hide':'View'} all class availability <ChevronDown size={13} style={{transform:exp?'rotate(180deg)':'none',transition:'transform .2s'}}/>
            </button>
            {exp&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(80px, 1fr))',gap:8,padding:'0 20px 16px'}}>
                {dClasses.map(c=>(<div key={c.code} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c.code===selectedClass?`rgba(129,140,248,0.4)`:'rgba(255,255,255,0.08)'}`,borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                    <div style={{fontSize:'1rem',marginBottom:3}}>{c.icon}</div>
                    <div style={{fontSize:'0.68rem',color:ACC,fontWeight:800}}>{c.code}</div>
                    <div style={{fontSize:'0.7rem',color:'#94a3b8',marginTop:2}}>{c.name}</div>
                    <div style={{fontSize:'0.9rem',fontWeight:800,color:'#fff',marginTop:4}}>₹{c.price.toLocaleString('en-IN')}</div>
                    <div style={{fontSize:'0.65rem',color:c.availableSeats<10?'#f87171':'#64748b',marginTop:3}}>{c.availableSeats} avail</div>
                </div>))}
            </div>}
        </div>
    </div>);
};

const TrainPage=()=>{
    const { bookingCards } = useAdminConfig(); // Live Data

    const [from,setFrom]=useState('');const [to,setTo]=useState('');const [date,setDate]=useState('');const [classCode,setClassCode]=useState('');
    const [results,setResults]=useState([]);const [searched,setSearched]=useState(false);const [loading,setLoading]=useState(false);const [resultMsg,setResultMsg]=useState('');
    const [showPNR,setShowPNR]=useState(false);const [sortBy,setSortBy]=useState('departure');const resultsRef=useRef();
    const { showConfirm } = useUI();
    const [bookingTrain,setBookingTrain]=useState(null);
    
    // Live derived logic
    const liveTrains=bookingCards.filter(c=>c.type==='train'&&c.status==='active');
    const liveStations=[...new Set(liveTrains.map(c=>[c.source,c.destination]).flat())].filter(Boolean);

    useEffect(()=>{
        if(!searched){
            setResults(liveTrains);
            setResultMsg(`Showing ${liveTrains.length} dynamic trains from live inventory`);
        }
    },[bookingCards,searched]);

    const handleSearch=()=>{
        setLoading(true);
        setTimeout(()=>{
            const r=liveTrains.filter(c=>{
                if(from&&c.source.toLowerCase()!==from.toLowerCase())return false;
                if(to&&c.destination.toLowerCase()!==to.toLowerCase())return false;
                if(date&&c.date!==date)return false;
                return true;
            });
            setResults(r);setSearched(true);setLoading(false);
            setResultMsg(`Found ${r.length} live train${r.length!==1?'s':''}`);
            setTimeout(()=>resultsRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100)
        },300);
    };
    const sorted=[...results].sort((a,b)=>{
        const aT=a.startTime||a.departureTime||a.time||'10:00'; const bT=b.startTime||b.departureTime||b.time||'10:00';
        if(sortBy==='departure')return aT.localeCompare(bT);
        if(sortBy==='price')return a.price-b.price;
        if(sortBy==='duration')return (a.features?.duration||'').localeCompare(b.features?.duration||'');
        return 0;
    });
    const swap=()=>{const t=from;setFrom(to);setTo(t);};
    return(<div style={{minHeight:'100vh',background:'transparent',fontFamily:"'Outfit',sans-serif",color:'#fff',paddingBottom:60}}>
        {/* Hero */}
        <div style={{position:'relative',padding:'80px 20px 40px',background:'rgba(12, 11, 29, 0.5)',borderBottom:`1px solid rgba(129,140,248,0.15)`,overflow:'hidden'}}>
            <div style={{position:'absolute',top:-80,left:'25%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                    <div>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><Train size={28} color={ACC}/><span style={{fontSize:'0.8rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:2}}>Train Booking</span></div>
                        <h1 style={{fontSize:'3rem',fontWeight:900,marginBottom:8,lineHeight:1.1}}>Book Trains <span style={{background:`linear-gradient(135deg,${ACC},#6366f1)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Seamlessly</span></h1>
                        <p style={{color:'#94a3b8',fontSize:'1.05rem'}}>Indian Railways simulation · PNR tracking · Platform info · 5 classes</p>
                    </div>
                    <button onClick={()=>setShowPNR(true)} style={{background:`linear-gradient(135deg,${ACC},#6366f1)`,color:'#fff',border:'none',borderRadius:12,padding:'12px 24px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 25px rgba(99,102,241,0.35)'}}>
                        <Search size={16}/>Check PNR Status
                    </button>
                </div>
            </div>
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            {/* Search Card */}
            <div style={{background:'rgba(20,20,40,0.95)',backdropFilter:'blur(20px)',border:`1px solid rgba(129,140,248,0.2)`,borderRadius:20,padding:'24px 28px',marginTop:-24,marginBottom:28,boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
                {/* Class quick filter */}
                <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
                    <button onClick={()=>setClassCode('')} style={{padding:'6px 14px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.78rem',background:classCode===''?`linear-gradient(135deg,${ACC},#6366f1)`:'rgba(255,255,255,0.05)',color:classCode===''?'#fff':'#94a3b8'}}>All Classes</button>
                    {CLASSES.map(c=>(<button key={c.code} onClick={()=>setClassCode(c.code)} style={{padding:'6px 14px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.78rem',background:classCode===c.code?`linear-gradient(135deg,${ACC},#6366f1)`:'rgba(255,255,255,0.05)',color:classCode===c.code?'#fff':'#94a3b8'}}>{c.icon} {c.code}</button>))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr 1fr auto',gap:12,alignItems:'end'}}>
                    <div><label style={{fontSize:'0.7rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:6}}>From Station</label><StationDrop value={from} onChange={setFrom} placeholder="Departure Station" exclude={to} availableStations={liveStations} /></div>
                    <button onClick={swap} style={{background:`rgba(129,140,248,0.1)`,border:`1px solid rgba(129,140,248,0.25)`,borderRadius:'50%',width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',marginBottom:2}}><ArrowRight size={16} color={ACC}/></button>
                    <div><label style={{fontSize:'0.7rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:6}}>To Station</label><StationDrop value={to} onChange={setTo} placeholder="Destination Station" exclude={from} availableStations={liveStations} /></div>
                    <div style={{ zIndex: 100 }}><label style={{fontSize:'0.7rem',color:ACC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:6}}>Date</label>
                        <ModernDatePicker value={date} onChange={setDate} placeholder="Select Date" accentColor={ACC} />
                    </div>
                    <button onClick={handleSearch} disabled={loading} style={{background:`linear-gradient(135deg,${ACC},#6366f1)`,color:'#fff',border:'none',borderRadius:12,padding:'12px 28px',fontWeight:800,fontSize:'1rem',cursor:'pointer',boxShadow:'0 8px 25px rgba(99,102,241,0.35)',transition:'all .2s',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                        {loading?'⏳ Searching…':<><Train size={16}/>Search Trains</>}
                    </button>
                </div>
            </div>
            {/* Results */}
            <div ref={resultsRef} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
                <div><h2 style={{fontSize:'1.4rem',fontWeight:800,margin:0}}>{searched?'Available Trains':'Today\'s Trains'}</h2>{resultMsg&&<p style={{color:ACC,fontSize:'0.82rem',margin:'4px 0 0',fontWeight:600}}>{resultMsg}</p>}</div>
                {results.length>0&&<div style={{display:'flex',gap:8}}>
                    {[{id:'departure',l:'Earliest'},{id:'price',l:'Cheapest'},{id:'duration',l:'Fastest'}].map(s=>(<button key={s.id} onClick={()=>setSortBy(s.id)} style={{padding:'6px 14px',borderRadius:50,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.78rem',background:sortBy===s.id?`rgba(129,140,248,0.15)`:'rgba(255,255,255,0.05)',color:sortBy===s.id?ACC:'#94a3b8',outline:sortBy===s.id?`1px solid rgba(129,140,248,0.4)`:'none'}}>{s.l}</button>))}
                </div>}
            </div>
            {loading?(<div style={{textAlign:'center',padding:'80px 0'}}><div style={{fontSize:'3rem',marginBottom:16}}>🚆</div><p style={{color:ACC,fontWeight:700,fontSize:'1.1rem'}}>Searching trains…</p></div>):
            sorted.length===0&&searched?(<div style={{textAlign:'center',padding:'80px 0'}}><div style={{fontSize:'3rem',marginBottom:16}}>🔍</div><p style={{fontWeight:700,fontSize:'1.2rem',marginBottom:8}}>No trains found</p><p style={{color:'#64748b'}}>Try different stations or date.</p></div>):
            (<div style={{display:'flex',flexDirection:'column',gap:14}}>{sorted.map(t=><TrainCard key={t._id} train={t} selectedClass={classCode} onBook={(tr,cls)=>setBookingTrain({train:tr,cls})}/>)}</div>)}
            
            {bookingTrain && (
                showConfirm('Booking Requested', `Your reservation for ${bookingTrain.train.title.split('-')[0]} (#${bookingTrain.train.features?.trainNumber}) in ${bookingTrain.cls.name} has been received. Our ticketing agent will process this and send your e-ticket within 30 minutes.`, () => setBookingTrain(null), 'alert') || setBookingTrain(null)
            )}
            {/* Offers */}
            <Offers type="train" />

            {/* Trust */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:14,marginTop:48}}>
                {[{icon:<Shield size={19} color={ACC}/>,t:'IRCTC Simulated',d:'Indian Railways data'},{icon:<CheckCircle2 size={19} color={'#4ade80'}/>,t:'PNR Tracking',d:'Real-time status'},{icon:<Clock size={19} color={'#fbbf24'}/>,t:'Live Updates',d:'On-time information'},{icon:<Gift size={19} color={'#f472b6'}/>,t:'Free Cancellation',d:'On select fares'}].map((b,i)=>(<div key={i} style={{background:'rgba(15,23,42,0.85)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}><div style={{flexShrink:0}}>{b.icon}</div><div><div style={{fontWeight:700,fontSize:'0.88rem'}}>{b.t}</div><div style={{fontSize:'0.73rem',color:'#64748b',marginTop:2}}>{b.d}</div></div></div>))}
            </div>
        </div>
        {showPNR&&<PNRModal onClose={()=>setShowPNR(false)}/>}
    </div>);
};
export default TrainPage;
