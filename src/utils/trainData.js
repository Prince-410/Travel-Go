const TRAIN_STATIONS = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mumbai', 'Delhi', 'Bangalore'];
const TRAIN_NAMES = ['Shatabdi Express','Rajdhani Express','Jan Shatabdi','Duronto Express','Intercity Express','Garib Rath','Vande Bharat','Double Decker'];
const TRAIN_TYPES = ['Superfast','Express','Mail','Rajdhani','Shatabdi','Vande Bharat'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CLASSES = [
    { code:'1A', name:'First AC',     icon:'👑', multiplier:4 },
    { code:'2A', name:'Second AC',    icon:'❄️', multiplier:2.5 },
    { code:'3A', name:'Third AC',     icon:'🌡️', multiplier:1.6 },
    { code:'SL', name:'Sleeper',      icon:'🛏️', multiplier:1 },
    { code:'CC', name:'Chair Car',    icon:'💺', multiplier:1.3 },
];
const PLATFORMS = { 'Ahmedabad':['Platform 1','Platform 2','Platform 3','Platform 4'],'Surat':['Platform 1','Platform 2'],'Vadodara':['Platform 1','Platform 2','Platform 3'],'Rajkot':['Platform 1','Platform 2'],'Gandhinagar':['Platform 1'],'Mumbai':['Platform 1','Platform 2','Platform 3','Platform 4','Platform 5','Platform 6'],'Delhi':['Platform 1','Platform 2','Platform 3','Platform 4','Platform 5'],'Bangalore':['Platform 1','Platform 2','Platform 3'] };

function srand(seed){ let s=(seed*31+7)>>>0; return ()=>{ s=(Math.imul(s,16807))>>>0; return s/4294967296; }; }
function pad2(n){ return String(Math.abs(Math.floor(n))).padStart(2,'0'); }
function isoDate(offset){ return new Date(Date.now()+offset*86400000).toISOString().split('T')[0]; }

let _cache=null;
function generateTrains(){
    if(_cache) return _cache; const trains=[]; let sc=20000;
    for(let d=0;d<14;d++){
        const date=isoDate(d);
        for(let i=0;i<TRAIN_STATIONS.length;i++) for(let j=0;j<TRAIN_STATIONS.length;j++){
            if(i===j) continue;
            const r=srand(++sc);
            const depH=5+Math.floor(r()*17), depM=Math.floor(r()*4)*15;
            const dh=2+Math.floor(r()*8), dm=Math.floor(r()*4)*15;
            const tot=depH*60+depM+dh*60+dm;
            const baseFare=150+Math.floor(r()*200);
            const trainName=TRAIN_NAMES[Math.floor(r()*TRAIN_NAMES.length)];
            const platformIdx=PLATFORMS[TRAIN_STATIONS[i]];
            const pnr=(Math.floor(r()*9000000000)+1000000000).toString();
            trains.push({
                _id:`tr-${date}-${i}-${j}`,
                trainNumber:`${10000+Math.floor(r()*90000)}`,
                trainName, trainType:TRAIN_TYPES[Math.floor(r()*TRAIN_TYPES.length)],
                source:TRAIN_STATIONS[i], destination:TRAIN_STATIONS[j], date,
                departureTime:`${pad2(depH)}:${pad2(depM)}`,
                arrivalTime:`${pad2(Math.floor(tot/60)%24)}:${pad2(tot%60)}`,
                duration:`${dh}h ${dm>0?dm+'m':''}`.trim(),
                runsOn:DAYS.filter(()=>r()>0.3),
                platform:platformIdx?platformIdx[Math.floor(r()*platformIdx.length)]:'Platform 1',
                pnr,
                classes:CLASSES.map(cls=>({
                    code:cls.code, name:cls.name, icon:cls.icon,
                    totalSeats:cls.code==='1A'?20:cls.code==='2A'?52:cls.code==='3A'?64:cls.code==='SL'?72:56,
                    availableSeats:Math.floor(r()*(cls.code==='1A'?18:cls.code==='2A'?48:cls.code==='3A'?60:cls.code==='SL'?70:52)),
                    price:Math.round(baseFare*cls.multiplier),
                    waitlist:Math.floor(r()*20),
                })),
                rating:parseFloat((3.8+r()*1.1).toFixed(1)),
                pantry:r()>0.4,
                wifi:r()>0.6,
                distance:`${150+Math.floor(r()*800)} km`,
            });
        }
    }
    _cache=trains; return trains;
}

export function searchTrains(filters={}){
    const all=generateTrains(); let res=[...all];
    if(filters.source) res=res.filter(t=>t.source.toLowerCase()===filters.source.toLowerCase());
    if(filters.destination) res=res.filter(t=>t.destination.toLowerCase()===filters.destination.toLowerCase());
    if(filters.date) res=res.filter(t=>t.date===filters.date);
    if(filters.classCode) res=res.filter(t=>t.classes.some(c=>c.code===filters.classCode && c.availableSeats>0));
    res.sort((a,b)=>a.departureTime.localeCompare(b.departureTime));
    return res.slice(0,40);
}
export function getDefaultTrains(){ const all=generateTrains(); const today=isoDate(0); return all.filter(t=>t.date===today).slice(0,10); }
export function getPNRStatus(pnr){ const all=generateTrains(); const t=all.find(tr=>tr.pnr===pnr); if(!t) return null; return { pnr, status:['Confirmed','WL/12','RAC/4'][Math.floor(Math.random()*3)], train:t.trainName, from:t.source, to:t.destination, date:t.date, class:t.classes[0].name }; }
export { TRAIN_STATIONS, CLASSES, PLATFORMS };
