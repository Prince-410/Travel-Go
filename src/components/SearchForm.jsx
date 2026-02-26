
import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, User, ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { getCities } from '../utils/mockData';
import '../App.css';

const SearchForm = ({ type = 'flight', onSearch }) => {
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        date: '',
        returnDate: '',
        travellers: '1',
        class: 'Economy'
    });

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [tripType, setTripType] = useState('oneWay');

    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            const data = await getCities();
            setCities(data || []);
        };
        fetchCities();
    }, []);

    const renderRadioOption = (value, label, name) => {
        const isSelected = tripType === value;
        return (
            <label
                key={value}
                onClick={() => setTripType(value)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    background: isSelected ? '#ebf8ff' : '#f7fafc',
                    color: isSelected ? '#008cff' : '#4a5568',
                    border: isSelected ? '1px solid #bae3ff' : '1px solid #edf2f7',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? '0 2px 4px rgba(0, 140, 255, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = '#edf2f7';
                        e.currentTarget.style.color = '#2d3748';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = '#f7fafc';
                        e.currentTarget.style.color = '#4a5568';
                    }
                }}
            >
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={isSelected}
                    onChange={() => setTripType(value)}
                    style={{ display: 'none' }}
                />
                {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#008cff' }}></div>}
                {label}
            </label>
        );
    };

    useEffect(() => {
        switch (type) {
            case 'hotel': setTripType('domestic'); break;
            case 'train': setTripType('book'); break;
            case 'bus': setTripType('ticket'); break;
            case 'cab': setTripType('oneWay'); break;
            case 'holiday': setTripType('domestic'); break;
            default: setTripType('oneWay');
        }
    }, [type]);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleCitySelect = (field, city) => {
        setFilters({ ...filters, [field]: city });
        setDropdownOpen(null);
    }

    const toggleDropdown = (field) => {
        setDropdownOpen(dropdownOpen === field ? null : field);
    }

    const renderCityDropdown = (field, placeholder) => {
        const isOpen = dropdownOpen === field;
        return (
            <div className="custom-dropdown-container" style={{ position: 'relative', width: '100%' }}>
                <div
                    className={`form-input-trigger ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleDropdown(field)}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        padding: '5px 0'
                    }}
                >
                    <span style={{ color: filters[field] ? '#2d3748' : '#a0aec0' }}>
                        {filters[field] || placeholder}
                    </span>
                    <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
                {isOpen && (
                    <div className="custom-dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        left: '-20px',
                        right: '-20px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        marginTop: '15px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '10px'
                    }}>
                        <div className="dropdown-search" style={{ padding: '0 10px 10px' }}>
                            <input
                                type="text"
                                placeholder="Search city..."
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div className="dropdown-list">
                            {cities.map(city => (
                                <div
                                    key={city}
                                    className="dropdown-item"
                                    onClick={() => handleCitySelect(field, city)}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'background 0.2s',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <MapPin size={14} className="text-primary" style={{ color: '#008cff' }} />
                                    {city}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSelectDropdown = (field, options, icon) => {
        const isOpen = dropdownOpen === field;
        const selectedOption = options.find(opt => opt.value == filters[field]);
        const displayValue = selectedOption ? selectedOption.label : (filters[field] || 'Select');

        return (
            <div className="custom-dropdown-container" style={{ position: 'relative', width: '100%' }}>
                <div
                    className={`form-input-trigger ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleDropdown(field)}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        padding: '5px 0',
                        color: '#2d3748'
                    }}
                >
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }}>
                        {displayValue}
                    </span>
                    <ChevronDown size={16} style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: '#008cff',
                        minWidth: '16px'
                    }} />
                </div>
                {isOpen && (
                    <div className="custom-dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        left: '-20px',
                        right: '-20px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        marginTop: '15px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '10px'
                    }}>
                        <div className="dropdown-list">
                            {options.map(option => (
                                <div
                                    key={option.value}
                                    className="dropdown-item"
                                    onClick={() => handleCitySelect(field, option.value)}
                                    style={{
                                        padding: '12px 15px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'background 0.2s',
                                        fontWeight: '600',
                                        color: '#2d3748'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getFormGroupStyle = (field) => {
        return dropdownOpen === field ? { zIndex: 1000 } : {};
    };

    const renderFields = () => {
        switch (type) {
            case 'hotel':
                return (
                    <>
                        <div className="form-group" style={{ gridColumn: 'span 2', ...getFormGroupStyle('to') }}>
                            <label>Where to?</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('to', 'Select Destination')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Check-in</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Check-out</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="returnDate" value={filters.returnDate} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('travellers')}>
                            <label>Guests</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderSelectDropdown('travellers', [1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: `${n} Guests` })), User)}
                            </div>
                        </div>
                    </>
                );
            case 'train':
                const trainClasses = [
                    { value: 'All', label: 'All Classes' },
                    { value: 'SL', label: 'Sleeper (SL)' },
                    { value: '3A', label: 'AC 3 Tier (3A)' },
                    { value: '2A', label: 'AC 2 Tier (2A)' },
                    { value: '1A', label: 'AC First Class (1A)' },
                ];

                if (tripType === 'pnr') {
                    return (
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>PNR Number</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Search size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="text" placeholder="Enter 10-digit PNR Number" className="form-input" />
                            </div>
                        </div>
                    );
                }

                if (tripType === 'liveStatus') {
                    return (
                        <>
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Train Number / Name</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Search size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    <input type="text" placeholder="Enter Train No. or Name" className="form-input" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        </>
                    );
                }

                return (
                    <>
                        <div className="form-group" style={getFormGroupStyle('from')}>
                            <label>From</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('from', 'From Station')}
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('to')}>
                            <label>To</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('to', 'To Station')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Travel Date</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('class')}>
                            <label>Class</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderSelectDropdown('class', trainClasses, User)}
                            </div>
                        </div>
                    </>
                );
            case 'bus':
                const busSeats = [
                    { value: 'Any', label: 'Any Seat Type' },
                    { value: 'Seater', label: 'Seater' },
                    { value: 'Sleeper', label: 'Sleeper' },
                    { value: 'AC', label: 'AC' },
                    { value: 'Non-AC', label: 'Non-AC' },
                ];
                return (
                    <>
                        <div className="form-group" style={getFormGroupStyle('from')}>
                            <label>From</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('from', 'From City')}
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('to')}>
                            <label>To</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('to', 'To City')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Travel Date</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        {tripType === 'hire' && (
                            <div className="form-group">
                                <label>Return Date</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    <input type="date" name="returnDate" value={filters.returnDate} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        )}
                        <div className="form-group" style={getFormGroupStyle('seatType')}>
                            <label>Seat Type</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderSelectDropdown('seatType', busSeats, User)}
                            </div>
                        </div>
                    </>
                );
            case 'cab':
                const cabDurations = [
                    { value: '4hr', label: '4 hrs / 40 km' },
                    { value: '8hr', label: '8 hrs / 80 km' },
                    { value: '12hr', label: '12 hrs / 120 km' },
                ];
                return (
                    <>
                        <div className="form-group" style={getFormGroupStyle('from')}>
                            <label>{tripType === 'airport' ? 'Airport' : 'From'}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('from', tripType === 'airport' ? 'Select Airport' : 'Pickup Location')}
                            </div>
                        </div>
                        {tripType !== 'hourly' && (
                            <div className="form-group" style={getFormGroupStyle('to')}>
                                <label>{tripType === 'airport' ? 'Drop Location' : 'To'}</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    {renderCityDropdown('to', 'Drop Location')}
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Pickup Date</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        {tripType === 'roundTrip' && (
                            <div className="form-group">
                                <label>Return Date</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    <input type="date" name="returnDate" value={filters.returnDate} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Pickup Time</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="time" name="time" className="form-input" />
                            </div>
                        </div>
                        {tripType === 'hourly' && (
                            <div className="form-group" style={getFormGroupStyle('duration')}>
                                <label>Duration</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Clock size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    {renderSelectDropdown('duration', cabDurations, Clock)}
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'holiday':
                const durations = [
                    { value: '3N/4D', label: '3N/4D' },
                    { value: '5N/6D', label: '5N/6D' },
                    { value: '7N/8D', label: '7N/8D' },
                ];
                return (
                    <>
                        <div className="form-group" style={getFormGroupStyle('from')}>
                            <label>From City</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('from', 'Start City')}
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('to')}>
                            <label>To Destination</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('to', 'Select Destination')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Departure Date</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('duration')}>
                            <label>Duration</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderSelectDropdown('duration', durations, Clock)}
                            </div>
                        </div>
                    </>
                );
            case 'flight':
            default:
                const flightTravellers = [
                    { value: '1', label: '1 Traveller, Economy' },
                    { value: '2', label: '2 Travellers, Economy' },
                    { value: '3', label: '3 Travellers, Business' }
                ];
                return (
                    <>
                        <div className="form-group" style={getFormGroupStyle('from')}>
                            <label>From</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('from', 'From City')}
                            </div>
                        </div>
                        <div className="form-group" style={getFormGroupStyle('to')}>
                            <label>To</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                {renderCityDropdown('to', 'To City')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Departure</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                <input type="date" name="date" value={filters.date} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        {tripType === 'roundTrip' && (
                            <div className="form-group">
                                <label>Return</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    <input type="date" name="returnDate" value={filters.returnDate} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        )}
                        {type === 'flight' && (
                            <div className="form-group" style={getFormGroupStyle('travellers')}>
                                <label>Travellers & Class</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <User size={22} className="text-light" style={{ color: '#008cff', minWidth: '22px' }} />
                                    {renderSelectDropdown('travellers', flightTravellers, User)}
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="search-container-wrapper" data-page-type={type}>
            <div className="search-card">
                <div className="search-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '20px'
                }}>
                    <div className="search-title" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {type === 'flight' && 'Book Flights'}
                        {type === 'hotel' && 'Book Hotels'}
                        {type === 'bus' && 'Book Buses'}
                        {type === 'train' && 'Book Trains'}
                        {type === 'cab' && 'Book Cabs'}
                        {type === 'holiday' && 'Holiday Packages'}
                    </div>

                    {type === 'flight' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('oneWay', 'One Way', 'flightType')}
                            {renderRadioOption('roundTrip', 'Round Trip', 'flightType')}
                            {renderRadioOption('multiCity', 'Multi City', 'flightType')}
                        </div>
                    )}
                    {type === 'cab' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('oneWay', 'One Way', 'cabType')}
                            {renderRadioOption('roundTrip', 'Round Trip', 'cabType')}
                            {renderRadioOption('hourly', 'Hourly Rentals', 'cabType')}
                            {renderRadioOption('airport', 'Airport Transfers', 'cabType')}
                        </div>
                    )}
                    {type === 'train' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('book', 'Book Tickets', 'trainType')}
                            {renderRadioOption('pnr', 'PNR Status', 'trainType')}
                            {renderRadioOption('liveStatus', 'Live Status', 'trainType')}
                        </div>
                    )}
                    {type === 'hotel' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('domestic', 'Domestic', 'hotelType')}
                            {renderRadioOption('international', 'International', 'hotelType')}
                            {renderRadioOption('group', 'Group Deals', 'hotelType')}
                        </div>
                    )}
                    {type === 'bus' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('ticket', 'Book Tickets', 'busType')}
                            {renderRadioOption('hire', 'Bus Hire', 'busType')}
                        </div>
                    )}
                    {type === 'holiday' && (
                        <div className="search-options" style={{ display: 'flex', gap: '12px' }}>
                            {renderRadioOption('domestic', 'Domestic', 'holidayType')}
                            {renderRadioOption('international', 'International', 'holidayType')}
                        </div>
                    )}
                </div>

                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-inputs-row">
                        {renderFields()}
                    </div>
                    <div className="search-btn-container">
                        <button type="submit" className="search-submit-btn">
                            SEARCH
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchForm;
