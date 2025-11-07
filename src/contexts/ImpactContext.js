// Together We Ride - Impact Context
// Manages real-time impact data across the app
// This keeps the Active Impact Platform metrics fresh and motivating!

import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscribeToUserImpact, getCommunityImpact } from '../services/impactService';
import { useAuth } from './AuthContext';

// Create Impact Context
const ImpactContext = createContext();

// Impact Provider Component
export const ImpactProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // User's personal impact
  const [userImpact, setUserImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Community impact (cached, refreshed periodically)
  const [communityImpact, setComm​unityImpact] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);

  // Impact milestones
  const [newMilestones, setNewMilestones] = useState([]);

  // Subscribe to user's impact (real-time)
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      setUserImpact(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToUserImpact(user.uid, (impact) => {
      if (impact) {
        // Check for new milestones
        checkForNewMilestones(userImpact, impact);
        setUserImpact(impact);
      } else {
        setUserImpact(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user?.uid]);

  // Load community impact (refresh every 30 seconds)
  useEffect(() => {
    const loadCommunityImpact = async () => {
      setCommunityLoading(true);
      const { success, communityImpact: impact } = await getCommunityImpact();

      if (success) {
        setCommun​ityImpact(impact);
      }
      setCommunityLoading(false);
    };

    // Load immediately
    loadCommunityImpact();

    // Refresh every 30 seconds
    const interval = setInterval(loadCommunityImpact, 30000);

    return () => clearInterval(interval);
  }, []);

  // Check for new milestones
  const checkForNewMilestones = (oldImpact, newImpact) => {
    if (!oldImpact || !newImpact) return;

    // Check if any new milestones were achieved
    const oldMilestones = oldImpact.milestones || [];
    const newMilestonesList = newImpact.milestones || [];

    const newlyAchieved = newMilestonesList.filter(
      (milestone) =>
        !oldMilestones.some((old) => old.km === milestone.km && old.sessions === milestone.sessions)
    );

    if (newlyAchieved.length > 0) {
      setNewMilestones((prev) => [...prev, ...newlyAchieved]);

      // Auto-clear milestone notifications after 5 seconds
      setTimeout(() => {
        setNewMilestones((prev) =>
          prev.filter((m) => !newlyAchieved.some((n) => n.km === m.km))
        );
      }, 5000);
    }
  };

  // Clear milestone notification
  const clearMilestone = (milestone) => {
    setNewMilestones((prev) => prev.filter((m) => m.km !== milestone.km));
  };

  // Clear all milestone notifications
  const clearAllMilestones = () => {
    setNewMilestones([]);
  };

  // Refresh user impact manually
  const refreshUserImpact = async () => {
    // Real-time subscription will handle this automatically
    // This is a no-op, but provided for consistency
    return { success: true };
  };

  // Refresh community impact manually
  const refreshCommunityImpact = async () => {
    setCommunityLoading(true);
    const { success, communityImpact: impact } = await getCommunityImpact();

    if (success) {
      setCommun​ityImpact(impact);
      setCommunityLoading(false);
      return { success: true };
    } else {
      setCommunityLoading(false);
      return { success: false };
    }
  };

  // Get progress to next milestone
  const getProgressToNextMilestone = () => {
    if (!userImpact || !userImpact.nextDistanceMilestone) {
      return { progress: 0, nextMilestone: null };
    }

    const currentKm = userImpact.totalKmLogged || 0;
    const nextMilestone = userImpact.nextDistanceMilestone;
    const progress = (currentKm / nextMilestone.km) * 100;

    return {
      progress: Math.min(progress, 100),
      nextMilestone,
      remaining: Math.max(0, nextMilestone.km - currentKm),
    };
  };

  // Get progress to next session milestone
  const getProgressToNextSessionMilestone = () => {
    if (!userImpact || !userImpact.nextSessionMilestone) {
      return { progress: 0, nextMilestone: null };
    }

    const currentSessions = userImpact.totalYouthSessionsFunded || 0;
    const nextMilestone = userImpact.nextSessionMilestone;
    const progress = (currentSessions / nextMilestone.sessions) * 100;

    return {
      progress: Math.min(progress, 100),
      nextMilestone,
      remaining: Math.max(0, nextMilestone.sessions - currentSessions),
    };
  };

  // Calculate user's contribution percentage to community
  const getUserContributionPercentage = () => {
    if (!userImpact || !communityImpact) return 0;

    const userKm = userImpact.totalKmLogged || 0;
    const totalKm = communityImpact.totalKm || 0;

    if (totalKm === 0) return 0;

    return ((userKm / totalKm) * 100).toFixed(2);
  };

  // Context value
  const value = {
    userImpact,
    loading,
    communityImpact,
    communityLoading,
    newMilestones,
    refreshUserImpact,
    refreshCommunityImpact,
    clearMilestone,
    clearAllMilestones,
    getProgressToNextMilestone,
    getProgressToNextSessionMilestone,
    getUserContributionPercentage,
  };

  return <ImpactContext.Provider value={value}>{children}</ImpactContext.Provider>;
};

// Custom hook to use Impact Context
export const useImpact = () => {
  const context = useContext(ImpactContext);

  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }

  return context;
};

export default ImpactContext;
