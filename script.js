// Weather App using wttr.in API (reliable, no auth required)
const WEATHER_API = 'https://wttr.in'; // Reliable weather API

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMsg = document.getElementById('errorMsg');
const recentSearches = document.getElementById('recentSearches');
const searchesList = document.getElementById('searchesList');

// Constants
const STORAGE_KEY = 'weatherAppSearches';
const MAX_RECENT_SEARCHES = 5;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
locationBtn.addEventListener('click', handleLocationClick);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayRecentSearches();
});

// Handle search by city name
function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    fetchWeatherByCity(city);
}

// Handle location button click
function handleLocationClick() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
            hideLoading();
            if (err.code === 1) {
                showError('Location access denied. Please enable location permissions.');
            } else if (err.code === 2) {
                showError('Unable to retrieve your location. Please try again.');
            } else {
                showError('Error getting your location. Please try searching for a city instead.');
            }
        }
    );
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    showLoading();
    try {
        // Simple wttr.in API call - format=j1 returns JSON
        const url = `${WEATHER_API}/${encodeURIComponent(city)}?format=j1`;
        console.log('Searching for city:', city);
        
        const response = await fetch(url);

        if (!response.ok) {
            hideLoading();
            showError(`City "${city}" not found. Please check spelling.`);
            return;
        }

        const data = await response.json();
        console.log('API response received');
        
        // Validate response
        if (!data.current_condition || data.current_condition.length === 0) {
            hideLoading();
            showError('No weather data found for this location.');
            return;
        }

        // Use the EXACT city name user searched for, not nearest_area
        // This ensures searching "Mangalore" shows "Mangalore", not "Patadkal"
        const country = data.nearest_area?.[0]?.country?.[0]?.value || '';
        const fullLocation = country ? `${city}, ${country}` : city;
        
        console.log('Display location:', fullLocation);

        processWeatherData(data, fullLocation);
        addToRecentSearches(fullLocation);
        hideLoading();
        hideError();
    } catch (err) {
        hideLoading();
        console.error('Fetch error:', err);
        showError('Failed to fetch weather data. Please try again.');
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(latitude, longitude) {
    showLoading();
    console.log('Location coordinates:', latitude, longitude);
    
    try {
        // First, try to get location name using Nominatim with better parameters
        let locationName = 'Your Location';
        try {
            // Use reverse geocoding with zoom 18 (maximum detail for small villages)
            const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`;
            const reverseResponse = await fetch(reverseUrl);
            
            if (reverseResponse.ok) {
                const geoData = await reverseResponse.json();
                const address = geoData.address || {};
                
                // Priority: village > hamlet > town > suburb > city
                const name = address.village || 
                            address.hamlet || 
                            address.town || 
                            address.suburb ||
                            address.city || 
                            address.county;
                
                if (name) {
                    const state = address.state || '';
                    if (state && state !== name) {
                        locationName = `${name}, ${state}`;
                    } else {
                        locationName = name;
                    }
                    console.log('Reverse geocoding found:', locationName);
                }
            }
        } catch (geoErr) {
            console.warn('Reverse geocoding error (will try fallback):', geoErr);
        }

        // Fetch weather using coordinates
        const url = `${WEATHER_API}/${latitude},${longitude}?format=j1`;
        console.log('Fetching weather for coordinates');
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.current_condition || data.current_condition.length === 0) {
            throw new Error('Invalid weather data');
        }

        // If reverse geocoding didn't find a name, try extracting from wttr.in data
        if (locationName === 'Your Location') {
            try {
                const areaName = data.nearest_area?.[0]?.areaName?.[0]?.value;
                const region = data.nearest_area?.[0]?.region?.[0]?.value;
                
                if (areaName) {
                    locationName = region && region !== areaName ? 
                        `${areaName}, ${region}` : 
                        areaName;
                    console.log('Using wttr.in location:', locationName);
                }
            } catch (e) {
                console.warn('Could not extract location from wttr.in');
            }
        }
        
        console.log('Final location:', locationName);

        processWeatherData(data, locationName);
        addToRecentSearches(locationName);
        hideLoading();
        hideError();
    } catch (err) {
        hideLoading();
        console.error('Fetch error:', err);
        showError('Failed to fetch weather data for your location. Try searching for your city instead.');
    }
}

// Display weather information
function processWeatherData(data, locationName) {
    console.log('Processing weather data for location:', locationName);
    
    const current = data.current_condition[0];
    
    // Extract weather information
    const temp = Math.round(current.temp_C);
    const feelsLike = Math.round(current.FeelsLikeC);
    const humidity = current.humidity;
    const windSpeed = Math.round(current.windspeedKmph);
    const pressure = Math.round(current.pressure);
    const visibility = Math.round(current.visibility);
    const description = current.weatherDesc?.[0]?.value || 'Unknown';
    const iconUrl = current.weatherIconUrl?.[0]?.value || '';

    // Update location
    document.getElementById('locationName').textContent = locationName;
    console.log('Updated DOM with location:', locationName);

    // Update timestamp
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${now.toLocaleTimeString()}`;

    // Update temperature
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('description').textContent = description;
    
    // Use wttr.in weather icon or emoji fallback
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherEmoji = document.getElementById('weatherEmoji');
    if (iconUrl) {
        weatherIcon.src = 'https:' + iconUrl;
        weatherIcon.alt = description;
        weatherIcon.classList.remove('hidden');
        weatherEmoji.classList.add('hidden');
    } else {
        weatherIcon.classList.add('hidden');
        weatherEmoji.textContent = getWeatherIconEmoji(description);
        weatherEmoji.classList.remove('hidden');
    }

    // Update detail cards
    document.getElementById('feelsLike').textContent = `${feelsLike}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${pressure} hPa`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    document.getElementById('uvIndex').textContent = estimateUVIndex(data);

    // Show weather display
    weatherDisplay.classList.remove('hidden');
}

// Get weather description from WMO code
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy with rime',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with hail'
    };
    return descriptions[code] || 'Unknown';
}

// Get weather emoji based on description
function getWeatherIconEmoji(description) {
    const desc = description.toLowerCase();
    
    const icons = {
        'clear': '☀️',
        'sunny': '☀️',
        'partly cloudy': '⛅',
        'cloudy': '☁️',
        'overcast': '☁️',
        'mist': '🌫️',
        'fog': '🌫️',
        'rain': '🌧️',
        'drizzle': '🌧️',
        'snow': '❄️',
        'sleet': '🌨️',
        'hail': '⛈️',
        'thunderstorm': '⛈️',
        'patchy rain': '🌦️',
        'moderate rain': '🌧️',
        'heavy rain': '⛈️',
    };

    for (const [key, emoji] of Object.entries(icons)) {
        if (desc.includes(key)) {
            return emoji;
        }
    }

    return '🌤️';
}

// Estimate UV Index from weather conditions
function estimateUVIndex(data) {
    const current = data.current_condition[0];
    const desc = current.weatherDesc?.[0]?.value?.toLowerCase() || '';
    
    // Simple estimation based on cloud cover
    const cloudCover = current.cloudcover || 0;
    
    if (desc.includes('clear') || desc.includes('sunny')) {
        return 'Very High';
    } else if (cloudCover < 30) {
        return 'High';
    } else if (cloudCover < 70) {
        return 'Moderate';
    } else {
        return 'Low';
    }
}

// Get UV Index display (legacy - kept for compatibility)
function getUVIndexFromWeatherCode(code) {
    // Simplified UV index based on weather conditions
    if (code === 0 || code === 1) return 'High';
    if (code === 2) return 'Moderate';
    if (code === 3) return 'Low';
    if (code >= 45) return 'Low';
    return 'Moderate';
}

// Recent searches management
function addToRecentSearches(location) {
    let searches = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Remove if already exists
    searches = searches.filter(s => s !== location);
    
    // Add to beginning
    searches.unshift(location);
    
    // Keep only max
    searches = searches.slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    displayRecentSearches();
}

function displayRecentSearches() {
    const searches = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    if (searches.length === 0) {
        recentSearches.classList.add('hidden');
        return;
    }

    searchesList.innerHTML = '';
    searches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `
            <span>${search}</span>
            <button class="search-item-remove" title="Remove">×</button>
        `;

        item.querySelector('span').addEventListener('click', () => {
            searchInput.value = search;
            fetchWeatherByCity(search);
        });

        item.querySelector('.search-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromRecentSearches(search);
        });

        searchesList.appendChild(item);
    });

    recentSearches.classList.remove('hidden');
}

function removeFromRecentSearches(location) {
    let searches = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    searches = searches.filter(s => s !== location);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    displayRecentSearches();
}

// UI State Management
function showLoading() {
    loading.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    error.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMsg.textContent = message;
    error.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}

function hideError() {
    error.classList.add('hidden');
}
