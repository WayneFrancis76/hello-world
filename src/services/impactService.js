// Together We Ride - Impact Service
// Manages impact calculations, youth program allocation, and impact reporting
// THIS IS THE HEART OF THE ACTIVE IMPACT PLATFORM!

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import {
  calculateYouthSessions,
  calculateImpactValue,
  getNextMilestone,
  getNextSessionMilestone,
  IMPACT_MILESTONES,
} from '../config/impactConfig';

// ══════════════════════════════════════════════════════════════
// GET IMPACT DATA
// ══════════════════════════════════════════════════════════════

/**
 * Get user's personal impact statistics
 */
export const getUserImpact = async (userId) => {
  try {
    const impactDoc = await getDoc(doc(db, COLLECTIONS.IMPACT, userId));

    if (impactDoc.exists()) {
      const impactData = impactDoc.data();

      // Calculate next milestones
      const nextDistanceMilestone = getNextMilestone(impactData.totalKmLogged || 0);
      const nextSessionMilestone = getNextSessionMilestone(
        impactData.totalYouthSessionsFunded || 0
      );

      return {
        success: true,
        impact: {
          id: impactDoc.id,
          ...impactData,
          nextDistanceMilestone,
          nextSessionMilestone,
        },
      };
    } else {
      return {
        success: false,
        error: 'Impact data not found',
      };
    }
  } catch (error) {
    console.error('Error getting user impact:', error);
    return {
      success: false,
      error: 'Failed to load impact data',
    };
  }
};

/**
 * Get global community impact statistics
 */
export const getCommunityImpact = async () => {
  try {
    const impactQuery = query(collection(db, COLLECTIONS.IMPACT));
    const querySnapshot = await getDocs(impactQuery);

    let totalKm = 0;
    let totalSessions = 0;
    let totalValue = 0;
    let totalUsers = 0;
    let activityBreakdown = {
      cycling: 0,
      walking: 0,
      wheeling: 0,
      running: 0,
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalKm += data.totalKmLogged || 0;
      totalSessions += data.totalYouthSessionsFunded || 0;
      totalValue += data.totalImpactValue || 0;
      totalUsers++;

      activityBreakdown.cycling += data.cyclingKm || 0;
      activityBreakdown.walking += data.walkingKm || 0;
      activityBreakdown.wheeling += data.wheelingKm || 0;
      activityBreakdown.running += data.runningKm || 0;
    });

    return {
      success: true,
      communityImpact: {
        totalKm: Math.round(totalKm * 10) / 10,
        totalSessions: Math.round(totalSessions * 10) / 10,
        totalValue: Math.round(totalValue * 100) / 100,
        totalUsers,
        activityBreakdown,
        avgKmPerUser: totalUsers > 0 ? Math.round((totalKm / totalUsers) * 10) / 10 : 0,
        avgSessionsPerUser:
          totalUsers > 0 ? Math.round((totalSessions / totalUsers) * 10) / 10 : 0,
      },
    };
  } catch (error) {
    console.error('Error getting community impact:', error);
    return {
      success: false,
      error: 'Failed to load community impact',
    };
  }
};

/**
 * Get impact leaderboard
 */
export const getImpactLeaderboard = async (metric = 'totalKmLogged', limitCount = 100) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.IMPACT),
      orderBy(metric, 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
      const doc = querySnapshot.docs[i];
      const impactData = doc.data();

      // Get user data
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, doc.id));
      const userData = userDoc.exists() ? userDoc.data() : {};

      leaderboard.push({
        rank: i + 1,
        userId: doc.id,
        userName: userData.displayName || 'Anonymous',
        userAvatar: userData.avatar || null,
        metricValue: impactData[metric] || 0,
        totalKm: impactData.totalKmLogged || 0,
        totalSessions: impactData.totalYouthSessionsFunded || 0,
      });
    }

    return {
      success: true,
      leaderboard,
    };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return {
      success: false,
      error: 'Failed to load leaderboard',
      leaderboard: [],
    };
  }
};

/**
 * Get user's rank in leaderboard
 */
