// Together We Ride - Ride Service
// Handles all group ride operations (CRUD, real-time subscriptions, participants)

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { RIDE_STATUS } from '../config/constants';

// ══════════════════════════════════════════════════════════════
// CREATE & MANAGE RIDES
// ══════════════════════════════════════════════════════════════

/**
 * Create a new ride
 */
export const createRide = async (rideData, userId, userName, userAvatar) => {
  try {
    const newRide = {
      ...rideData,
      leaderId: userId,
      leaderName: userName,
      leaderAvatar: userAvatar || null,

      currentRiders: 1, // Leader is first participant
      participants: [userId], // Leader is automatically a participant

      status: RIDE_STATUS.UPCOMING,
      stars: 0,

      // Impact tracking
      totalKmTracked: 0,
      youthSessionsGenerated: 0,
      impactMultiplier: 1, // Default, can be boosted by sponsors

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: null,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.RIDES), newRide);

    return {
      success: true,
      rideId: docRef.id,
      ride: { id: docRef.id, ...newRide },
    };
  } catch (error) {
    console.error('Error creating ride:', error);
    return {
      success: false,
      error: 'Failed to create ride. Please try again.',
    };
  }
};

/**
 * Get a single ride by ID
 */
export const getRide = async (rideId) => {
  try {
    const rideDoc = await getDoc(doc(db, COLLECTIONS.RIDES, rideId));

    if (rideDoc.exists()) {
      return {
        success: true,
        ride: { id: rideDoc.id, ...rideDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Ride not found',
      };
    }
  } catch (error) {
    console.error('Error getting ride:', error);
    return {
      success: false,
      error: 'Failed to load ride',
    };
  }
};

/**
 * Get all upcoming rides (paginated)
 */
export const getUpcomingRides = async (limitCount = 20) => {
  try {
    const now = new Date();
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('status', '==', RIDE_STATUS.UPCOMING),
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const rides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      rides,
    };
  } catch (error) {
    console.error('Error getting upcoming rides:', error);
    return {
      success: false,
      error: 'Failed to load rides',
      rides: [],
    };
  }
};

/**
 * Get rides created by a user
 */
export const getUserCreatedRides = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('leaderId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      rides,
    };
  } catch (error) {
    console.error('Error getting user created rides:', error);
    return {
      success: false,
      error: 'Failed to load your rides',
      rides: [],
    };
  }
};

/**
 * Get rides a user has joined
 */
export const getUserJoinedRides = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('participants', 'array-contains', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      rides,
    };
  } catch (error) {
    console.error('Error getting user joined rides:', error);
    return {
      success: false,
      error: 'Failed to load your rides',
      rides: [],
    };
  }
};

/**
 * Update a ride (leader only)
 */
export const updateRide = async (rideId, updates) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Ride updated successfully',
    };
  } catch (error) {
    console.error('Error updating ride:', error);
    return {
      success: false,
      error: 'Failed to update ride',
    };
  }
};

/**
 * Delete a ride (leader only)
 */
export const deleteRide = async (rideId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.RIDES, rideId));

    return {
      success: true,
      message: 'Ride deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting ride:', error);
    return {
      success: false,
      error: 'Failed to delete ride',
    };
  }
};

/**
 * Cancel a ride
 */
export const cancelRide = async (rideId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      status: RIDE_STATUS.CANCELLED,
      updatedAt: serverTimestamp(),
    });

    // TODO: Send notifications to all participants

    return {
      success: true,
      message: 'Ride cancelled',
    };
  } catch (error) {
    console.error('Error cancelling ride:', error);
    return {
      success: false,
      error: 'Failed to cancel ride',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// PARTICIPANT MANAGEMENT
// ══════════════════════════════════════════════════════════════

/**
 * Join a ride
 */
export const joinRide = async (rideId, userId) => {
  try {
    // First, check if ride is full
    const rideDoc = await getDoc(doc(db, COLLECTIONS.RIDES, rideId));
    if (!rideDoc.exists()) {
      return { success: false, error: 'Ride not found' };
    }

    const rideData = rideDoc.data();
    if (rideData.currentRiders >= rideData.maxRiders) {
      return { success: false, error: 'This ride is full' };
    }

    // Check if already joined
    if (rideData.participants && rideData.participants.includes(userId)) {
      return { success: false, error: 'You have already joined this ride' };
    }

    // Add user to participants
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      participants: arrayUnion(userId),
      currentRiders: increment(1),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Successfully joined the ride!',
    };
  } catch (error) {
    console.error('Error joining ride:', error);
    return {
      success: false,
      error: 'Failed to join ride',
    };
  }
};

/**
 * Leave a ride
 */
export const leaveRide = async (rideId, userId) => {
  try {
    // Check if user is the leader
    const rideDoc = await getDoc(doc(db, COLLECTIONS.RIDES, rideId));
    if (!rideDoc.exists()) {
      return { success: false, error: 'Ride not found' };
    }

    const rideData = rideDoc.data();
    if (rideData.leaderId === userId) {
      return {
        success: false,
        error: 'Ride leaders cannot leave. Please cancel the ride instead.',
      };
    }

    // Remove user from participants
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      participants: arrayRemove(userId),
      currentRiders: increment(-1),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'You have left the ride',
    };
  } catch (error) {
    console.error('Error leaving ride:', error);
    return {
      success: false,
      error: 'Failed to leave ride',
    };
  }
};

