// Together We Ride - useLocation Hook
// Hook for GPS location tracking

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LOCATION } from '../config/constants';

export const useLocation = (enableTracking = false, updateInterval = LOCATION.UPDATE_INTERVAL) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request location permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermission(status === 'granted');

        if (status !== 'granted') {
          setError(LOCATION.PERMISSION_DENIED);
          setLoading(false);
          return;
        }

        // Get current location once
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);
        setLoading(false);
      } catch (err) {
        console.error('Error requesting location permission:', err);
        setError(LOCATION.LOCATION_UNAVAILABLE);
        setLoading(false);
      }
    })();
  }, []);

  // Start live tracking
  useEffect(() => {
    if (!enableTracking || !permission) return;

    let subscription;

    (async () => {
      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: updateInterval,
            distanceInterval: LOCATION.MIN_DISTANCE,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (err) {
        console.error('Error starting location tracking:', err);
        setError('Failed to start location tracking');
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enableTracking, permission, updateInterval]);

  return {
    location,
    error,
    permission,
    loading,
    hasPermission: permission === true,
  };
};

export default useLocation;
