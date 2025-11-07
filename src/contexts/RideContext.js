// Together We Ride - Ride Context
// Manages active ride state during group ride tracking

import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscribeToRide, subscribeToLiveLocations } from '../services/rideService';
import { subscribeToLiveLocations as subscribeToLocations } from '../services/locationService';

// Create Ride Context
const RideContext = createContext();

// Ride Provider Component
export const RideProvider = ({ children }) => {
  const [activeRide, setActiveRide] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [liveLocations, setLiveLocations] = useState([]);
  const [trackingStartTime, setTrackingStartTime] = useState(null);
  const [trackingDuration, setTrackingDuration] = useState(0);
  const [trackingDistance, setTrackingDistance] = useState(0);
  const [trackingRoute, setTrackingRoute] = useState([]);

  // Start tracking a ride
  const startTracking = (ride) => {
    setActiveRide(ride);
    setIsTracking(true);
    setTrackingStartTime(new Date().getTime());
    setTrackingDuration(0);
    setTrackingDistance(0);
    setTrackingRoute([]);
    setLiveLocations([]);
  };

  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);
    setTrackingStartTime(null);
    // Keep activeRide for showing summary
  };

  // Clear ride (after viewing summary)
  const clearRide = () => {
    setActiveRide(null);
    setIsTracking(false);
    setLiveLocations([]);
    setTrackingStartTime(null);
    setTrackingDuration(0);
    setTrackingDistance(0);
    setTrackingRoute([]);
  };

  // Update tracking distance
  const updateDistance = (distance) => {
    setTrackingDistance(distance);
  };

  // Add point to route
  const addRoutePoint = (point) => {
    setTrackingRoute((prev) => [...prev, point]);
  };

  // Update tracking duration (called by timer)
  const updateDuration = (duration) => {
    setTrackingDuration(duration);
  };

  // Subscribe to ride updates when activeRide is set
  useEffect(() => {
    if (!activeRide?.id) return;

    const unsubscribeRide = subscribeToRide(activeRide.id, (updatedRide) => {
      if (updatedRide) {
        setActiveRide(updatedRide);
      }
    });

    return () => unsubscribeRide();
  }, [activeRide?.id]);

  // Subscribe to live locations when tracking
  useEffect(() => {
    if (!isTracking || !activeRide?.id) return;

    const unsubscribeLocations = subscribeToLocations(activeRide.id, (locations) => {
      setLiveLocations(locations);
    });

    return () => unsubscribeLocations();
  }, [isTracking, activeRide?.id]);

  // Calculate elapsed time
  useEffect(() => {
    if (!isTracking || !trackingStartTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - trackingStartTime) / 1000); // seconds
      setTrackingDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, trackingStartTime]);

  // Context value
  const value = {
    activeRide,
    isTracking,
    liveLocations,
    trackingStartTime,
    trackingDuration,
    trackingDistance,
    trackingRoute,
    startTracking,
    stopTracking,
    clearRide,
    updateDistance,
    addRoutePoint,
    updateDuration,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

// Custom hook to use Ride Context
export const useRide = () => {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }

  return context;
};

export default RideContext;
