// Together We Ride - Youth Program Service
// Manages youth cycling programs that receive funded sessions

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
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';

// ══════════════════════════════════════════════════════════════
// GET YOUTH PROGRAMS
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
 * Get a single youth program by ID
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
 * Get programs by location/region
 */
export const getProgramsByLocation = async (region) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.YOUTH_PROGRAMS),
      where('active', '==', true),
      where('location.region', '==', region),
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
    console.error('Error getting programs by location:', error);
    return {
      success: false,
      error: 'Failed to load programs',
      programs: [],
    };
  }
};

/**
 * Get featured/top programs
 */
export const getFeaturedPrograms = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.YOUTH_PROGRAMS),
      where('active', '==', true),
      orderBy('sessionsDelivered', 'desc'),
      limit(limitCount)
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
    console.error('Error getting featured programs:', error);
    return {
      success: false,
      error: 'Failed to load featured programs',
      programs: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// PROGRAM IMPACT & STATISTICS
// ══════════════════════════════════════════════════════════════

/**
 * Get program impact statistics
 */
export const getProgramImpact = async (programId) => {
  try {
    const { success, program } = await getYouthProgram(programId);

    if (!success) {
      return { success: false, error: 'Program not found' };
    }

    const impact = {
      sessionsReceived: program.sessionsReceived || 0,
      sessionsDelivered: program.sessionsDelivered || 0,
      sessionsPending: program.sessionsPending || 0,
      totalValue: (program.sessionsReceived || 0) * 25,
      youthParticipants: program.youthParticipants || 0,
      bikesProvided: program.bikesProvided || 0,
      lessonsDelivered: program.lessonsDelivered || 0,
      eventsHosted: program.eventsHosted || 0,
      utilizationRate:
        program.sessionsReceived > 0
          ? Math.round((program.sessionsDelivered / program.sessionsReceived) * 100)
          : 0,
    };

    return {
      success: true,
      impact,
    };
  } catch (error) {
    console.error('Error getting program impact:', error);
    return {
      success: false,
      error: 'Failed to load program impact',
    };
  }
};

/**
 * Get total community impact across all programs
 */
export const getTotalProgramsImpact = async () => {
  try {
    const { success, programs } = await getYouthPrograms();

    if (!success) {
      return { success: false, error: 'Failed to load programs' };
    }

    const totalImpact = programs.reduce(
      (acc, program) => {
        acc.totalSessions += program.sessionsReceived || 0;
        acc.sessionsDelivered += program.sessionsDelivered || 0;
        acc.youthParticipants += program.youthParticipants || 0;
        acc.bikesProvided += program.bikesProvided || 0;
        acc.lessonsDelivered += program.lessonsDelivered || 0;
        return acc;
      },
      {
        totalSessions: 0,
        sessionsDelivered: 0,
        youthParticipants: 0,
        bikesProvided: 0,
        lessonsDelivered: 0,
      }
    );

    totalImpact.totalValue = totalImpact.totalSessions * 25;
    totalImpact.totalPrograms = programs.length;

    return {
      success: true,
      totalImpact,
    };
  } catch (error) {
    console.error('Error getting total programs impact:', error);
    return {
      success: false,
      error: 'Failed to calculate total impact',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// TESTIMONIALS & SUCCESS STORIES
// ══════════════════════════════════════════════════════════════

/**
 * Get testimonials from a program
 */
export const getProgramTestimonials = async (programId) => {
  try {
    const { success, program } = await getYouthProgram(programId);

    if (!success) {
      return { success: false, error: 'Program not found' };
    }

    return {
      success: true,
      testimonials: program.testimonials || [],
    };
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return {
      success: false,
      error: 'Failed to load testimonials',
      testimonials: [],
    };
  }
};

/**
 * Get recent success stories across all programs
 */
export const getSuccessStories = async (limitCount = 10) => {
  try {
    const { success, programs } = await getYouthPrograms();

    if (!success) {
      return { success: false, error: 'Failed to load programs' };
    }

    // Collect all testimonials with program info
    const allStories = [];

    programs.forEach((program) => {
      if (program.testimonials && program.testimonials.length > 0) {
        program.testimonials.forEach((testimonial) => {
          allStories.push({
            ...testimonial,
            programId: program.id,
            programName: program.name,
            programLocation: program.location,
          });
        });
      }
    });

    // Sort by date (most recent first)
    allStories.sort((a, b) => {
      const dateA = a.date?.toDate?.() || new Date(0);
      const dateB = b.date?.toDate?.() || new Date(0);
      return dateB - dateA;
    });

    // Limit results
    const stories = allStories.slice(0, limitCount);

    return {
      success: true,
      stories,
    };
  } catch (error) {
    console.error('Error getting success stories:', error);
    return {
      success: false,
      error: 'Failed to load success stories',
      stories: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to active youth programs (real-time)
 */
export const subscribeToYouthPrograms = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.YOUTH_PROGRAMS),
    where('active', '==', true),
    orderBy('sessionsReceived', 'desc')
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const programs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(programs);
    },
    (error) => {
      console.error('Error subscribing to youth programs:', error);
      callback([]);
    }
  );
};

/**
 * Subscribe to a single youth program (real-time)
 */
export const subscribeToYouthProgram = (programId, callback) => {
  return onSnapshot(
    doc(db, COLLECTIONS.YOUTH_PROGRAMS, programId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to youth program:', error);
      callback(null);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Calculate program utilization percentage
 */
export const calculateUtilization = (sessionsReceived, sessionsDelivered) => {
  if (sessionsReceived === 0) return 0;
  return Math.round((sessionsDelivered / sessionsReceived) * 100);
};

/**
 * Get program status based on session delivery
 */
export const getProgramStatus = (program) => {
  const pendingSessions = program.sessionsPending || 0;

  if (pendingSessions === 0) {
    return 'fully_utilized';
  } else if (pendingSessions < 10) {
    return 'low_capacity';
  } else {
    return 'accepting_sessions';
  }
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  getYouthPrograms,
  getYouthProgram,
  getProgramsByLocation,
  getFeaturedPrograms,
  getProgramImpact,
  getTotalProgramsImpact,
  getProgramTestimonials,
  getSuccessStories,
  subscribeToYouthPrograms,
  subscribeToYouthProgram,
  calculateUtilization,
  getProgramStatus,
};
