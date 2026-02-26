let xmlData = null;

export const loadXMLData = async () => {
    if (xmlData) return xmlData;
    try {
        const response = await fetch('/data.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        xmlData = {
            commonCities: Array.from(xmlDoc.querySelectorAll('commonCities city')).map(n => n.textContent),
            badges: Array.from(xmlDoc.querySelectorAll('badges badge')).map(n => n.textContent),
            destinations: Array.from(xmlDoc.querySelectorAll('destinations dest')).map(n => n.textContent),
            airlines: Array.from(xmlDoc.querySelectorAll('airlines airline')).map(n => n.textContent),
            hotelChains: Array.from(xmlDoc.querySelectorAll('hotelChains chain')).map(n => n.textContent),
            hotelTypes: Array.from(xmlDoc.querySelectorAll('hotelTypes type')).map(n => n.textContent),
            trainNames: Array.from(xmlDoc.querySelectorAll('trainNames name')).map(n => n.textContent),
            busOperators: Array.from(xmlDoc.querySelectorAll('busOperators op')).map(n => n.textContent),
            cabTypes: Array.from(xmlDoc.querySelectorAll('cabTypes type')).map(n => n.textContent),
            offers: Array.from(xmlDoc.querySelectorAll('offers > *')).reduce((acc, category) => {
                acc[category.tagName] = Array.from(category.querySelectorAll('offer')).map(n => ({
                    title: n.getAttribute('title'),
                    desc: n.textContent,
                    color: n.getAttribute('color')
                }));
                return acc;
            }, {}),
            headerNav: Array.from(xmlDoc.querySelectorAll('headerNav item')).map(n => ({
                path: n.getAttribute('path'),
                label: n.getAttribute('label'),
                icon: n.getAttribute('icon')
            })),
            footerLinks: Array.from(xmlDoc.querySelectorAll('footerLinks column')).map(col => ({
                title: col.getAttribute('title'),
                links: Array.from(col.querySelectorAll('link')).map(link => ({
                    path: link.getAttribute('path'),
                    label: link.textContent
                }))
            }))
        };
        return xmlData;
    } catch (e) {
        console.error("Error loading XML data:", e);
        xmlData = {
            commonCities: ["Agra", "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Mumbai"],
            badges: ["Cheapest", "Popular", "Fastest", "Deal"],
            destinations: ["Bali", "Dubai", "Europe"],
            airlines: ["IndiGo", "Air India", "Vistara"],
            hotelChains: ["Taj", "Oberoi", "Marriott"],
            hotelTypes: ["Palace", "Resort"],
            trainNames: ["Rajdhani", "Shatabdi", "Express"],
            busOperators: ["VRL", "Orange"],
            cabTypes: ["Dzire", "Innova", "SUV"],
            offers: {
                flight: [{ title: "Student Discount", desc: "Extra baggage allowance.", color: "#f3e5f5" }]
            },
            headerNav: [
                { path: '/', label: 'Flights', icon: 'Plane' },
                { path: '/hotels', label: 'Hotels', icon: 'Hotel' }
            ],
            footerLinks: [
                {
                    title: "Company",
                    links: [{ path: "/about", label: "About Us" }]
                }
            ]
        };
        return xmlData;
    }
};

export const getOffers = async (type) => {
    await loadXMLData();
    if (xmlData && xmlData.offers && xmlData.offers[type]) {
        return xmlData.offers[type];
    }
    return [
        { title: "Special Deal", desc: "Enjoy unique savings on your next trip.", color: "#e3f2fd" }
    ];
};

export const getHeaderNav = async () => {
    await loadXMLData();
    return xmlData ? xmlData.headerNav : [];
};

export const getFooterLinks = async () => {
    await loadXMLData();
    return xmlData ? xmlData.footerLinks : [];
};

