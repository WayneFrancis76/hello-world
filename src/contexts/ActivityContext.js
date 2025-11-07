// Together We Ride - Activity Context
// Manages solo activity tracking state (cycling, walking, wheeling, running)
// This is crucial for the Active Impact Platform!

import React, { createContext, useState, useContext, useEffect } from 'react';
import { calculateYouthSessions } from '../config/impactConfig';
import { ACTIVITY_TYPES } from '../config/constants';

// Create Activity Context
const ActivityContext = createContext();

// Activity Provider Component
export const ActivityProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES.CYCLING);
  const [trackingStartTime, setTrackingStartTime] = useState(null);
  const [trackingDuration, setTrackingDuration] = useState(0);
  const [trackingDistance, setTrackingDistance] = useState(0);
  const [trackingRoute, setTrackingRoute] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [lastPauseTime, setLastPauseTime] = useState(null);

  // Real-time impact calculation (THE MAGIC!)
  const [sessionsGenerated, setSessionsGenerated] = useState(0);
  const [sponsorMultiplier, setSponsorMultiplier] = useState(1);

  // Start tracking an activity
  const startTracking = (type = ACTIVITY_TYPES.CYCLING, multiplier = 1) => {
    setIsTracking(true);
    setActivityType(type);
    setTrackingStartTime(new Date().getTime());
    setTrackingDuration(0);
    setTrackingDistance(0);
    setTrackingRoute([]);
    setCurrentSpeed(0);
    setIsPaused(false);
    setPausedDuration(0);
    setLastPauseTime(null);
    setSessionsGenerated(0);
    setSponsorMultiplier(multiplier);
  };

  // Pause tracking
  const pauseTracking = () => {
    if (!isPaused) {
      setIsPaused(true);
      setLastPauseTime(new Date().getTime());
    }
  };

  // Resume tracking
  const resumeTracking = () => {
    if (isPaused && lastPauseTime) {
      const pauseDuration = new Date().getTime() - lastPauseTime;
      setPausedDuration((prev) => prev + pauseDuration);
      setIsPaused(false);
      setLastPauseTime(null);
    }
  };

  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
  };

  // Clear activity (after saving)
  const clearActivity = () => {
    setIsTracking(false);
    setActivityType(ACTIVITY_TYPES.CYCLING);
    setTrackingStartTime(null);
    setTrackingDuration(0);
    setTrackingDistance(0);
    setTrackingRoute([]);
    setCurrentSpeed(0);
    setIsPaused(false);
    setPausedDuration(0);
    setLastPauseTime(null);
    setSessionsGenerated(0);
    setSponsorMultiplier(1);
  };

  // Update distance
  const updateDistance = (distance) => {
    setTrackingDistance(distance);

    // Recalculate impact in real-time
    const sessions = calculateYouthSessions(distance, activityType, sponsorMultiplier);
    setSessionsGenerated(sessions);
  };

  // Update speed
  const updateSpeed = (speed) => {
    setCurrentSpeed(speed);
  };

  // Add point to route
  const addRoutePoint = (point) => {
    setTrackingRoute((prev) => [...prev, point]);
  };

  // Get active duration (excluding paused time)
  const getActiveDuration = () => {
    let totalPaused = pausedDuration;

    if (isPaused && lastPauseTime) {
      totalPaused += new Date().getTime() - lastPauseTime;
    }

    return trackingDuration - Math.floor(totalPaused / 1000);
  };

  // Calculate pace
  const calculatePace = () => {
    const activeDuration = getActiveDuration();

    if (trackingDistance === 0 || activeDuration === 0) return 0;

    if (activityType === ACTIVITY_TYPES.CYCLING) {
      // km/h for cycling
      const hours = activeDuration / 3600;
      return parseFloat((trackingDistance / hours).toFixed(1));
    } else {
      // min/km for walking/running/wheeling
      const minutes = activeDuration / 60;
      return parseFloat((minutes / trackingDistance).toFixed(1));
    }
  };

  // Calculate elapsed time
  useEffect(() => {
    if (!isTracking || !trackingStartTime || isPaused) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - trackingStartTime) / 1000); // seconds
      setTrackingDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, trackingStartTime, isPaused]);

  // Auto-pause detection (if speed is 0 for more than 2 minutes)
  useEffect(() => {
    if (!isTracking || isPaused) return;

    if (currentSpeed < 1) {
      // Speed below 1 km/h - might be stopped
      const checkPauseInterval = setTimeout(() => {
        if (currentSpeed < 1) {
          pauseTracking();
        }
      }, 120000); // 2 minutes

      return () => clearTimeout(checkPauseInterval);
    }
  }, [currentSpeed, isTracking, isPaused]);

  // Context value
  const value = {
    isTracking,
    activityType,
    trackingStartTime,
    trackingDuration,
    trackingDistance,
    trackingRoute,
    currentSpeed,
    isPaused,
    pausedDuration,
    sessionsGenerated,
    sponsorMultiplier,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    clearActivity,
    updateDistance,
    updateSpeed,
    addRoutePoint,
    getActiveDuration,
    calculatePace,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

// Custom hook to use Activity Context
export const useActivity = () => {
  const context = useContext(ActivityContext);

  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }

  return context;
};

export default ActivityContext;
