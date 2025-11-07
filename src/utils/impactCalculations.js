// Together We Ride - Impact Calculation Utilities
// Helper functions for impact-related calculations

import { calculateYouthSessions, calculateImpactValue } from '../config/impactConfig';

/**
 * Calculate impact for a distance
 */
export const calculateImpact = (distanceKm, activityType, sponsorMultiplier = 1) => {
  const sessions = calculateYouthSessions(distanceKm, activityType, sponsorMultiplier);
  const value = calculateImpactValue(sessions);

  return {
    sessions: Math.round(sessions * 10) / 10,
    value: Math.round(value * 100) / 100,
  };
};

/**
 * Format impact value as currency
 */
export const formatImpactValue = (value) => {
  return `$${value.toFixed(2)}`;
};

/**
 * Format sessions count
 */
export const formatSessions = (sessions) => {
  if (sessions < 1) {
    return `${sessions.toFixed(1)} sessions`;
  }

  return `${Math.floor(sessions)} session${Math.floor(sessions) !== 1 ? 's' : ''}`;
};

/**
 * Calculate equivalent impact metrics
 */
export const calculateEquivalents = (sessions) => {
  const value = sessions * 25; // $25 per session

  return {
    bikesProvided: Math.floor(value / 200), // $200 per bike
    helmetsProvided: Math.floor(value / 30), // $30 per helmet
    lessonsDelivered: Math.floor(sessions),
    youthReached: Math.floor(sessions / 10), // Estimate 10 sessions per youth
  };
};

/**
 * Calculate impact growth percentage
 */
export const calculateGrowthPercentage = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;

  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth * 10) / 10;
};

/**
 * Format growth percentage with sign
 */
export const formatGrowth = (growth) => {
  if (growth > 0) {
    return `+${growth.toFixed(1)}%`;
  } else if (growth < 0) {
    return `${growth.toFixed(1)}%`;
  } else {
    return '0%';
  }
};

/**
 * Calculate impact rank tier
 */
export const getImpactTier = (totalSessions) => {
  if (totalSessions >= 5000) return { tier: 'Diamond', color: '#B9F2FF' };
  if (totalSessions >= 1000) return { tier: 'Platinum', color: '#E5E4E2' };
  if (totalSessions >= 500) return { tier: 'Gold', color: '#FFD700' };
  if (totalSessions >= 100) return { tier: 'Silver', color: '#C0C0C0' };
  if (totalSessions >= 10) return { tier: 'Bronze', color: '#CD7F32' };
  return { tier: 'Starter', color: '#9E9E9E' };
};

/**
 * Calculate average impact per activity
 */
export const calculateAverageImpact = (totalSessions, totalActivities) => {
  if (totalActivities === 0) return 0;
  return Math.round((totalSessions / totalActivities) * 10) / 10;
};

/**
 * Calculate projected impact
 * Predicts future impact based on current pace
 */
export const calculateProjectedImpact = (currentKm, daysActive, projectionDays = 30) => {
  if (daysActive === 0) return 0;

  const dailyAverage = currentKm / daysActive;
  const projectedKm = dailyAverage * projectionDays;

  return {
    projectedKm: Math.round(projectedKm * 10) / 10,
    projectedSessions: Math.round(projectedKm * 0.5 * 10) / 10, // Assuming 0.5 sessions per km
  };
};

/**
 * Format impact progress message
 */
export const getImpactProgressMessage = (progress) => {
  if (progress < 25) return 'Just getting started!';
  if (progress < 50) return 'Making great progress!';
  if (progress < 75) return "You're doing amazing!";
  if (progress < 100) return 'Almost there!';
  return 'Milestone achieved!';
};

export default {
  calculateImpact,
  formatImpactValue,
  formatSessions,
  calculateEquivalents,
  calculateGrowthPercentage,
  formatGrowth,
  getImpactTier,
  calculateAverageImpact,
  calculateProjectedImpact,
  getImpactProgressMessage,
};
