// Together We Ride - Activity Utilities
// Helper functions for activity types and stats

import {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_ICONS,
  ACTIVITY_TYPE_COLORS,
} from '../config/constants';

/**
 * Get activity type label
 */
export const getActivityLabel = (activityType) => {
  return ACTIVITY_TYPE_LABELS[activityType] || 'Unknown';
};

/**
 * Get activity type icon
 */
export const getActivityIcon = (activityType) => {
  return ACTIVITY_TYPE_ICONS[activityType] || 'help-circle';
};

/**
 * Get activity type color
 */
export const getActivityColor = (activityType) => {
  return ACTIVITY_TYPE_COLORS[activityType] || '#6200ee';
};

/**
 * Format pace based on activity type
 * Cycling: km/h
 * Walking/Running/Wheeling: min/km
 */
export const formatPace = (pace, activityType) => {
  if (!pace || pace === 0) return '—';

  if (activityType === ACTIVITY_TYPES.CYCLING) {
    return `${pace.toFixed(1)} km/h`;
  } else {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
  }
};

/**
 * Calculate pace from distance and duration
 */
export const calculatePace = (distanceKm, durationSeconds, activityType) => {
  if (distanceKm === 0 || durationSeconds === 0) return 0;

  const hours = durationSeconds / 3600;

  if (activityType === ACTIVITY_TYPES.CYCLING) {
    // km/h for cycling
    return parseFloat((distanceKm / hours).toFixed(1));
  } else {
    // min/km for walking/running/wheeling
    const minutes = durationSeconds / 60;
    return parseFloat((minutes / distanceKm).toFixed(1));
  }
};

/**
 * Calculate speed (always km/h)
 */
export const calculateSpeed = (distanceKm, durationSeconds) => {
  if (durationSeconds === 0) return 0;
  const hours = durationSeconds / 3600;
  return parseFloat((distanceKm / hours).toFixed(1));
};

/**
 * Calculate calories burned (estimation)
 * Very rough estimates based on activity type and distance
 */
export const estimateCaloriesBurned = (distanceKm, activityType, userWeight = 70) => {
  // Calories per km per kg of body weight (rough estimates)
  const caloriesPerKmPerKg = {
    [ACTIVITY_TYPES.CYCLING]: 0.5,
    [ACTIVITY_TYPES.WALKING]: 0.7,
    [ACTIVITY_TYPES.WHEELING]: 0.8,
    [ACTIVITY_TYPES.RUNNING]: 1.0,
  };

  const rate = caloriesPerKmPerKg[activityType] || 0.6;
  return Math.round(distanceKm * userWeight * rate);
};

/**
 * Get activity type emoji
 */
export const getActivityEmoji = (activityType) => {
  const emojis = {
    [ACTIVITY_TYPES.CYCLING]: '🚴',
    [ACTIVITY_TYPES.WALKING]: '🚶',
    [ACTIVITY_TYPES.WHEELING]: '♿',
    [ACTIVITY_TYPES.RUNNING]: '🏃',
  };

  return emojis[activityType] || '🏋️';
};

/**
 * Get all activity types as options
 */
export const getActivityTypeOptions = () => {
  return Object.values(ACTIVITY_TYPES).map((type) => ({
    value: type,
    label: getActivityLabel(type),
    icon: getActivityIcon(type),
    color: getActivityColor(type),
    emoji: getActivityEmoji(type),
  }));
};

/**
 * Validate activity data
 */
export const validateActivity = (activity) => {
  const errors = [];

  if (!activity.type) {
    errors.push('Activity type is required');
  }

  if (!activity.distance || activity.distance <= 0) {
    errors.push('Distance must be greater than 0');
  }

  if (!activity.duration || activity.duration <= 0) {
    errors.push('Duration must be greater than 0');
  }

  // Check for unrealistic speeds
  const speed = calculateSpeed(activity.distance, activity.duration);
  const maxSpeeds = {
    [ACTIVITY_TYPES.CYCLING]: 60,
    [ACTIVITY_TYPES.WALKING]: 8,
    [ACTIVITY_TYPES.WHEELING]: 15,
    [ACTIVITY_TYPES.RUNNING]: 25,
  };

  const maxSpeed = maxSpeeds[activity.type] || 60;

  if (speed > maxSpeed) {
    errors.push(`Speed (${speed.toFixed(1)} km/h) is unrealistically high for this activity`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Format activity summary
 */
export const formatActivitySummary = (activity) => {
  const label = getActivityLabel(activity.type);
  const emoji = getActivityEmoji(activity.type);
  const distance = activity.distance.toFixed(1);

  return `${emoji} ${label} • ${distance} km`;
};

/**
 * Get activity stats summary
 */
export const getActivityStats = (activities) => {
  const stats = {
    total: activities.length,
    totalDistance: 0,
    totalDuration: 0,
    totalSessions: 0,
    byType: {
      [ACTIVITY_TYPES.CYCLING]: { count: 0, distance: 0 },
      [ACTIVITY_TYPES.WALKING]: { count: 0, distance: 0 },
      [ACTIVITY_TYPES.WHEELING]: { count: 0, distance: 0 },
      [ACTIVITY_TYPES.RUNNING]: { count: 0, distance: 0 },
    },
  };

  activities.forEach((activity) => {
    stats.totalDistance += activity.distance || 0;
    stats.totalDuration += activity.duration || 0;
    stats.totalSessions += activity.youthSessionsGenerated || 0;

    if (stats.byType[activity.type]) {
      stats.byType[activity.type].count++;
      stats.byType[activity.type].distance += activity.distance || 0;
    }
  });

  return stats;
};

export default {
  getActivityLabel,
  getActivityIcon,
  getActivityColor,
  formatPace,
  calculatePace,
  calculateSpeed,
  estimateCaloriesBurned,
  getActivityEmoji,
  getActivityTypeOptions,
  validateActivity,
  formatActivitySummary,
  getActivityStats,
};
