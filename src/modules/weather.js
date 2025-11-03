/**
 * Weather Module
 * Handles Skycons weather icon animations
 * Already modern JavaScript - extracted from init.js
 */

/**
 * Initialize Skycons weather icons
 * Modern JavaScript implementation
 */
export function initializeSkycons() {
  if (typeof window.Skycons === 'undefined') {
    console.warn('⚠️ Skycons library not available');
    return;
  }

  try {
    const skycons = new window.Skycons({ color: '#73879C' });

    // Index.html specific weather icons (actual IDs from the HTML)
    const weatherIcons = [
      { id: 'partly-cloudy-day', type: window.Skycons.PARTLY_CLOUDY_DAY },
      { id: 'clear-day', type: window.Skycons.CLEAR_DAY },
      { id: 'rain', type: window.Skycons.RAIN },
      { id: 'snow', type: window.Skycons.SNOW },
      { id: 'sleet', type: window.Skycons.SLEET },
      { id: 'wind', type: window.Skycons.WIND },
      { id: 'cloudy', type: window.Skycons.CLOUDY }
    ];

    let initializedCount = 0;

    weatherIcons.forEach(icon => {
      const element = document.getElementById(icon.id);
      if (element) {
        skycons.add(element, icon.type);
        initializedCount++;
        console.log(`✅ Skycon initialized: ${icon.id}`);
      }
    });

    // Legacy support: Temperature widget (if exists)
    const tempElement = document.getElementById('canvas-temperature');
    if (tempElement) {
      skycons.add(tempElement, window.Skycons.PARTLY_CLOUDY_DAY);
      initializedCount++;
    }

    // Legacy support: Humidity widget (if exists)
    const humidityElement = document.getElementById('canvas-humidity');
    if (humidityElement) {
      skycons.add(humidityElement, window.Skycons.CLOUDY);
      initializedCount++;
    }

    // Legacy support: Wind widget (if exists)
    const windElement = document.getElementById('canvas-wind');
    if (windElement) {
      skycons.add(windElement, window.Skycons.WIND);
      initializedCount++;
    }

    // Legacy support: Rain widget (if exists)
    const rainElement = document.getElementById('canvas-rain');
    if (rainElement) {
      skycons.add(rainElement, window.Skycons.RAIN);
      initializedCount++;
    }

    // Generic weather icons with data attributes
    document.querySelectorAll('[data-weather]').forEach(element => {
      const weatherType = element.getAttribute('data-weather').toUpperCase();
      if (window.Skycons[weatherType]) {
        skycons.add(element, window.Skycons[weatherType]);
        initializedCount++;
      }
    });

    if (initializedCount > 0) {
      // Start the animation
      skycons.play();
      console.log(`✅ ${initializedCount} Skycons weather icons initialized and animated`);
    } else {
      console.log('ℹ️ No weather icon elements found on this page');
    }

    // Return skycons instance for external control
    return skycons;
  } catch (error) {
    console.error('❌ Failed to initialize Skycons:', error);
  }
}

/**
 * Weather Data Simulation
 * For demonstration purposes - replace with real API calls
 */
export function simulateWeatherData() {
  const weatherData = {
    temperature: Math.round(Math.random() * 30 + 10) + '°C',
    humidity: Math.round(Math.random() * 50 + 30) + '%',
    windSpeed: Math.round(Math.random() * 20 + 5) + ' km/h',
    rainfall: Math.round(Math.random() * 10) + ' mm'
  };

  // Update weather displays if they exist
  const tempDisplay = document.querySelector('[data-weather-temp]');
  if (tempDisplay) {
    tempDisplay.textContent = weatherData.temperature;
  }

  const humidityDisplay = document.querySelector('[data-weather-humidity]');
  if (humidityDisplay) {
    humidityDisplay.textContent = weatherData.humidity;
  }

  const windDisplay = document.querySelector('[data-weather-wind]');
  if (windDisplay) {
    windDisplay.textContent = weatherData.windSpeed;
  }

  const rainDisplay = document.querySelector('[data-weather-rain]');
  if (rainDisplay) {
    rainDisplay.textContent = weatherData.rainfall;
  }

  return weatherData;
}

/**
 * Weather API Integration Helper
 * Template for real weather API integration
 */
export async function fetchWeatherData(location = 'New York') {
  try {
    // Replace with your weather API endpoint
    // const response = await fetch(`https://api.weather.com/current?location=${location}`);
    // const data = await response.json();

    // For now, return simulated data
    return simulateWeatherData();
  } catch (error) {
    console.error('❌ Failed to fetch weather data:', error);
    return simulateWeatherData(); // Fallback to simulated data
  }
}

// Auto-initialize when module loads (only if weather elements exist)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const weatherElements = document.querySelectorAll(
      '.weather-icon, [data-weather], ' +
        '#canvas-temperature, #canvas-humidity, #canvas-wind, #canvas-rain, ' +
        '#partly-cloudy-day, #clear-day, #rain, #snow, #sleet, #wind, #cloudy'
    );
    if (weatherElements.length > 0) {
      initializeSkycons();
    }
  });
}
