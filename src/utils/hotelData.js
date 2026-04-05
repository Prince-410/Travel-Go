const HOTEL_CITIES=['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Mumbai','Delhi','Goa','Jaipur','Shimla'];
const HOTEL_NAMES=['The Grand Meridian','Royal Pavilion','Comfort Suites','Skyline Inn','Heritage Palace','Business Hub','The Pearl Resort','Garden View','Marriott','Hyatt Regency','Taj Gateway','Holiday Inn'];
const ROOM_TYPES=[
    { type:'Standard',    icon:'🛏️', multiplier:1   },
    { type:'Deluxe',      icon:'✨', multiplier:1.6  },
    { type:'Premium',     icon:'💎', multiplier:2.2  },
    { type:'Suite',       icon:'👑', multiplier:3.5  },
    { type:'Family Room', icon:'👨‍👩‍👧', multiplier:2.0  },
];
const ALL_AMENITIES=['Free WiFi','Swimming Pool','Gym','Restaurant','Bar','Spa','Parking','Airport Shuttle','Room Service','Breakfast Included','Conference Hall','Kids Play Area','Rooftop View','Beach Access','Mountain View'];
const REVIEW_AUTHORS=['Rahul M.','Priya S.','Ankit G.','Meena P.','Sanjay V.','Deepa K.','Vivek R.','Anjali T.'];
const REVIEW_TEXTS=['Excellent stay! Clean rooms and friendly staff.','Good value for money. Will visit again.',
    'Beautiful property with stunning views.','Average experience, could be better.','Outstanding hospitality!',
    'Comfortable stay. Breakfast was amazing.','Loved the pool and spa facilities.','Central location, easy access to attractions.'];

function srand(seed){ let s=(seed*31+7)>>>0; return ()=>{ s=(Math.imul(s,16807))>>>0; return s/4294967296; }; }

let _cache=null;
function generateHotels(){
    if(_cache) return _cache; const hotels=[]; let sc=30000;
    for(const city of HOTEL_CITIES){
        for(let h=0;h<HOTEL_NAMES.length;h++){
            const r=srand(++sc);
            const stars=2+Math.floor(r()*4);
            const numAm=4+Math.floor(r()*8);
            const shuffled=[...ALL_AMENITIES].sort(()=>r()-0.5);
            const ams=shuffled.slice(0,numAm);
            const basePrice=800+stars*400+Math.floor(r()*1000);
            const numReviews=3+Math.floor(r()*4);
            const reviews=Array.from({length:numReviews},(_,ri)=>{
                const rr=srand(sc*10+ri);
                return { author:REVIEW_AUTHORS[Math.floor(rr()*REVIEW_AUTHORS.length)], text:REVIEW_TEXTS[Math.floor(rr()*REVIEW_TEXTS.length)], rating:parseFloat((3+rr()*2).toFixed(1)), date:`2025-${String(Math.floor(rr()*11)+1).padStart(2,'0')}-${String(Math.floor(rr()*27)+1).padStart(2,'0')}` };
            });
            hotels.push({
                _id:`hotel-${city}-${h}`,
                name:`${HOTEL_NAMES[h]}`,
                city, address:`Sector ${Math.floor(r()*20)+1}, ${city}`,
                starRating:stars,
                rating:parseFloat((3+r()*2).toFixed(1)),
                amenities:ams,
                checkIn:'12:00 PM', checkOut:'11:00 AM',
                description:`A premium ${stars}-star property in the heart of ${city}. Offering world-class services and impeccable hospitality for both business and leisure travellers.`,
                reviews,
                rooms:ROOM_TYPES.map(rt=>({
                    type:rt.type, icon:rt.icon,
                    totalRooms:10+Math.floor(r()*20),
                    availableRooms:2+Math.floor(r()*15),
                    pricePerNight:Math.round(basePrice*rt.multiplier),
                    features:['King Bed','64" Smart TV','Mini Bar','Work Desk','Balcony'].filter(()=>r()>0.3),
                })),
                coordinates:{ lat:22.3+r()*5, lng:72.5+r()*5 },
                images:['hotel_exterior','hotel_room','hotel_pool','hotel_restaurant'],
            });
        }
    }
    _cache=hotels; return hotels;
}

export function searchHotels(filters={}){
    const all=generateHotels(); let res=[...all];
    if(filters.city) res=res.filter(h=>h.city.toLowerCase()===filters.city.toLowerCase());
    if(filters.stars) res=res.filter(h=>h.starRating>=Number(filters.stars));
    if(filters.maxPrice) res=res.filter(h=>h.rooms.some(r=>r.pricePerNight<=Number(filters.maxPrice)));
    if(filters.amenity) res=res.filter(h=>h.amenities.some(a=>a.toLowerCase().includes(filters.amenity.toLowerCase())));
    res.sort((a,b)=>b.rating-a.rating);
    return res.slice(0,30);
}
export function getDefaultHotels(){ return generateHotels().slice(0,9); }
export { HOTEL_CITIES, ROOM_TYPES, ALL_AMENITIES };
