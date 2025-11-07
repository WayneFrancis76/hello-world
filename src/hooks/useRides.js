// Together We Ride - useRides Hook
// Hook for managing rides data with real-time updates

import { useState, useEffect } from 'react';
import { subscribeToUpcomingRides, getUpcomingRides } from '../services/rideService';

export const useRides = (enableRealtime = true, limitCount = 20) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (enableRealtime) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToUpcomingRides((updatedRides) => {
        setRides(updatedRides);
        setLoading(false);
        setError(null);
      }, limitCount);

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchRides = async () => {
        setLoading(true);
        const { success, rides: fetchedRides, error: fetchError } = await getUpcomingRides(limitCount);

        if (success) {
          setRides(fetchedRides);
          setError(null);
        } else {
          setError(fetchError);
        }

        setLoading(false);
      };

      fetchRides();
    }
  }, [enableRealtime, limitCount]);

  const refresh = async () => {
    setLoading(true);
    const { success, rides: fetchedRides, error: fetchError } = await getUpcomingRides(limitCount);

    if (success) {
      setRides(fetchedRides);
      setError(null);
    } else {
      setError(fetchError);
    }

    setLoading(false);
  };

  return {
    rides,
    loading,
    error,
    refresh,
  };
};

export default useRides;
