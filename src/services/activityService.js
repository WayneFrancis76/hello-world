// Together We Ride - Activity Service
// Handles individual activity tracking (cycling, walking, wheeling, running)
// This is CORE to the Active Impact Platform!

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { calculateYouthSessions } from '../config/impactConfig';
import { ACTIVITY_TYPES } from '../config/constants';

// ══════════════════════════════════════════════════════════════
// LOG ACTIVITIES
// ══════════════════════════════════════════════════════════════

/**
 * Log a new activity (manual or GPS-tracked)
 * This is where the magic happens - activity transforms into youth opportunity!
 */
export const logActivity = async (activityData, userId, userName, userAvatar) => {
  try {
    const {
      type,
      distance,
      duration,
      route = [],
      startLocation = null,
      endLocation = null,
      notes = '',
      photos = [],
      isGroupRide = false,
      rideId = null,
      sponsorMultiplier = 1,
    } = activityData;

    // Calculate pace (km/h or min/km depending on activity type)
    const pace = calculatePace(distance, duration, type);

    // Calculate impact - THIS IS THE CORE INNOVATION!
    const youthSessionsGenerated = calculateYouthSessions(distance, type, sponsorMultiplier);

    const newActivity = {
      userId,
      userName,
      userAvatar: userAvatar || null,

      type,
      distance: parseFloat(distance),
      duration: parseInt(duration),
      pace,

      route, // Array of {lat, lng, timestamp} if GPS tracked
      startLocation,
      endLocation,

      // Impact calculation
      youthSessionsGenerated,
      conversionRate: 0.5, // From impactConfig
      sponsorMultiplier,

      isGroupRide,
      rideId,

      notes,
      photos,

      date: activityData.date || serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), newActivity);

    // Trigger impact update (this will be handled by Cloud Functions in production)
    // For now, we'll update user stats directly
    await updateUserActivityStats(userId, type, distance, youthSessionsGenerated);

    return {
      success: true,
      activityId: docRef.id,
      activity: { id: docRef.id, ...newActivity },
      impact: {
        sessions: youthSessionsGenerated,
        value: youthSessionsGenerated * 25, // $25 per session
      },
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    return {
      success: false,
      error: 'Failed to log activity. Please try again.',
    };
  }
};

/**
 * Calculate pace based on distance and duration
 */
const calculatePace = (distanceKm, durationSeconds, activityType) => {
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
 * Update user's activity statistics
 * In production, this would be done by a Cloud Function to prevent fraud
 */
const updateUserActivityStats = async (userId, activityType, distance, sessions) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();

    // Update activity-specific km
    const activityKmField = `total${activityType.charAt(0).toUpperCase() + activityType.slice(1)}Km`;

    await updateDoc(userRef, {
      totalKmLogged: (userData.totalKmLogged || 0) + distance,
      [activityKmField]: (userData[activityKmField] || 0) + distance,
      youthSessionsFunded: (userData.youthSessionsFunded || 0) + sessions,
      lastActivityDate: serverTimestamp(),
    });

    // Update impact document
    const impactRef = doc(db, COLLECTIONS.IMPACT, userId);
    const impactDoc = await getDoc(impactRef);

    if (impactDoc.exists()) {
      const impactData = impactDoc.data();

      await updateDoc(impactRef, {
        totalKmLogged: (impactData.totalKmLogged || 0) + distance,
        totalYouthSessionsFunded: (impactData.totalYouthSessionsFunded || 0) + sessions,
        totalImpactValue: (impactData.totalImpactValue || 0) + sessions * 25,

        [`${activityType}Km`]: (impactData[`${activityType}Km`] || 0) + distance,

        'thisWeek.km': (impactData.thisWeek?.km || 0) + distance,
        'thisWeek.sessions': (impactData.thisWeek?.sessions || 0) + sessions,

        'thisMonth.km': (impactData.thisMonth?.km || 0) + distance,
        'thisMonth.sessions': (impactData.thisMonth?.sessions || 0) + sessions,

        'allTime.km': (impactData.allTime?.km || 0) + distance,
        'allTime.sessions': (impactData.allTime?.sessions || 0) + sessions,

        lastUpdated: serverTimestamp(),
      });
    }

    // Update streak
    await updateStreak(userId, userData.lastActivityDate);

    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    // Don't throw - activity was logged successfully
  }
};

/**
 * Update user's activity streak
 */
const updateStreak = async (userId, lastActivityDate) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const currentStreak = userData.currentStreak || 0;
    const longestStreak = userData.longestStreak || 0;

    let newStreak = 1;

    if (lastActivityDate) {
      const lastDate = lastActivityDate.toDate();
      const today = new Date();
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day - don't increment
        newStreak = currentStreak;
      } else if (diffDays === 1) {
        // Consecutive day - increment
        newStreak = currentStreak + 1;
      } else {
        // Streak broken - reset to 1
        newStreak = 1;
      }
    }

    await updateDoc(userRef, {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
    });
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

// ══════════════════════════════════════════════════════════════
// GET ACTIVITIES
// ══════════════════════════════════════════════════════════════

/**
 * Get user's activity history
 */
export const getUserActivities = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      activities,
    };
  } catch (error) {
    console.error('Error getting activities:', error);
    return {
      success: false,
      error: 'Failed to load activities',
      activities: [],
    };
  }
};

/**
 * Get a single activity
 */
