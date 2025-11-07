// Together We Ride - Location Service
// Handles GPS tracking for rides and solo activities

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { LOCATION } from '../config/constants';

// ══════════════════════════════════════════════════════════════
// LOCATION TRACKING
// ══════════════════════════════════════════════════════════════

/**
 * Update user's live location during active ride/activity
 * This creates/updates a document that auto-expires after 24 hours
 */
export const updateLiveLocation = async (
  activityId,
  userId,
  userName,
  userAvatar,
  locationData,
  activityType = 'ride'
) => {
  try {
    const { latitude, longitude, speed = 0, heading = 0, accuracy = 0 } = locationData;

    // Calculate TTL (24 hours from now)
    const ttl = new Date();
    ttl.setHours(ttl.getHours() + 24);

    const locationDoc = {
      activityId,
      userId,
      userName,
      userAvatar: userAvatar || null,
      activityType,

      lat: latitude,
      lng: longitude,
      speed: speed * 3.6, // Convert m/s to km/h
      heading,
      accuracy,

      distanceCovered: 0, // Will be updated by client during tracking
      sessionsGenerated: 0, // Will be updated by client during tracking

      updatedAt: serverTimestamp(),
      ttl, // Firestore TTL policy will auto-delete after this time
    };

    // Use composite key: activityId_userId
    const docId = `${activityId}_${userId}`;

    await setDoc(doc(db, COLLECTIONS.LIVE_LOCATIONS, docId), locationDoc, { merge: true });

    return {
      success: true,
      locationId: docId,
    };
  } catch (error) {
    console.error('Error updating live location:', error);
    return {
      success: false,
      error: 'Failed to update location',
    };
  }
};

/**
 * Update distance and impact during tracking
 */
export const updateTrackingProgress = async (
  activityId,
  userId,
  distanceCovered,
  sessionsGenerated
) => {
  try {
    const docId = `${activityId}_${userId}`;

    await setDoc(
      doc(db, COLLECTIONS.LIVE_LOCATIONS, docId),
      {
        distanceCovered,
        sessionsGenerated,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating tracking progress:', error);
    return { success: false, error: 'Failed to update progress' };
  }
};

/**
 * Stop tracking and remove live location
 */
export const stopTracking = async (activityId, userId) => {
  try {
    const docId = `${activityId}_${userId}`;
    await deleteDoc(doc(db, COLLECTIONS.LIVE_LOCATIONS, docId));

    return {
      success: true,
      message: 'Tracking stopped',
    };
  } catch (error) {
    console.error('Error stopping tracking:', error);
    return {
      success: false,
      error: 'Failed to stop tracking',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// GET LIVE LOCATIONS
// ══════════════════════════════════════════════════════════════

/**
 * Get all live locations for an activity (ride or solo)
 */
export const getLiveLocations = async (activityId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.LIVE_LOCATIONS),
      where('activityId', '==', activityId)
    );

    const querySnapshot = await getDocs(q);
    const locations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      locations,
    };
  } catch (error) {
    console.error('Error getting live locations:', error);
    return {
      success: false,
      error: 'Failed to load locations',
      locations: [],
    };
  }
};

/**
 * Get a user's current live location
 */
export const getUserLiveLocation = async (activityId, userId) => {
  try {
    const docId = `${activityId}_${userId}`;
    const locationDoc = await getDoc(doc(db, COLLECTIONS.LIVE_LOCATIONS, docId));

    if (locationDoc.exists()) {
      return {
        success: true,
        location: { id: locationDoc.id, ...locationDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Location not found',
      };
    }
  } catch (error) {
    console.error('Error getting user location:', error);
    return {
      success: false,
      error: 'Failed to load location',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to live locations for an activity (real-time tracking)
 */
export const subscribeToLiveLocations = (activityId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.LIVE_LOCATIONS),
    where('activityId', '==', activityId)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const locations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(locations);
    },
    (error) => {
      console.error('Error subscribing to live locations:', error);
      callback([]);
    }
  );
};

/**
 * Subscribe to a single user's live location
 */
export const subscribeToUserLocation = (activityId, userId, callback) => {
  const docId = `${activityId}_${userId}`;

  return onSnapshot(
    doc(db, COLLECTIONS.LIVE_LOCATIONS, docId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to user location:', error);
      callback(null);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// LOCATION UTILITIES
// ══════════════════════════════════════════════════════════════

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
 * Calculate total distance from a route (array of coordinates)
 */
export const calculateRouteDistance = (route) => {
  if (!route || route.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const point1 = route[i];
    const point2 = route[i + 1];

    totalDistance += calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);
  }

  return totalDistance;
};

/**
 * Calculate speed from distance and duration
 */
export const calculateSpeed = (distanceKm, durationSeconds) => {
  if (durationSeconds === 0) return 0;
  const hours = durationSeconds / 3600;
  return distanceKm / hours; // km/h
};

/**
 * Format GPS accuracy level
 */
export const getAccuracyLevel = (accuracy) => {
  if (accuracy <= LOCATION.ACCURACY_EXCELLENT) return 'excellent';
  if (accuracy <= LOCATION.ACCURACY_GOOD) return 'good';
  if (accuracy <= LOCATION.ACCURACY_FAIR) return 'fair';
  return 'poor';
};

/**
 * Check if GPS accuracy is acceptable
 */
export const isAccuracyAcceptable = (accuracy) => {
  return accuracy <= LOCATION.ACCURACY_FAIR;
};

/**
 * Validate GPS coordinates
 */
export const validateCoordinates = (latitude, longitude) => {
  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Invalid latitude' };
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Invalid longitude' };
  }

  return { valid: true };
};

/**
 * Reverse geocode coordinates to address (placeholder)
 * In production, use a geocoding service like Google Maps or Mapbox
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Placeholder - in production, call geocoding API
    // For example: Google Maps Geocoding API or Expo Location.reverseGeocodeAsync

    return {
      success: true,
      address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      success: false,
      address: 'Unknown location',
    };
  }
};

/**
 * Check if user is moving (based on speed)
 */
export const isMoving = (speed) => {
  return speed >= LOCATION.MIN_SPEED_THRESHOLD;
};

/**
 * Detect if activity should be auto-paused
 */
export const shouldAutoPause = (lastUpdateTime) => {
  const now = new Date().getTime();
  const timeSinceLastUpdate = now - lastUpdateTime;

  return timeSinceLastUpdate >= LOCATION.AUTO_PAUSE_THRESHOLD;
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  updateLiveLocation,
  updateTrackingProgress,
  stopTracking,
  getLiveLocations,
  getUserLiveLocation,
  subscribeToLiveLocations,
  subscribeToUserLocation,
  calculateDistance,
  calculateRouteDistance,
  calculateSpeed,
  getAccuracyLevel,
  isAccuracyAcceptable,
  validateCoordinates,
  reverseGeocode,
  isMoving,
  shouldAutoPause,
};
