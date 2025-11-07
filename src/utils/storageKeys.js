// Together We Ride - Storage Keys
// AsyncStorage key constants for local caching

// Note: These are already defined in constants.js (STORAGE_KEYS)
// This file provides additional helper functions for storage operations

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Save data to AsyncStorage
 */
export const saveToStorage = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return { success: true };
  } catch (error) {
    console.error('Error saving to storage:', error);
    return { success: false, error: 'Failed to save data' };
  }
};

/**
 * Load data from AsyncStorage
 */
export const loadFromStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error('Error removing from storage:', error);
    return { success: false, error: 'Failed to remove data' };
  }
};

/**
 * Clear all app data from AsyncStorage
 */
export const clearAllStorage = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return { success: true };
  } catch (error) {
    console.error('Error clearing storage:', error);
    return { success: false, error: 'Failed to clear data' };
  }
};

/**
 * Check if onboarding is completed
 */
export const isOnboardingCompleted = async () => {
  const completed = await loadFromStorage(STORAGE_KEYS.ONBOARDING_COMPLETED);
  return completed === true;
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = async () => {
  return await saveToStorage(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
};

/**
 * Cache user profile
 */
export const cacheUserProfile = async (profile) => {
  return await saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
};

/**
 * Get cached user profile
 */
export const getCachedUserProfile = async () => {
  return await loadFromStorage(STORAGE_KEYS.USER_PROFILE);
};

/**
 * Cache rides
 */
export const cacheRides = async (rides) => {
  return await saveToStorage(STORAGE_KEYS.CACHED_RIDES, {
    rides,
    timestamp: new Date().getTime(),
  });
};

/**
 * Get cached rides
 */
export const getCachedRides = async () => {
  const cached = await loadFromStorage(STORAGE_KEYS.CACHED_RIDES);

  if (!cached) return null;

  // Check if cache is still valid (5 minutes)
  const now = new Date().getTime();
  const cacheAge = now - cached.timestamp;

  if (cacheAge > 5 * 60 * 1000) {
    // Cache expired
    return null;
  }

  return cached.rides;
};

/**
 * Cache impact data
 */
export const cacheImpact = async (impact) => {
  return await saveToStorage(STORAGE_KEYS.CACHED_IMPACT, {
    impact,
    timestamp: new Date().getTime(),
  });
};

/**
 * Get cached impact
 */
export const getCachedImpact = async () => {
  const cached = await loadFromStorage(STORAGE_KEYS.CACHED_IMPACT);

  if (!cached) return null;

  // Check if cache is still valid (30 seconds for impact data)
  const now = new Date().getTime();
  const cacheAge = now - cached.timestamp;

  if (cacheAge > 30 * 1000) {
    // Cache expired
    return null;
  }

  return cached.impact;
};

/**
 * Save last known location
 */
export const saveLastLocation = async (location) => {
  return await saveToStorage(STORAGE_KEYS.LAST_LOCATION, location);
};

/**
 * Get last known location
 */
export const getLastLocation = async () => {
  return await loadFromStorage(STORAGE_KEYS.LAST_LOCATION);
};

/**
 * Save activity preferences
 */
export const saveActivityPreferences = async (preferences) => {
  return await saveToStorage(STORAGE_KEYS.ACTIVITY_PREFERENCES, preferences);
};

/**
 * Get activity preferences
 */
export const getActivityPreferences = async () => {
  return await loadFromStorage(STORAGE_KEYS.ACTIVITY_PREFERENCES);
};

// Export storage keys for convenience
export { STORAGE_KEYS };

export default {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearAllStorage,
  isOnboardingCompleted,
  setOnboardingCompleted,
  cacheUserProfile,
  getCachedUserProfile,
  cacheRides,
  getCachedRides,
  cacheImpact,
  getCachedImpact,
  saveLastLocation,
  getLastLocation,
  saveActivityPreferences,
  getActivityPreferences,
  STORAGE_KEYS,
};