/**
 * Check if user is a participant
 */
export const isParticipant = (ride, userId) => {
  return ride.participants && ride.participants.includes(userId);
};

/**
 * Check if user is the ride leader
 */
export const isLeader = (ride, userId) => {
  return ride.leaderId === userId;
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to a single ride (real-time updates)
 */
export const subscribeToRide = (rideId, callback) => {
  return onSnapshot(
    doc(db, COLLECTIONS.RIDES, rideId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    },
    (error) => {
      console.error('Error subscribing to ride:', error);
      callback(null);
    }
  );
};

/**
 * Subscribe to upcoming rides (real-time feed)
 */
export const subscribeToUpcomingRides = (callback, limitCount = 20) => {
  const now = new Date();
  const q = query(
    collection(db, COLLECTIONS.RIDES),
    where('status', '==', RIDE_STATUS.UPCOMING),
    where('date', '>=', now),
    orderBy('date', 'asc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const rides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(rides);
    },
    (error) => {
      console.error('Error subscribing to upcoming rides:', error);
      callback([]);
    }
  );
};

/**
 * Subscribe to user's rides
 */
export const subscribeToUserRides = (userId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.RIDES),
    where('participants', 'array-contains', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const rides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(rides);
    },
    (error) => {
      console.error('Error subscribing to user rides:', error);
      callback([]);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// RIDE STATUS MANAGEMENT
// ══════════════════════════════════════════════════════════════

/**
 * Start a ride (change status to active)
 */
export const startRide = async (rideId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      status: RIDE_STATUS.ACTIVE,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: 'Ride started!' };
  } catch (error) {
    console.error('Error starting ride:', error);
    return { success: false, error: 'Failed to start ride' };
  }
};

/**
 * Complete a ride (change status to completed)
 */
export const completeRide = async (rideId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      status: RIDE_STATUS.COMPLETED,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // TODO: Trigger Cloud Function to calculate and distribute impact

    return { success: true, message: 'Ride completed!' };
  } catch (error) {
    console.error('Error completing ride:', error);
    return { success: false, error: 'Failed to complete ride' };
  }
};

/**
 * Update ride impact stats (called after activities are logged)
 */
export const updateRideImpact = async (rideId, additionalKm, additionalSessions) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.RIDES, rideId), {
      totalKmTracked: increment(additionalKm),
      youthSessionsGenerated: increment(additionalSessions),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating ride impact:', error);
    return { success: false, error: 'Failed to update impact' };
  }
};

// ══════════════════════════════════════════════════════════════
// SEARCH & FILTER
// ══════════════════════════════════════════════════════════════

/**
 * Search rides by various filters
 */
export const searchRides = async (filters = {}) => {
  try {
    let q = query(collection(db, COLLECTIONS.RIDES));

    // Apply filters
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }

    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.startDate) {
      q = query(q, where('date', '>=', filters.startDate));
    }

    if (filters.endDate) {
      q = query(q, where('date', '<=', filters.endDate));
    }

    // Order and limit
    q = query(q, orderBy('date', 'desc'), limit(filters.limit || 20));

    const querySnapshot = await getDocs(q);
    const rides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      rides,
    };
  } catch (error) {
    console.error('Error searching rides:', error);
    return {
      success: false,
      error: 'Search failed',
      rides: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  createRide,
  getRide,
  getUpcomingRides,
  getUserCreatedRides,
  getUserJoinedRides,
  updateRide,
  deleteRide,
  cancelRide,
  joinRide,
  leaveRide,
  isParticipant,
  isLeader,
  subscribeToRide,
  subscribeToUpcomingRides,
  subscribeToUserRides,
  startRide,
  completeRide,
  updateRideImpact,
  searchRides,
};