export const getActivity = async (activityId) => {
  try {
    const activityDoc = await getDoc(doc(db, COLLECTIONS.ACTIVITIES, activityId));

    if (activityDoc.exists()) {
      return {
        success: true,
        activity: { id: activityDoc.id, ...activityDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Activity not found',
      };
    }
  } catch (error) {
    console.error('Error getting activity:', error);
    return {
      success: false,
      error: 'Failed to load activity',
    };
  }
};

/**
 * Get activities by type
 */
export const getActivitiesByType = async (userId, activityType, limitCount = 20) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('userId', '==', userId),
      where('type', '==', activityType),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      activities,
    };
  } catch (error) {
    console.error('Error getting activities by type:', error);
    return {
      success: false,
      error: 'Failed to load activities',
      activities: [],
    };
  }
};

/**
 * Get activities for a date range
 */
export const getActivitiesByDateRange = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      activities,
    };
  } catch (error) {
    console.error('Error getting activities by date range:', error);
    return {
      success: false,
      error: 'Failed to load activities',
      activities: [],
    };
  }
};

/**
 * Get ride-related activities
 */
export const getRideActivities = async (rideId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('rideId', '==', rideId),
      where('isGroupRide', '==', true),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      activities,
    };
  } catch (error) {
    console.error('Error getting ride activities:', error);
    return {
      success: false,
      error: 'Failed to load ride activities',
      activities: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// UPDATE & DELETE ACTIVITIES
// ══════════════════════════════════════════════════════════════

/**
 * Update an activity
 */
export const updateActivity = async (activityId, updates) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.ACTIVITIES, activityId), updates);

    return {
      success: true,
      message: 'Activity updated successfully',
    };
  } catch (error) {
    console.error('Error updating activity:', error);
    return {
      success: false,
      error: 'Failed to update activity',
    };
  }
};

/**
 * Delete an activity (also reverses impact)
 */
export const deleteActivity = async (activityId) => {
  try {
    // Get activity data first to reverse impact
    const activityDoc = await getDoc(doc(db, COLLECTIONS.ACTIVITIES, activityId));

    if (activityDoc.exists()) {
      const activityData = activityDoc.data();

      // Reverse impact
      await reverseActivityImpact(
        activityData.userId,
        activityData.type,
        activityData.distance,
        activityData.youthSessionsGenerated
      );
    }

    // Delete activity
    await deleteDoc(doc(db, COLLECTIONS.ACTIVITIES, activityId));

    return {
      success: true,
      message: 'Activity deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return {
      success: false,
      error: 'Failed to delete activity',
    };
  }
};

/**
 * Reverse activity impact when deleting
 */
const reverseActivityImpact = async (userId, activityType, distance, sessions) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const activityKmField = `total${activityType.charAt(0).toUpperCase() + activityType.slice(1)}Km`;

    await updateDoc(userRef, {
      totalKmLogged: Math.max(0, (userData.totalKmLogged || 0) - distance),
      [activityKmField]: Math.max(0, (userData[activityKmField] || 0) - distance),
      youthSessionsFunded: Math.max(0, (userData.youthSessionsFunded || 0) - sessions),
    });

    // Update impact document
    const impactRef = doc(db, COLLECTIONS.IMPACT, userId);
    const impactDoc = await getDoc(impactRef);

    if (impactDoc.exists()) {
      const impactData = impactDoc.data();

      await updateDoc(impactRef, {
        totalKmLogged: Math.max(0, (impactData.totalKmLogged || 0) - distance),
        totalYouthSessionsFunded: Math.max(0, (impactData.totalYouthSessionsFunded || 0) - sessions),
        totalImpactValue: Math.max(0, (impactData.totalImpactValue || 0) - sessions * 25),

        [`${activityType}Km`]: Math.max(0, (impactData[`${activityType}Km`] || 0) - distance),

        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error reversing impact:', error);
  }
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to user's activities (real-time)
 */
export const subscribeToUserActivities = (userId, callback, limitCount = 20) => {
  const q = query(
    collection(db, COLLECTIONS.ACTIVITIES),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(activities);
    },
    (error) => {
      console.error('Error subscribing to activities:', error);
      callback([]);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// ACTIVITY STATISTICS
// ══════════════════════════════════════════════════════════════

/**
 * Calculate user's activity stats for a period
 */
export const calculateActivityStats = async (userId, startDate, endDate) => {
  try {
    const { success, activities } = await getActivitiesByDateRange(userId, startDate, endDate);

    if (!success) {
      return { success: false, error: 'Failed to calculate stats' };
    }

    const stats = {
      totalActivities: activities.length,
      totalDistance: 0,
      totalDuration: 0,
      totalSessions: 0,
      byType: {
        cycling: { count: 0, distance: 0, sessions: 0 },
        walking: { count: 0, distance: 0, sessions: 0 },
        wheeling: { count: 0, distance: 0, sessions: 0 },
        running: { count: 0, distance: 0, sessions: 0 },
      },
    };

    activities.forEach((activity) => {
      stats.totalDistance += activity.distance;
      stats.totalDuration += activity.duration;
      stats.totalSessions += activity.youthSessionsGenerated;

      if (stats.byType[activity.type]) {
        stats.byType[activity.type].count++;
        stats.byType[activity.type].distance += activity.distance;
        stats.byType[activity.type].sessions += activity.youthSessionsGenerated;
      }
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      success: false,
      error: 'Failed to calculate stats',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  logActivity,
  getUserActivities,
  getActivity,
  getActivitiesByType,
  getActivitiesByDateRange,
  getRideActivities,
  updateActivity,
  deleteActivity,
  subscribeToUserActivities,
  calculateActivityStats,
};
