const commonCities = ["Agra", "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gandhinagar", "Goa", "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Manali", "Mumbai", "Pune", "Shimla", "Surat", "Udaipur", "Varanasi"];
const badges = ["Cheapest", "Popular", "Fastest", "Best Seller", "Top Rated", "Luxury", "Deal"];
const features = ["Free Cancellation", "Breakfast Included", "Instant Confirmation", "Best Value", "Refundable", "WiFi"];
const dests = ["Bali", "Dubai", "Europe", "Goa", "Kerala", "Maldives", "Paris", "Swiss", "Thailand", "Vietnam"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(min, max) {
    return "₹" + (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString('en-IN');
}

function getRandomRating() {
    return (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
}

function generateFlights(count, filters = {}) {
    const airlines = ["IndiGo", "Air India", "Vistara", "SpiceJet", "Akasa Air", "AirAsia"];
    const flights = [];
    for (let i = 0; i < count; i++) {
        const from = filters.from || getRandomItem(commonCities);
        let to = filters.to || getRandomItem(commonCities);
        if (!filters.from && !filters.to) {
            while (from === to) to = getRandomItem(commonCities);
        }

        flights.push({
            badge: getRandomItem(badges),
            title: `${from} to ${to}`,
            subtitle: `${getRandomItem(airlines)} • ${Math.floor(Math.random() * 4 + 1)}h ${Math.floor(Math.random() * 50 + 10)}m`,
            pill1: getRandomItem(["Morning", "Afternoon", "Evening", "Night"]),
            pill2: getRandomItem(["Non-stop", "1 Stop"]),
            price: getRandomPrice(3000, 15000),
            rating: getRandomRating()
        });
    }
    return flights;
}

function generateHotels(count, filters = {}) {
    const chains = ["Taj", "Oberoi", "Hyatt", "Marriott", "Radisson", "Lemon Tree", "ITC", "Novotel", "Ibibo"];
    const types = ["Palace", "Residency", "Suites", "Inn", "Plaza", "Grand", "Resort"];
    const hotels = [];
    for (let i = 0; i < count; i++) {
        const city = filters.location || getRandomItem(commonCities);
        hotels.push({
            badge: getRandomItem(badges),
            title: `${getRandomItem(chains)} ${getRandomItem(types)}`,
            subtitle: `📍 ${city}`,
            pill1: getRandomItem(["Pool", "Spa", "Gym", "Bar"]),
            pill2: getRandomItem(["5 Star", "4 Star", "Luxury", "Boutique"]),
            price: getRandomPrice(4000, 45000),
            rating: getRandomRating(),
            priceSuffix: " / night"
        });
    }
    return hotels;
}

function generateTrains(count, filters = {}) {
    const names = ["Rajdhani", "Shatabdi", "Duronto", "Vande Bharat", "Garib Rath", "Express", "Mail", "Superfast"];
    const trains = [];
    for (let i = 0; i < count; i++) {
        let from, to;

        if (filters.from) {
            from = filters.from.substring(0, 3).toUpperCase();
        } else {
            from = getRandomItem(commonCities).substring(0, 3).toUpperCase();
        }

        if (filters.to) {
            to = filters.to.substring(0, 3).toUpperCase();
        } else {
            to = getRandomItem(commonCities).substring(0, 3).toUpperCase();
            while (!filters.from && from === to) to = getRandomItem(commonCities).substring(0, 3).toUpperCase();
        }

        trains.push({
            badge: getRandomItem(["Fastest", "On-time", "Popular"]),
            title: `${getRandomItem(names)} Express`,
            subtitle: `${from} ➝ ${to}`,
            pill1: getRandomItem(["1A", "2A", "3A", "SL"]),
            pill2: getRandomItem(["Pantry", "WiFi", "Bedroll"]),
            price: getRandomPrice(500, 4000),
            rating: getRandomRating()
        });
    }
    return trains;
}

function generateBuses(count, filters = {}) {
    const operators = ["VRL", "Orange", "SRS", "KSRTC", "IntrCity", "ZingBus", "Charter"];
    const buses = [];
    for (let i = 0; i < count; i++) {
        let subtitle = `${getRandomItem(["AC Sleeper", "Volvo Multi-Axle", "Non-AC Seater"])}`;

        if (filters.from && filters.to) {
            subtitle += ` • ${filters.from} to ${filters.to}`;
        }

        buses.push({
            badge: getRandomItem(["Safe", "Clean", "Cheap"]),
            title: `${getRandomItem(operators)} Travels`,
            subtitle: subtitle,
            pill1: getRandomItem(["Live Tracking", "Blanket", "Water"]),
            pill2: getRandomItem(["Charging Point", "Reading Light"]),
            price: getRandomPrice(600, 2500),
            rating: getRandomRating()
        });
    }
    return buses;
}

function generateCabs(count, filters = {}) {
    const types = ["Dzire", "Etios", "Innova", "Ertiga", "Xylo", "Mercedes", "BMW", "Audi"];
    const cabs = [];
    for (let i = 0; i < count; i++) {
        let subtitle = `${getRandomItem(["Sedan", "SUV", "Hatchback", "Luxury"])} • ${getRandomItem([4, 6, 7])} Seats`;

        // Slightly hacky to include route in subtitle for Cabs if searched
        if (filters.from && filters.to) {
            subtitle = `${filters.from} ➝ ${filters.to} • ${subtitle}`;
        }

        cabs.push({
            badge: getRandomItem(["Top Rated", "Clean"]),
            title: `${getRandomItem(types)} or Equivalent`,
            subtitle: subtitle,
            pill1: getRandomItem(["AC", "Music System", "Carrier"]),
            pill2: getRandomItem(["One Way", "Round Trip"]),
            price: getRandomPrice(1500, 15000),
            rating: getRandomRating()
        });
    }
    return cabs;
}

function generateHolidays(count, filters = {}) {
    const packages = [];
    for (let i = 0; i < count; i++) {
        const dest = filters.dest || getRandomItem(dests);

        packages.push({
            badge: getRandomItem(["Trending", "Honeymoon"]),
            title: `Trip to ${dest}`,
            subtitle: `${Math.floor(Math.random() * 5 + 3)} Nights / ${Math.floor(Math.random() * 5 + 4)} Days`,
            pill1: getRandomItem(["Flights Inc", "Visa Free"]),
            pill2: getRandomItem(["Breakfast", "Sightseeing"]),
            price: getRandomPrice(25000, 150000),
            rating: getRandomRating(),
            priceSuffix: " / person"
        });
    }
    return packages;
}

function renderCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // Clear existing

    data.forEach(item => {
        let cardHTML = "";

        // Standard Card Layout
        const randomHue = Math.floor(Math.random() * 360);
        const priceDisplay = item.priceSuffix ? `${item.price} <span>${item.priceSuffix}</span>` : item.price;

        cardHTML = `
            <div class="listing-card">
                <div class="listing-image" style="background-image: linear-gradient(${randomHue}deg, #ddd, #eee);">
                   ${item.badge ? `<span class="listing-badge">${item.badge}</span>` : ''}
                </div>
                <div class="listing-content">
                    <div class="listing-title">${item.title}</div>
                    <div class="listing-location">${item.subtitle}</div>
                    <div>
                        ${item.pill1 ? `<span class="feature-pill">${item.pill1}</span>` : ''}
                        ${item.pill2 ? `<span class="feature-pill">${item.pill2}</span>` : ''}
                    </div>
                    <div class="listing-meta">
                        <div class="listing-price">${priceDisplay}</div>
                        <div class="listing-rating">${item.rating} ★</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}


function populateDropdown(id, items) {
    const originalSelect = document.getElementById(id);
    if (!originalSelect) return;

    // Clear existing custom wrapper if re-running (safety)
    const existingWrapper = originalSelect.parentNode.querySelector('.custom-select-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
        originalSelect.style.display = 'block';
    }

    // Populate native select options (for form submission)
    originalSelect.innerHTML = "";
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        originalSelect.appendChild(option);
    });

    // Select random default
    const randomItem = items[Math.floor(Math.random() * items.length)];
    originalSelect.value = randomItem;

    // --- Build Custom UI ---

    // Hide native select
    originalSelect.style.display = 'none';

    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    // Trigger (Visible part)
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.textContent = randomItem;

    // Options Container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-options';

    // Generate Custom Options
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.textContent = item;
        option.dataset.value = item;

        if (item === randomItem) {
            option.classList.add('selected');
        }

        option.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent wrapper click

            // Update UI
            trigger.textContent = item;

            // Update selection state
            optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // Update Native Select
            originalSelect.value = item;
            // dispatch change event if any listener is attached
            originalSelect.dispatchEvent(new Event('change'));

            // Close dropdown
            wrapper.classList.remove('open');
        });

        optionsContainer.appendChild(option);
    });

    // Toggle Dropdown
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop propagation
        // Close others
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
            if (w !== wrapper) w.classList.remove('open');
        });
        wrapper.classList.toggle('open');
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsContainer);

    // Insert after original select
    originalSelect.parentNode.insertBefore(wrapper, originalSelect.nextSibling);

    // Handle Click Outside to Close - Add global listener only once
    if (!window.hasGlobalClickListener) {
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
        });
        window.hasGlobalClickListener = true;
    }
}

// Router to decide what to render based on page
document.addEventListener('DOMContentLoaded', () => {
    // Populate Dropdowns
    populateDropdown('from', commonCities);
    populateDropdown('to', commonCities);
    populateDropdown('location', commonCities);
    populateDropdown('dest', dests);

    // Ensure From/To are different for flights/trains/etc
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    if (fromSelect && toSelect && fromSelect.value === toSelect.value) {
        // Just shift 'to' to next index or random again
        toSelect.selectedIndex = (toSelect.selectedIndex + 1) % toSelect.options.length;
    }

    const path = window.location.pathname;
    let generatorFn = null;
    let initialCount = 9;
    const searchCount = 6;


    if (path.includes('index.html') || path.endsWith('/')) {
        generatorFn = generateFlights;
    } else if (path.includes('hotels.html')) {
        generatorFn = generateHotels;
    } else if (path.includes('trains.html')) {
        generatorFn = generateTrains;
    } else if (path.includes('buses.html')) {
        generatorFn = generateBuses;
    } else if (path.includes('cabs.html')) {
        generatorFn = generateCabs;
    } else if (path.includes('holidays.html')) {
        generatorFn = generateHolidays;
    }

    if (generatorFn) {
        // Initial rendering - "Recently Viewed"
        renderCards(generatorFn(initialCount), 'listing-grid');

        // Update section title logic
        const sectionTitle = document.querySelector('.listing-section .section-title');
        if (sectionTitle) {
            sectionTitle.textContent = "Recently Viewed";
        }

        // Handle Search Form logic
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const grid = document.getElementById('listing-grid');
                if (grid) grid.style.opacity = '0.5';

                // Collect Filters
                const filters = {};
                const fromInput = document.getElementById('from');
                const toInput = document.getElementById('to');
                const locationInput = document.getElementById('location');
                const destInput = document.getElementById('dest');

                if (fromInput) filters.from = fromInput.value;
                if (toInput) filters.to = toInput.value;
                if (locationInput) filters.location = locationInput.value;
                if (destInput) filters.dest = destInput.value;

                setTimeout(() => {
                    // Update Title
                    if (sectionTitle) {
                        sectionTitle.textContent = "Best Options For You";
                    }

                    renderCards(generatorFn(searchCount, filters), 'listing-grid');

                    if (grid) grid.style.opacity = '1';

                    const listingSection = document.querySelector('.listing-section');
                    if (listingSection) listingSection.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            });
        }
    }


    // --- Search Tabs Logic ---
    const tabs = document.querySelectorAll('.search-tabs .tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent submit if button type=submit or generic button

                // Remove active from siblings
                const parent = tab.parentElement;
                parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

                // Add active to current
                tab.classList.add('active');

                // Specific Logic for Flights (One Way vs Round Trip) - Basic UI Toggle
                if (tab.dataset.type === 'oneway' || tab.dataset.type === 'roundtrip') {
                    const returnInput = document.getElementById('return');
                    if (returnInput) {
                        const formGroup = returnInput.closest('.form-group');
                        if (formGroup) {
                            if (tab.dataset.type === 'oneway') {
                                formGroup.style.opacity = '0.5';
                                formGroup.style.pointerEvents = 'none';
                                returnInput.disabled = true;
                            } else {
                                formGroup.style.opacity = '1';
                                formGroup.style.pointerEvents = 'auto';
                                returnInput.disabled = false;
                            }
                        }
                    }
                }

                // Specific Logic for Trains (Book vs PNR vs Status)
                if (['book', 'pnr', 'status'].includes(tab.dataset.type)) {
                    const pnrGroup = document.getElementById('pnr-group');
                    const statusGroup = document.getElementById('status-group');

                    if (pnrGroup && statusGroup) {
                        // All groups in the form
                        const form = document.querySelector('.search-form');
                        if (form) {
                            const allGroups = Array.from(form.children).filter(el => el.classList.contains('form-group'));

                            if (tab.dataset.type === 'book') {
                                allGroups.forEach(g => {
                                    if (g.id === 'pnr-group' || g.id === 'status-group') {
                                        g.style.display = 'none';
                                    } else {
                                        g.style.display = 'flex';
                                    }
                                });
                            } else if (tab.dataset.type === 'pnr') {
                                allGroups.forEach(g => {
                                    if (g.id === 'pnr-group') {
                                        g.style.display = 'flex';
                                    } else {
                                        g.style.display = 'none';
                                    }
                                });
                            } else if (tab.dataset.type === 'status') {
                                allGroups.forEach(g => {
                                    if (g.id === 'status-group') {
                                        g.style.display = 'flex';
                                    } else {
                                        g.style.display = 'none';
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });

        // Initialize Flight state
        const activeTab = document.querySelector('.search-tabs .tab.active');
        if (activeTab && activeTab.dataset.type === 'oneway') {
            const returnInput = document.getElementById('return');
            if (returnInput) {
                const formGroup = returnInput.closest('.form-group');
                if (formGroup) {
                    formGroup.style.opacity = '0.5';
                    formGroup.style.pointerEvents = 'none';
                    returnInput.disabled = true;
                }
            }
        }
    }

    // --- Date Restrictions ---
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    // Link Start/End Dates
    // Flights: Departure -> Return
    const departureDate = document.getElementById('departure');
    const returnDate = document.getElementById('return');
    if (departureDate && returnDate) {
        departureDate.addEventListener('change', () => {
            returnDate.setAttribute('min', departureDate.value);
            if (returnDate.value && returnDate.value < departureDate.value) {
                returnDate.value = departureDate.value;
            }
        });
    }

    // Hotels: Checkin -> Checkout
    const checkinDate = document.getElementById('checkin');
    const checkoutDate = document.getElementById('checkout');
    if (checkinDate && checkoutDate) {
        checkinDate.addEventListener('change', () => {
            // For hotels, typically checkout is at least next day, or same day? Let's say checkin date limit.
            // Actually, usually checkout > checkin. But >= is safe minimum.
            checkoutDate.setAttribute('min', checkinDate.value);
            if (checkoutDate.value && checkoutDate.value < checkinDate.value) {
                checkoutDate.value = checkinDate.value;
            }
        });
    }
});
