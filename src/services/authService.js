// Together We Ride - Authentication Service
// Handles all authentication operations using Firebase Auth

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from './firebase';

// ══════════════════════════════════════════════════════════════
// AUTHENTICATION METHODS
// ══════════════════════════════════════════════════════════════

/**
 * Sign up a new user with email and password
 * Creates user profile in Firestore after successful registration
 */
export const signUp = async (email, password, displayName) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name in Auth profile
    await updateProfile(user, {
      displayName: displayName || email.split('@')[0],
    });

    // Create initial user profile in Firestore
    await createUserProfile(user.uid, {
      email,
      displayName: displayName || email.split('@')[0],
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Sign in existing user with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last active timestamp
    await updateUserLastActive(user.uid);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'Failed to sign out. Please try again.',
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ══════════════════════════════════════════════════════════════
// USER PROFILE MANAGEMENT
// ══════════════════════════════════════════════════════════════

/**
 * Create initial user profile in Firestore
 */
const createUserProfile = async (uid, userData) => {
  try {
    const userProfile = {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      avatar: null,
      bio: '',
      location: '',

      // Activity stats (initialize to 0)
      totalStars: 0,
      totalRides: 0,
      ridesCreated: 0,
      ridesJoined: 0,

      // Impact stats (initialize to 0)
      totalKmLogged: 0,
      totalCyclingKm: 0,
      totalWalkingKm: 0,
      totalWheelingKm: 0,
      totalRunningKm: 0,
      youthSessionsFunded: 0,
      impactRank: 0,
      impactBadges: [],

      // Streaks
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,

      // Timestamps
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, uid), userProfile);

    // Also create impact document for the user
    await setDoc(doc(db, COLLECTIONS.IMPACT, uid), {
      userId: uid,
      totalKmLogged: 0,
      totalYouthSessionsFunded: 0,
      totalImpactValue: 0,

      cyclingKm: 0,
      walkingKm: 0,
      wheelingKm: 0,
      runningKm: 0,

      thisWeek: { km: 0, sessions: 0 },
      thisMonth: { km: 0, sessions: 0 },
      thisYear: { km: 0, sessions: 0 },
      allTime: { km: 0, sessions: 0 },

      milestones: [],
      globalRank: 0,
      localRank: 0,

      lastUpdated: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));

    if (userDoc.exists()) {
      return {
        success: true,
        profile: { id: userDoc.id, ...userDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'User profile not found',
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
 * Update user's last active timestamp
 */
const updateUserLastActive = async (uid) => {
  try {
    await setDoc(
      doc(db, COLLECTIONS.USERS, uid),
      {
        lastActive: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating last active:', error);
    // Non-critical error, don't throw
  }
};

// ══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ══════════════════════════════════════════════════════════════

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  signUp,
  signIn,
  signOutUser,
  resetPassword,
  getCurrentUser,
  onAuthChange,
  getUserProfile,
};