function getRandomItem(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(min, max) {
    return "₹" + (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString('en-IN');
}

function getRandomRating() {
    return (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
}

export const getCities = async () => {
    await loadXMLData();
    return xmlData ? xmlData.commonCities : ["Agra", "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gandhinagar", "Goa", "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Manali", "Mumbai", "Pune", "Shimla", "Surat", "Udaipur", "Varanasi"];
};

export const generateFlights = async (count, filters = {}) => {
    await loadXMLData();
    const flights = [];
    for (let i = 0; i < count; i++) {
        const from = filters.from || getRandomItem(xmlData.commonCities);
        let to = filters.to || getRandomItem(xmlData.commonCities);
        if (!filters.from && !filters.to) {
            while (from === to) to = getRandomItem(xmlData.commonCities);
        }

        flights.push({
            id: `flight-${i}-${Date.now()}`,
            badge: getRandomItem(xmlData.badges),
            title: `${from} to ${to}`,
            subtitle: `${getRandomItem(xmlData.airlines)} • ${Math.floor(Math.random() * 4 + 1)}h ${Math.floor(Math.random() * 50 + 10)}m`,
            pill1: getRandomItem(["Morning", "Afternoon", "Evening", "Night"]),
            pill2: getRandomItem(["Non-stop", "1 Stop"]),
            price: getRandomPrice(3000, 15000),
            rating: getRandomRating(),
            type: 'flight'
        });
    }
    return flights;
}

export const generateHotels = async (count, filters = {}) => {
    await loadXMLData();
    const hotels = [];
    for (let i = 0; i < count; i++) {
        const city = filters.location || getRandomItem(xmlData.commonCities);
        hotels.push({
            id: `hotel-${i}-${Date.now()}`,
            badge: getRandomItem(xmlData.badges),
            title: `${getRandomItem(xmlData.hotelChains)} ${getRandomItem(xmlData.hotelTypes)}`,
            subtitle: `📍 ${city}`,
            pill1: getRandomItem(["Pool", "Spa", "Gym", "Bar"]),
            pill2: getRandomItem(["5 Star", "4 Star", "Luxury", "Boutique"]),
            price: getRandomPrice(4000, 45000),
            rating: getRandomRating(),
            priceSuffix: " / night",
            type: 'hotel'
        });
    }
    return hotels;
}

export const generateTrains = async (count, filters = {}) => {
    await loadXMLData();
    const trains = [];
    for (let i = 0; i < count; i++) {
        let from, to;
        if (filters.from) from = filters.from.substring(0, 3).toUpperCase();
        else from = getRandomItem(xmlData.commonCities).substring(0, 3).toUpperCase();

        if (filters.to) to = filters.to.substring(0, 3).toUpperCase();
        else {
            to = getRandomItem(xmlData.commonCities).substring(0, 3).toUpperCase();
            while (!filters.from && from === to) to = getRandomItem(xmlData.commonCities).substring(0, 3).toUpperCase();
        }

        trains.push({
            id: `train-${i}-${Date.now()}`,
            badge: getRandomItem(["Fastest", "On-time", "Popular"]),
            title: `${getRandomItem(xmlData.trainNames)} Express`,
            subtitle: `${from} ➝ ${to}`,
            pill1: getRandomItem(["1A", "2A", "3A", "SL"]),
            pill2: getRandomItem(["Pantry", "WiFi", "Bedroll"]),
            price: getRandomPrice(500, 4000),
            rating: getRandomRating(),
            type: 'train'
        });
    }
    return trains;
}

export const generateBuses = async (count, filters = {}) => {
    await loadXMLData();
    const buses = [];
    for (let i = 0; i < count; i++) {
        let subtitle = `${getRandomItem(["AC Sleeper", "Volvo Multi-Axle", "Non-AC Seater"])}`;
        if (filters.from && filters.to) subtitle += ` • ${filters.from} to ${filters.to}`;

        buses.push({
            id: `bus-${i}-${Date.now()}`,
            badge: getRandomItem(["Safe", "Clean", "Cheap"]),
            title: `${getRandomItem(xmlData.busOperators)} Travels`,
            subtitle: subtitle,
            pill1: getRandomItem(["Live Tracking", "Blanket", "Water"]),
            pill2: getRandomItem(["Charging Point", "Reading Light"]),
            price: getRandomPrice(600, 2500),
            rating: getRandomRating(),
            type: 'bus'
        });
    }
    return buses;
}

export const generateCabs = async (count, filters = {}) => {
    await loadXMLData();
    const cabs = [];
    for (let i = 0; i < count; i++) {
        let subtitle = `${getRandomItem(["Sedan", "SUV", "Hatchback", "Luxury"])} • ${getRandomItem([4, 6, 7])} Seats`;
        if (filters.from && filters.to) subtitle = `${filters.from} ➝ ${filters.to} • ${subtitle}`;

        cabs.push({
            id: `cab-${i}-${Date.now()}`,
            badge: getRandomItem(["Top Rated", "Clean"]),
            title: `${getRandomItem(xmlData.cabTypes)} or Equivalent`,
            subtitle: subtitle,
            pill1: getRandomItem(["AC", "Music System", "Carrier"]),
            pill2: getRandomItem(["One Way", "Round Trip"]),
            price: getRandomPrice(1500, 15000),
            rating: getRandomRating(),
            type: 'cab'
        });
    }
    return cabs;
}

export const generateHolidays = async (count, filters = {}) => {
    await loadXMLData();
    const packages = [];
    for (let i = 0; i < count; i++) {
        const dest = filters.dest || getRandomItem(xmlData.destinations);
        packages.push({
            id: `holiday-${i}-${Date.now()}`,
            badge: getRandomItem(["Trending", "Honeymoon"]),
            title: `Trip to ${dest}`,
            subtitle: `${Math.floor(Math.random() * 5 + 3)} Nights / ${Math.floor(Math.random() * 5 + 4)} Days`,
            pill1: getRandomItem(["Flights Inc", "Visa Free"]),
            pill2: getRandomItem(["Breakfast", "Sightseeing"]),
            price: getRandomPrice(25000, 150000),
            rating: getRandomRating(),
            priceSuffix: " / person",
            type: 'holiday'
        });
    }
    return packages;
}
