const PACKAGES=[
    { id:'goa-3d2n',    dest:'Goa',     title:'Goa Beach Getaway',      duration:'3D/2N', price:8999,  type:'Beach',     rating:4.7, image:'🏖️',
      itinerary:['Day 1: Arrive Goa, check-in hotel, Calangute Beach sunset','Day 2: North Goa tour — Fort Aguada, Anjuna Market, Vagator Beach','Day 3: South Goa — Palolem Beach, Old Goa churches, depart'],
      hotels:['Taj Vivanta Goa','Resort Rio'],flights:['Mumbai→Goa IndiGo 6E-354'],activities:['Water Sports','Sunset Cruise','Goa Spice Farm Visit'],meals:'Breakfast & Dinner included',desc:'Sun, sand & sea — the perfect Goa escape for couples and families.' },
    { id:'manali-5d4n', dest:'Manali',  title:'Manali Snow Adventure',  duration:'5D/4N', price:14999, type:'Adventure', rating:4.8, image:'🏔️',
      itinerary:['Day 1: Arrive Manali, Mall Road & Jogini Waterfall','Day 2: Rohtang Pass (snow point), Solang Valley','Day 3: Hidimba Temple, Old Manali, river rafting','Day 4: Kulu Valley excursion & Manikaran','Day 5: Depart'],
      hotels:['Snow Valley Resorts','The Himalayan'],flights:['Delhi→Bhuntar SpiceJet SG-1023'],activities:['Snow Activities','River Rafting','Paragliding','Trekking'],meals:'All Meals Included',desc:'Adventure awaits in the Himalayas — snow, peaks and adrenaline.' },
    { id:'dubai-4d3n',  dest:'Dubai',   title:'Dubai Luxury Tour',       duration:'4D/3N', price:34999, type:'City Tour',  rating:4.9, image:'🏙️',
      itinerary:['Day 1: Arrival Dubai, Dubai Frame, Global Village','Day 2: Burj Khalifa, Dubai Mall, Fountain Show, Desert Safari','Day 3: Palm Jumeirah, Atlantis, Abu Dhabi Mosque','Day 4: Gold Souk, Spice Market, depart'],
      hotels:['Atlantis The Palm','Jumeirah Beach Hotel'],flights:['Ahmedabad→Dubai Air India AI-931'],activities:['Desert Safari','Dhow Cruise','Burj Khalifa Visit','Gold Souk Shopping'],meals:'Breakfast Included',desc:'Experience the glitzy city of gold with world-class hospitality.' },
    { id:'bali-honey',  dest:'Bali',    title:'Bali Honeymoon Package',  duration:'6D/5N', price:54999, type:'Honeymoon',  rating:4.9, image:'🌺',
      itinerary:['Day 1: Arrive Bali, Kuta Beach, romantic dinner','Day 2: Ubud — rice terraces, Monkey Forest, Tirta Empul','Day 3: Mount Batur sunrise trek, hot springs','Day 4: Nusa Penida — Crystal Bay, Kelingking Beach','Day 5: Private beach day, couples spa','Day 6: Depart'],
      hotels:['Four Seasons Bali','Alaya Resort Ubud'],flights:['Mumbai→Bali IndiGo 6E-1843'],activities:['Sunrise Trek','Couples Spa','Private Pool Villa','Snorkeling'],meals:'Breakfast & Romantic Dinners',desc:'Tailored for honeymooners — luxury, romance and magical sunsets.' },
    { id:'kerala-4d3n', dest:'Kerala',  title:'Kerala Backwaters',        duration:'4D/3N', price:11999, type:'Nature',     rating:4.6, image:'🌿',
      itinerary:['Day 1: Arrive Kochi, Fort Kochi heritage walk, Chinese fishing nets','Day 2: Alleppey houseboat experience','Day 3: Thekkady — Periyar Wildlife Sanctuary','Day 4: Munnar tea gardens, depart'],
      hotels:['Taj Malabar Kochi','Fragrant Nature Munnar'],flights:['Ahmedabad→Kochi Vistara UK-831'],activities:['Houseboat Cruise','Wildlife Safari','Tea Garden Tour','Kathakali Show'],meals:'All Meals Included',desc:'Gods Own Country — backwaters, wildlife and lush greenery.' },
    { id:'shimla-4d3n', dest:'Shimla',  title:'Shimla Hill Retreat',      duration:'4D/3N', price:9999,  type:'Hills',     rating:4.5, image:'❄️',
      itinerary:['Day 1: Arrive Shimla, The Ridge, Christ Church','Day 2: Kufri Snow Point, Jakhu Temple','Day 3: Toy Train ride, Naldehra Golf Course','Day 4: Mall Road shopping, depart'],
      hotels:['Cecil Hotel Shimla','Oberoi Wildflower Hall'],flights:['Delhi→Shimla Air India AI-605'],activities:['Toy Train Ride','Kufri Snow Sports','Horse Riding'],meals:'Breakfast Included',desc:'Charming hill station with colonial architecture and pine forests.' },
];

const AI_RECOMMENDATIONS = {
    'Beach':['Pack light summer clothes','Best season: Oct–May','Book water sports in advance'],
    'Adventure':['Carry warm layers','Acclimatize for 1 day','Book permits early'],
    'City Tour':['Carry valid passport/visa','Currency exchange at airport','Early Burj booking recommended'],
    'Honeymoon':['Request romantic décor at hotel','Book spa 48h in advance','Carry formal wear for dinners'],
    'Nature':['Carry mosquito repellent','Rain gear for monsoon','Book houseboat 30 days ahead'],
    'Hills':['Layer up — temperatures drop sharply','Carry ID proof','Avoid peak season Dec–Jan'],
};

export function searchPackages(filters={}){
    let res=[...PACKAGES];
    if(filters.destination) res=res.filter(p=>p.dest.toLowerCase().includes(filters.destination.toLowerCase()));
    if(filters.type && filters.type!=='all') res=res.filter(p=>p.type.toLowerCase()===filters.type.toLowerCase());
    if(filters.maxPrice) res=res.filter(p=>p.price<=Number(filters.maxPrice));
    return res;
}
export function getAIRecommendation(pkg){ return AI_RECOMMENDATIONS[pkg.type] || ['Great choice!','Book early for best prices','Read reviews before booking']; }
export { PACKAGES, AI_RECOMMENDATIONS };
