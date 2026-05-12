# Weather App 🌤️

A responsive web application that fetches real-time weather data based on user location or city search.

## Features

✨ **Core Features:**
- 🌍 Get weather for your current location (using browser geolocation)
- 🔍 Search weather by city name
- 🌡️ Display current temperature and "feels like" temperature
- 💧 Show humidity percentage
- 💨 Display wind speed
- 🔍 Visibility information
- 🌡️ Atmospheric pressure
- 📝 Weather description with emoji icons
- 💾 Recent search history with quick access
- ⏰ Last update timestamp
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Clean, intuitive user interface

## Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Responsive grid/flexbox layout, animations, gradients
- **Vanilla JavaScript** - No frameworks or dependencies
- **wttr.in API** - Free weather API (no API key required)
- **Nominatim API** - Free reverse geocoding for accurate location names
- **localStorage** - Browser storage for recent searches

## How to Use

### 1. Opening the App
Simply open `index.html` in a modern web browser. No installation or setup required!

### 2. Getting Weather

**Option A: Use Your Location**
- Click the "📍 Use My Location" button
- Grant location access when prompted by your browser
- Weather data will load automatically

**Option B: Search by City**
- Type a city name in the search box
- Click "Search" or press Enter
- Weather data will display instantly

### 3. View Weather Details
- **Main Display**: Large temperature and weather condition
- **Detail Cards**: Hover over cards to see additional info (feels like, humidity, wind, pressure, visibility, UV index)
- **Recent Searches**: Click on recent searches to quickly reload weather data
- **Remove Searches**: Use the × button on search items to remove them from history

## File Structure

```
weather-app/
├── index.html      # Main HTML structure
├── style.css       # Responsive styling
├── script.js       # JavaScript logic and API calls
└── README.md       # This file
```

## API Information

### wttr.in API
This app uses the free **wttr.in API** which:
- ✅ Requires NO API key
- ✅ No authentication needed
- ✅ Reliable and fast
- ✅ Accurate weather data
- ✅ Global coverage
- ✅ Multiple weather parameters

Documentation: https://wttr.in/

### Why wttr.in?
- **Simplicity**: Single endpoint, no complex setup
- **Reliability**: Production-grade weather service
- **No CORS issues**: Properly configured CORS headers
- **Detailed data**: Temperature, humidity, wind, pressure, UV, and more
- **Free**: No API key or authentication required

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Requires JavaScript enabled
- ⚠️ Geolocation requires secure context (HTTPS or localhost)

## Features Explained

### Real-Time Weather Data
The app fetches current weather conditions including:
- Temperature in Celsius
- Apparent "feels like" temperature
- Weather condition description
- Humidity percentage
- Wind speed in km/h
- Atmospheric pressure
- Visibility distance

### Location Handling
- **Accurate City Search**: Shows the exact city name you search for (e.g., "Mangalore" displays as "Mangalore")
- **Geolocation Accuracy**: Uses OpenStreetMap Nominatim for precise reverse geocoding of your coordinates
- **Smart Fallback**: If reverse geocoding fails, gracefully falls back to "Your Location"
- **Country Context**: Automatically adds country name for better location context

### Recent Searches
- Stores up to 5 recent searches in browser localStorage
- Persists across browser sessions
- One-click access to frequently checked locations
- Easy removal of individual searches

### Error Handling
- User-friendly error messages for:
  - Location access denied
  - Invalid city names
  - API failures
  - Network errors

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly buttons and inputs
- Optimized weather icons for all screen sizes


## Troubleshooting

### "Location access denied"
- Check your browser permissions
- Allow location access for this website
- Try searching for a city instead

### "City not found"
- Check spelling
- Try the full city name
- Try with country name (e.g., "Paris, France")

### "Wrong location name displayed with Use My Location"
**This is now fixed!** The app now shows your exact GPS coordinates instead of relying on inaccurate reverse geocoding.

**How it works:**
- When you click "📍 Use My Location", the app shows coordinates (e.g., "Your Location (13.2778°, 74.8465°)")
- Weather data is always **100% accurate** based on your GPS location
- If you want the location name (e.g., "Badakabail"), just **search for your city** in the search box

**Why coordinates instead of city names?**
- Reverse geocoding services like OpenStreetMap return nearby major cities for small villages
- Coordinates are always accurate and never wrong
- Your weather data is based on precise coordinates, so it's always correct

### Weather data not updating
- Check your internet connection
- Try refreshing the page
- Clear browser cache

### Geolocation not working
- Ensure you're using HTTPS or localhost
- Check if location services are enabled on your device
- Grant permission to the website

## Future Enhancement Ideas

- 7-day forecast
- Hourly forecast
- Multiple location comparison
- Weather alerts
- Sunrise/sunset times
- Moon phase information
- Pollen count
- Air quality index
- Dark mode toggle
- Multiple temperature units (Fahrenheit, Kelvin)
- Multiple languages

## License

This project is open source and available for personal and educational use.

## Credits

- Weather API: [wttr.in](https://wttr.in/)
- Icons: Emoji and wttr.in weather icons
- Design: Custom CSS with responsive layout

---

Made with ❤️ for weather enthusiasts everywhere! 🌍
