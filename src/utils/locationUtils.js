// Together We Ride - Location Utilities
// Location and distance calculation helpers

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // in km
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * Example: 1.5 km or 0.8 km
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 0.1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }

  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Format speed for display
 * Example: 25.5 km/h
 */
export const formatSpeed = (speedKmh) => {
  return `${speedKmh.toFixed(1)} km/h`;
};

/**
 * Format pace for display (min/km)
 * Example: 5:30 min/km
 */
export const formatPace = (minPerKm) => {
  const minutes = Math.floor(minPerKm);
  const seconds = Math.round((minPerKm - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
};

/**
 * Calculate bearing between two points
 * Returns bearing in degrees (0-360)
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

  const bearing = Math.atan2(y, x);
  return (toDegrees(bearing) + 360) % 360;
};

/**
 * Convert radians to degrees
 */
const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Get compass direction from bearing
 * Returns: N, NE, E, SE, S, SW, W, NW
 */
export const getCompassDirection = (bearing) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

/**
 * Calculate center point of multiple coordinates
 */
export const calculateCenter = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  let sumLat = 0;
  let sumLng = 0;

  coordinates.forEach((coord) => {
    sumLat += coord.lat || coord.latitude || 0;
    sumLng += coord.lng || coord.longitude || 0;
  });

  return {
    lat: sumLat / coordinates.length,
    lng: sumLng / coordinates.length,
  };
};

/**
 * Calculate bounding box for coordinates
 */
export const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  coordinates.forEach((coord) => {
    const lat = coord.lat || coord.latitude;
    const lng = coord.lng || coord.longitude;

    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return {
    northEast: { lat: maxLat, lng: maxLng },
    southWest: { lat: minLat, lng: minLng },
  };
};

/**
 * Check if coordinate is valid
 */
export const isValidCoordinate = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Get default map region for React Native Maps
 */
export const getDefaultRegion = () => {
  return {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
};

/**
 * Convert route coordinates to region for map
 */
export const getRegionForCoordinates = (coordinates, paddingPercent = 0.1) => {
  if (!coordinates || coordinates.length === 0) {
    return getDefaultRegion();
  }

  const bounds = calculateBounds(coordinates);

  if (!bounds) {
    return getDefaultRegion();
  }

  const latDelta = Math.abs(bounds.northEast.lat - bounds.southWest.lat) * (1 + paddingPercent);
  const lngDelta = Math.abs(bounds.northEast.lng - bounds.southWest.lng) * (1 + paddingPercent);
  const center = calculateCenter([bounds.northEast, bounds.southWest]);

  return {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

export default {
  calculateDistance,
  formatDistance,
  formatSpeed,
  formatPace,
  calculateBearing,
  getCompassDirection,
  calculateCenter,
  calculateBounds,
  isValidCoordinate,
  getDefaultRegion,
  getRegionForCoordinates,
};
