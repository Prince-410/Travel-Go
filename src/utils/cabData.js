const CAB_CITIES=['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Mumbai'];
const VEHICLE_TYPES=[
    { type:'Hatchback', icon:'🚗', capacity:4, acDefault:true,  baseKm:10, baseFare:80,  features:['AC','GPS','OTP Verified'] },
    { type:'Sedan',     icon:'🚙', capacity:4, acDefault:true,  baseKm:12, baseFare:120, features:['AC','GPS','OTP Verified','Music System'] },
    { type:'SUV',       icon:'🚐', capacity:6, acDefault:true,  baseKm:14, baseFare:180, features:['AC','GPS','OTP Verified','Spacious Boot'] },
    { type:'Luxury',    icon:'🏎️', capacity:4, acDefault:true,  baseKm:20, baseFare:350, features:['AC','WiFi','Chauffeur','Leather Seats','Water Bottle'] },
    { type:'Auto',      icon:'🛺', capacity:3, acDefault:false, baseKm:8,  baseFare:40,  features:['OTP Verified'] },
];
const CAB_TYPES=[
    { id:'airport',    label:'Airport Transfer', icon:'✈️',  desc:'Reliable pick-up & drop to airport' },
    { id:'outstation', label:'Outstation',       icon:'🛣️', desc:'Long-distance city-to-city travel' },
    { id:'local',      label:'Local Ride',       icon:'📍', desc:'Point-to-point within the city' },
    { id:'hourly',     label:'Hourly Rental',    icon:'⏱️', desc:'Rent a cab by the hour (4h min)' },
];
const OPERATORS=['Ola','Uber','Rapido','InDriver','Meru Cabs','QuickRide'];
const DRIVER_NAMES=['Ramesh K.','Suresh P.','Mahesh V.','Dinesh T.','Prashant G.','Vijay M.','Sunil D.','Harish R.'];

function srand(seed){ let s=(seed*31+7)>>>0; return ()=>{ s=(Math.imul(s,16807))>>>0; return s/4294967296; }; }

function estimateFare(vt,distKm,cabType,hours=4){
    const base=vt.baseFare; const km=vt.baseKm;
    if(cabType==='hourly') return Math.round(base + km*15*hours);
    const extra=Math.max(0,distKm-5)*km; return Math.round(base+extra);
}

export function getCabOptions(filters={}){
    const { source='Ahmedabad', cabType='local', vehicleType='', distKm=8, hours=4 } = filters;
    const options=[]; let sc=40000;
    for(const vt of VEHICLE_TYPES){
        if(vehicleType && !vt.type.toLowerCase().includes(vehicleType.toLowerCase())) continue;
        for(let i=0;i<2;i++){
            const r=srand(++sc);
            const op=OPERATORS[Math.floor(r()*OPERATORS.length)];
            const driver=DRIVER_NAMES[Math.floor(r()*DRIVER_NAMES.length)];
            const driverRating=parseFloat((3.8+r()*1.1).toFixed(1));
            const eta=3+Math.floor(r()*12);
            const fare=estimateFare(vt,distKm,cabType,hours);
            const surge=r()>0.8?parseFloat((1.2+r()*0.5).toFixed(1)):1;
            options.push({
                _id:`cab-${vt.type}-${i}`,
                vehicleType:vt.type, icon:vt.icon, capacity:vt.capacity,
                operator:op, driver, driverRating,
                features:vt.features, acAvailable:vt.acDefault,
                eta, source, cabType,
                distanceKm:distKm,
                baseFare:Math.round(fare*surge),
                surgeFare:surge>1?Math.round(fare*surge):null,
                surgeMultiplier:surge>1?surge:null,
                estimatedTime:`${20+Math.floor(r()*30)} mins`,
                cancellationPolicy: r()>0.5?'Free cancellation up to 5 mins':'No cancellation charges',
                pricePerKm:vt.baseKm,
            });
        }
    }
    return options.sort((a,b)=>a.baseFare-b.baseFare);
}

export { CAB_CITIES, VEHICLE_TYPES, CAB_TYPES, OPERATORS };