export const getUserRank = async (userId, metric = 'totalKmLogged') => {
  try {
    const userImpactDoc = await getDoc(doc(db, COLLECTIONS.IMPACT, userId));

    if (!userImpactDoc.exists()) {
      return { success: false, error: 'User impact not found' };
    }

    const userMetricValue = userImpactDoc.data()[metric] || 0;

    // Count users with higher metric value
    const q = query(
      collection(db, COLLECTIONS.IMPACT),
      where(metric, '>', userMetricValue)
    );

    const querySnapshot = await getDocs(q);
    const rank = querySnapshot.size + 1;

    return {
      success: true,
      rank,
      metricValue: userMetricValue,
    };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return {
      success: false,
      error: 'Failed to get rank',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// MILESTONES & ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════

/**
 * Check if user has achieved new milestones
 */
export const checkMilestones = async (userId, currentKm, currentSessions) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (!userDoc.exists()) return { newMilestones: [] };

    const userData = userDoc.data();
    const existingBadges = userData.impactBadges || [];
    const newMilestones = [];

    // Check distance milestones
    IMPACT_MILESTONES.distance.forEach((milestone) => {
      if (
        currentKm >= milestone.km &&
        !existingBadges.includes(milestone.badge)
      ) {
        newMilestones.push({
          type: 'distance',
          ...milestone,
          achieved: new Date(),
        });
      }
    });

    // Check session milestones
    IMPACT_MILESTONES.youthSessions.forEach((milestone) => {
      if (
        currentSessions >= milestone.sessions &&
        !existingBadges.includes(milestone.badge)
      ) {
        newMilestones.push({
          type: 'sessions',
          ...milestone,
          achieved: new Date(),
        });
      }
    });

    return {
      success: true,
      newMilestones,
    };
  } catch (error) {
    console.error('Error checking milestones:', error);
    return {
      success: false,
      newMilestones: [],
    };
  }
};

/**
 * Get user's earned milestones
 */
export const getUserMilestones = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const earnedBadges = userData.impactBadges || [];
    const milestones = [];

    // Get all milestone details
    [...IMPACT_MILESTONES.distance, ...IMPACT_MILESTONES.youthSessions].forEach(
      (milestone) => {
        if (earnedBadges.includes(milestone.badge)) {
          milestones.push(milestone);
        }
      }
    );

    return {
      success: true,
      milestones,
    };
  } catch (error) {
    console.error('Error getting milestones:', error);
    return {
      success: false,
      error: 'Failed to load milestones',
      milestones: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// YOUTH PROGRAM ALLOCATION
// ══════════════════════════════════════════════════════════════

/**
 * Get all active youth programs
 */
export const getYouthPrograms = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.YOUTH_PROGRAMS),
      where('active', '==', true),
      orderBy('sessionsReceived', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const programs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      programs,
    };
  } catch (error) {
    console.error('Error getting youth programs:', error);
    return {
      success: false,
      error: 'Failed to load youth programs',
      programs: [],
    };
  }
};

/**
 * Get a single youth program
 */
