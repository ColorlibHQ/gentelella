/**
 * Maps Module
 * Handles Leaflet map initialization and customization
 * Already modern JavaScript - extracted from init.js
 */

/**
 * Initialize basic Leaflet maps
 * Modern JavaScript implementation
 */
export function initializeMaps() {
  if (typeof L === 'undefined') {
    console.warn('⚠️ Leaflet library not available');
    return;
  }

  const maps = [];

  // Initialize all map containers
  document.querySelectorAll('[data-map], .leaflet-map').forEach(mapElement => {
    try {
      const mapId = mapElement.id || 'map_' + Date.now();
      if (!mapElement.id) {
        mapElement.id = mapId;
      }

      // Get configuration from data attributes
      const lat = parseFloat(mapElement.getAttribute('data-lat')) || 40.7128;
      const lng = parseFloat(mapElement.getAttribute('data-lng')) || -74.006;
      const zoom = parseInt(mapElement.getAttribute('data-zoom')) || 13;
      const markerTitle = mapElement.getAttribute('data-marker') || 'Location';

      // Create map instance
      const map = L.map(mapId).setView([lat, lng], zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker if requested
      if (mapElement.getAttribute('data-marker') !== 'false') {
        const marker = L.marker([lat, lng]).addTo(map);
        if (markerTitle) {
          marker.bindPopup(markerTitle);
        }
      }

      // Store map reference
      maps.push({ id: mapId, map, element: mapElement });

      console.log(`✅ Map initialized: ${mapId}`);
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
    }
  });

  // Specific map implementations
  initializeLocationMap();
  initializeContactMap();
  initializeWorldMapGDP();

  return maps;
}

/**
 * Location/Office Map (if element exists)
 */
function initializeLocationMap() {
  const locationMapElement = document.getElementById('locationMap');
  if (!locationMapElement) {
    return;
  }

  try {
    // Office location coordinates (example: New York)
    const officeLocation = [40.7128, -74.006];

    const locationMap = L.map('locationMap').setView(officeLocation, 15);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(locationMap);

    // Add office marker
    const officeMarker = L.marker(officeLocation).addTo(locationMap);
    officeMarker.bindPopup('<b>Our Office</b><br>123 Business Street<br>New York, NY 10001');

    // Custom map styling
    locationMapElement.style.height = '400px';
    locationMapElement.style.borderRadius = '8px';

    console.log('✅ Location map initialized');
  } catch (error) {
    console.error('❌ Failed to initialize location map:', error);
  }
}

/**
 * World Map GDP - Index Dashboard Map (if element exists)
 */
function initializeWorldMapGDP() {
  const worldMapElement = document.getElementById('world-map-gdp');
  if (!worldMapElement) {
    return;
  }

  // Check if map is already initialized
  if (worldMapElement._leaflet_id) {
    console.log('World GDP map already initialized, skipping...');
    return;
  }

  try {
    // World map centered on a global view
    const worldCenter = [20, 0]; // Centered globally

    const worldMap = L.map('world-map-gdp').setView(worldCenter, 2);

    // Add tile layer with a nice style for world view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 1
    }).addTo(worldMap);

    // Sample GDP/visitor data markers for major cities
    const gdpLocations = [
      { lat: 40.7128, lng: -74.006, city: 'New York', visitors: '2.1M', gdp: '$1.8T' },
      { lat: 51.5074, lng: -0.1278, city: 'London', visitors: '1.8M', gdp: '$0.9T' },
      { lat: 35.6762, lng: 139.6503, city: 'Tokyo', visitors: '1.5M', gdp: '$4.9T' },
      { lat: 48.8566, lng: 2.3522, city: 'Paris', visitors: '1.2M', gdp: '$0.7T' },
      { lat: 37.7749, lng: -122.4194, city: 'San Francisco', visitors: '0.8M', gdp: '$0.5T' },
      { lat: -33.8688, lng: 151.2093, city: 'Sydney', visitors: '0.7M', gdp: '$0.4T' },
      { lat: 55.7558, lng: 37.6176, city: 'Moscow', visitors: '0.6M', gdp: '$1.8T' }
    ];

    // Add markers for each location
    gdpLocations.forEach(location => {
      const marker = L.marker([location.lat, location.lng]).addTo(worldMap);

      marker.bindPopup(`
        <div style="text-align: center; min-width: 150px;">
          <h6 style="margin-bottom: 8px; color: #26B99A;">${location.city}</h6>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Visitors:</strong> ${location.visitors}<br>
            <strong>GDP:</strong> ${location.gdp}
          </p>
          <small style="color: #666;">Click marker for details</small>
        </div>
      `);

      // Add custom marker styling
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
    });

    // Disable zoom control for cleaner dashboard look
    worldMap.zoomControl.setPosition('topright');

    // Set max bounds to prevent excessive panning
    const bounds = L.latLngBounds([
      [-85, -180],
      [85, 180]
    ]);
    worldMap.setMaxBounds(bounds);

    console.log('✅ World GDP map initialized');
    return worldMap;
  } catch (error) {
    console.error('❌ Failed to initialize world GDP map:', error);
  }
}

