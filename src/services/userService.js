// Together We Ride - User Service
// Handles user profile management and user-related operations

import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { uploadAvatar } from './mediaService';

// ══════════════════════════════════════════════════════════════
// GET USER DATA
// ══════════════════════════════════════════════════════════════

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (userDoc.exists()) {
      return {
        success: true,
        user: { id: userDoc.id, ...userDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'User not found',
      };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      error: 'Failed to load user profile',
    };
  }
};

/**
 * Get multiple users by IDs (batch fetch)
 */
export const getUserProfiles = async (userIds) => {
  try {
    const users = [];

    for (const userId of userIds) {
      const { success, user } = await getUserProfile(userId);
      if (success) {
        users.push(user);
      }
    }

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('Error getting user profiles:', error);
    return {
      success: false,
      error: 'Failed to load user profiles',
      users: [],
    };
  }
};

/**
 * Search users by display name
 */
export const searchUsers = async (searchTerm, limitCount = 20) => {
  try {
    // Firestore doesn't support full-text search natively
    // This is a simple prefix search - in production, use Algolia or similar

    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('Error searching users:', error);
    return {
      success: false,
      error: 'Search failed',
      users: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// UPDATE USER PROFILE
// ══════════════════════════════════════════════════════════════

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...cleanUpdates,
      lastActive: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
};

/**
 * Update user avatar
 */
export const updateUserAvatar = async (userId, imageUri, onProgress = null) => {
  try {
    // Upload image to Storage
    const { success, url, error } = await uploadAvatar(imageUri, userId, onProgress);

    if (!success) {
      return { success: false, error };
    }

    // Update user profile with new avatar URL
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      avatar: url,
      lastActive: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Avatar updated successfully',
      avatarUrl: url,
    };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return {
      success: false,
      error: 'Failed to update avatar',
    };
  }
};

/**
 * Update user bio
 */
export const updateUserBio = async (userId, bio) => {
  return updateUserProfile(userId, { bio });
};

/**
 * Update user location
 */
export const updateUserLocation = async (userId, location) => {
  return updateUserProfile(userId, { location });
};

/**
 * Update user display name
 */
export const updateUserDisplayName = async (userId, displayName) => {
  return updateUserProfile(userId, { displayName });
};

// ══════════════════════════════════════════════════════════════
// USER STATISTICS
// ══════════════════════════════════════════════════════════════

/**
 * Get user's activity statistics
 */
export const getUserStats = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();

    const stats = {
      // Ride stats
      totalRides: userData.totalRides || 0,
      ridesCreated: userData.ridesCreated || 0,
      ridesJoined: userData.ridesJoined || 0,
      totalStars: userData.totalStars || 0,

      // Activity stats
      totalKmLogged: userData.totalKmLogged || 0,
      totalCyclingKm: userData.totalCyclingKm || 0,
      totalWalkingKm: userData.totalWalkingKm || 0,
      totalWheelingKm: userData.totalWheelingKm || 0,
      totalRunningKm: userData.totalRunningKm || 0,

      // Impact stats
      youthSessionsFunded: userData.youthSessionsFunded || 0,
      impactRank: userData.impactRank || 0,
      impactBadges: userData.impactBadges || [],

      // Streaks
      currentStreak: userData.currentStreak || 0,
      longestStreak: userData.longestStreak || 0,

      // Timestamps
      joinedAt: userData.joinedAt,
      lastActive: userData.lastActive,
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      success: false,
      error: 'Failed to load user stats',
    };
  }
};

/**
 * Get top users by a specific metric (leaderboard)
 */
export const getTopUsers = async (metric = 'totalKmLogged', limitCount = 100) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy(metric, 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('Error getting top users:', error);
    return {
      success: false,
      error: 'Failed to load leaderboard',
      users: [],
    };
  }
};

/**
 * Get user's rank for a specific metric
 */
export const getUserRank = async (userId, metric = 'totalKmLogged') => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const userMetricValue = userData[metric] || 0;

    // Count users with higher metric value
    const q = query(
      collection(db, COLLECTIONS.USERS),
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
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to user profile (real-time updates)
 */
export const subscribeToUserProfile = (userId, callback) => {
  return onSnapshot(
    doc(db, COLLECTIONS.USERS, userId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to user profile:', error);
      callback(null);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// USER ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════

/**
 * Get user's achievements
 */
export const getUserAchievements = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACHIEVEMENTS),
      where('userId', '==', userId),
      orderBy('earnedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const achievements = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      achievements,
    };
  } catch (error) {
    console.error('Error getting achievements:', error);
    return {
      success: false,
      error: 'Failed to load achievements',
      achievements: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// VALIDATION
// ══════════════════════════════════════════════════════════════

/**
 * Validate user profile update data
 */
export const validateProfileUpdate = (updates) => {
  const errors = {};

  if (updates.displayName !== undefined) {
    if (updates.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (updates.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }
  }

  if (updates.bio !== undefined) {
    if (updates.bio.length > 200) {
      errors.bio = 'Bio must be less than 200 characters';
    }
  }

  if (updates.location !== undefined) {
    if (updates.location.length > 100) {
      errors.location = 'Location must be less than 100 characters';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Format user display name (fallback to email if no display name)
 */
export const formatDisplayName = (user) => {
  if (user.displayName) {
    return user.displayName;
  }

  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'Anonymous User';
};

/**
 * Get user initials for avatar placeholder
 */
export const getUserInitials = (user) => {
  const displayName = formatDisplayName(user);

  const names = displayName.split(' ');

  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }

  return displayName.substring(0, 2).toUpperCase();
};

/**
 * Format user join date
 */
export const formatJoinDate = (joinedAt) => {
  if (!joinedAt) return 'Recently joined';

  const date = joinedAt.toDate ? joinedAt.toDate() : new Date(joinedAt);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return 'Recently joined';
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Joined ${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Joined ${years} year${years > 1 ? 's' : ''} ago`;
  }
};

/**
 * Check if user is active (logged in within last 7 days)
 */
export const isUserActive = (lastActive) => {
  if (!lastActive) return false;

  const lastActiveDate = lastActive.toDate ? lastActive.toDate() : new Date(lastActive);
  const now = new Date();
  const diffTime = Math.abs(now - lastActiveDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 7;
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  getUserProfile,
  getUserProfiles,
  searchUsers,
  updateUserProfile,
  updateUserAvatar,
  updateUserBio,
  updateUserLocation,
  updateUserDisplayName,
  getUserStats,
  getTopUsers,
  getUserRank,
  subscribeToUserProfile,
  getUserAchievements,
  validateProfileUpdate,
  formatDisplayName,
  getUserInitials,
  formatJoinDate,
  isUserActive,
};