export const getYouthProgram = async (programId) => {
  try {
    const programDoc = await getDoc(doc(db, COLLECTIONS.YOUTH_PROGRAMS, programId));

    if (programDoc.exists()) {
      return {
        success: true,
        program: { id: programDoc.id, ...programDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Youth program not found',
      };
    }
  } catch (error) {
    console.error('Error getting youth program:', error);
    return {
      success: false,
      error: 'Failed to load youth program',
    };
  }
};

/**
 * Get programs a user has impacted
 */
export const getUserImpactedPrograms = async (userId) => {
  try {
    // In production, this would query a join table of user_program_allocations
    // For now, we'll return all programs with user's contribution percentage

    const { success, programs } = await getYouthPrograms();

    if (!success) {
      return { success: false, error: 'Failed to load programs' };
    }

    const { success: impactSuccess, impact } = await getUserImpact(userId);

    if (!impactSuccess) {
      return { success: false, error: 'Failed to load impact data' };
    }

    // Calculate user's contribution to each program
    // This is a simplified version - in production, use allocation tracking
    const totalSessions = impact.totalYouthSessionsFunded || 0;

    const impactedPrograms = programs.map((program) => {
      // Simplified: distribute user's sessions proportionally
      const programPercentage =
        program.sessionsReceived /
        programs.reduce((sum, p) => sum + p.sessionsReceived, 0);

      const userContribution = Math.round(totalSessions * programPercentage * 10) / 10;

      return {
        ...program,
        userContribution,
        userContributionValue: userContribution * 25, // $25 per session
      };
    });

    return {
      success: true,
      programs: impactedPrograms.filter((p) => p.userContribution > 0),
    };
  } catch (error) {
    console.error('Error getting user impacted programs:', error);
    return {
      success: false,
      error: 'Failed to load impacted programs',
      programs: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// IMPACT REPORTS
// ══════════════════════════════════════════════════════════════

/**
 * Generate user impact report for a period
 */
export const generateImpactReport = async (userId, startDate, endDate) => {
  try {
    // Get activities for the period
    const activitiesQuery = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(activitiesQuery);

    let totalKm = 0;
    let totalSessions = 0;
    let totalDuration = 0;
    let activityCount = 0;
    const activityBreakdown = {
      cycling: { km: 0, sessions: 0, count: 0 },
      walking: { km: 0, sessions: 0, count: 0 },
      wheeling: { km: 0, sessions: 0, count: 0 },
      running: { km: 0, sessions: 0, count: 0 },
    };

    querySnapshot.forEach((doc) => {
      const activity = doc.data();
      totalKm += activity.distance;
      totalSessions += activity.youthSessionsGenerated;
      totalDuration += activity.duration;
      activityCount++;

      if (activityBreakdown[activity.type]) {
        activityBreakdown[activity.type].km += activity.distance;
        activityBreakdown[activity.type].sessions += activity.youthSessionsGenerated;
        activityBreakdown[activity.type].count++;
      }
    });

    const report = {
      period: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalKm: Math.round(totalKm * 10) / 10,
        totalSessions: Math.round(totalSessions * 10) / 10,
        totalValue: Math.round(totalSessions * 25 * 100) / 100,
        totalDuration,
        activityCount,
        avgKmPerActivity: activityCount > 0 ? Math.round((totalKm / activityCount) * 10) / 10 : 0,
        avgSessionsPerActivity:
          activityCount > 0 ? Math.round((totalSessions / activityCount) * 10) / 10 : 0,
      },
      breakdown: activityBreakdown,
      impactEquivalents: {
        bikesProvided: Math.floor(totalSessions * 25 / 200), // $200 per bike
        helmetsProvided: Math.floor(totalSessions * 25 / 30), // $30 per helmet
        lessonsDelivered: Math.floor(totalSessions),
      },
    };

    return {
      success: true,
      report,
    };
  } catch (error) {
    console.error('Error generating impact report:', error);
    return {
      success: false,
      error: 'Failed to generate report',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to user's impact data (real-time updates)
 */
export const subscribeToUserImpact = (userId, callback) => {
  return onSnapshot(
    doc(db, COLLECTIONS.IMPACT, userId),
    (doc) => {
      if (doc.exists()) {
        const impactData = doc.data();
        const nextDistanceMilestone = getNextMilestone(impactData.totalKmLogged || 0);
        const nextSessionMilestone = getNextSessionMilestone(
          impactData.totalYouthSessionsFunded || 0
        );

        callback({
          id: doc.id,
          ...impactData,
          nextDistanceMilestone,
          nextSessionMilestone,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to impact:', error);
      callback(null);
    }
  );
};

/**
 * Subscribe to impact leaderboard (real-time)
 */
export const subscribeToLeaderboard = (callback, metric = 'totalKmLogged', limitCount = 10) => {
  const q = query(
    collection(db, COLLECTIONS.IMPACT),
    orderBy(metric, 'desc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    async (querySnapshot) => {
      const leaderboard = [];

      for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];
        const impactData = doc.data();

        // Get user data
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, doc.id));
        const userData = userDoc.exists() ? userDoc.data() : {};

        leaderboard.push({
          rank: i + 1,
          userId: doc.id,
          userName: userData.displayName || 'Anonymous',
          userAvatar: userData.avatar || null,
          metricValue: impactData[metric] || 0,
          totalKm: impactData.totalKmLogged || 0,
          totalSessions: impactData.totalYouthSessionsFunded || 0,
        });
      }

      callback(leaderboard);
    },
    (error) => {
      console.error('Error subscribing to leaderboard:', error);
      callback([]);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Calculate impact for a given distance and activity type
 */
export const calculateImpact = (distance, activityType, sponsorMultiplier = 1) => {
  const sessions = calculateYouthSessions(distance, activityType, sponsorMultiplier);
  const value = calculateImpactValue(sessions);

  return {
    sessions: Math.round(sessions * 10) / 10,
    value: Math.round(value * 100) / 100,
  };
};

/**
 * Format impact value to currency
 */
export const formatImpactValue = (sessions) => {
  const value = calculateImpactValue(sessions);
  return `$${value.toFixed(2)}`;
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  getUserImpact,
  getCommunityImpact,
  getImpactLeaderboard,
  getUserRank,
  checkMilestones,
  getUserMilestones,
  getYouthPrograms,
  getYouthProgram,
  getUserImpactedPrograms,
  generateImpactReport,
  subscribeToUserImpact,
  subscribeToLeaderboard,
  calculateImpact,
  formatImpactValue,
};