/**
 * Contact Page Map (if element exists)
 */
function initializeContactMap() {
  const contactMapElement = document.getElementById('contactMap');
  if (!contactMapElement) {
    return;
  }

  try {
    // Contact location coordinates
    const contactLocation = [40.7589, -73.9851]; // Times Square example

    const contactMap = L.map('contactMap').setView(contactLocation, 14);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(contactMap);

    // Add contact marker
    const contactMarker = L.marker(contactLocation).addTo(contactMap);
    contactMarker.bindPopup(`
      <div style="text-align: center;">
        <h6>Contact Us</h6>
        <p>Visit us at our location</p>
        <button onclick="window.open('https://maps.google.com?q=${contactLocation[0]},${contactLocation[1]}', '_blank')" 
                class="btn btn-sm btn-primary">
          Get Directions
        </button>
      </div>
    `);

    // Disable zoom control for cleaner look
    contactMap.zoomControl.setPosition('topright');

    console.log('✅ Contact map initialized');
  } catch (error) {
    console.error('❌ Failed to initialize contact map:', error);
  }
}

/**
 * Interactive Map with Multiple Markers
 * For locations/branches listing
 */
export function initializeMultiLocationMap(locations = []) {
  const mapElement = document.getElementById('multiLocationMap');
  if (!mapElement) {
    return;
  }

  try {
    // Default locations if none provided
    const defaultLocations = [
      {
        lat: 40.7128,
        lng: -74.006,
        title: 'New York Office',
        popup: 'Main Office<br>New York, NY'
      },
      {
        lat: 34.0522,
        lng: -118.2437,
        title: 'Los Angeles Office',
        popup: 'West Coast Office<br>Los Angeles, CA'
      },
      {
        lat: 41.8781,
        lng: -87.6298,
        title: 'Chicago Office',
        popup: 'Midwest Office<br>Chicago, IL'
      }
    ];

    const mapLocations = locations.length > 0 ? locations : defaultLocations;

    // Calculate center point
    const centerLat = mapLocations.reduce((sum, loc) => sum + loc.lat, 0) / mapLocations.length;
    const centerLng = mapLocations.reduce((sum, loc) => sum + loc.lng, 0) / mapLocations.length;

    const multiMap = L.map('multiLocationMap').setView([centerLat, centerLng], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(multiMap);

    // Add markers for each location
    mapLocations.forEach(location => {
      const marker = L.marker([location.lat, location.lng]).addTo(multiMap);
      if (location.popup) {
        marker.bindPopup(location.popup);
      }
    });

    // Fit map to show all markers
    const group = new L.featureGroup(
      multiMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          return layer;
        }
      })
    );
    multiMap.fitBounds(group.getBounds().pad(0.1));

    console.log('✅ Multi-location map initialized');
    return multiMap;
  } catch (error) {
    console.error('❌ Failed to initialize multi-location map:', error);
  }
}

/**
 * Map Utility Functions
 */
export const MapUtils = {
  /**
   * Convert address to coordinates (requires geocoding service)
   */
  async geocode(address) {
    try {
      // This would typically use a geocoding service
      console.log(`Geocoding address: ${address}`);
      // Return mock coordinates for now
      return { lat: 40.7128, lng: -74.006 };
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  },

  /**
   * Calculate distance between two points
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  },

  /**
   * Add custom map controls
   */
  addCustomControls(map) {
    // Custom zoom control
    const customZoom = L.control.zoom({
      position: 'topright'
    });
    customZoom.addTo(map);

    // Custom scale control
    L.control
      .scale({
        position: 'bottomright'
      })
      .addTo(map);

    return { zoom: customZoom };
  }
};

// Auto-initialize maps when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const mapElements = document.querySelectorAll(
      '[data-map], .leaflet-map, #locationMap, #contactMap, #multiLocationMap, #world-map-gdp'
    );
    if (mapElements.length > 0) {
      initializeMaps();
    }
  });
}
