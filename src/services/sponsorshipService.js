// Together We Ride - Sponsorship Service
// Manages corporate sponsors and their impact multipliers

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { SPONSOR_TIERS } from '../config/constants';

// ══════════════════════════════════════════════════════════════
// GET SPONSORS
// ══════════════════════════════════════════════════════════════

/**
 * Get all active sponsors
 */
export const getActiveSponsors = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SPONSORS),
      where('active', '==', true),
      orderBy('multiplier', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sponsors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      sponsors,
    };
  } catch (error) {
    console.error('Error getting sponsors:', error);
    return {
      success: false,
      error: 'Failed to load sponsors',
      sponsors: [],
    };
  }
};

/**
 * Get a single sponsor by ID
 */
export const getSponsor = async (sponsorId) => {
  try {
    const sponsorDoc = await getDoc(doc(db, COLLECTIONS.SPONSORS, sponsorId));

    if (sponsorDoc.exists()) {
      return {
        success: true,
        sponsor: { id: sponsorDoc.id, ...sponsorDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Sponsor not found',
      };
    }
  } catch (error) {
    console.error('Error getting sponsor:', error);
    return {
      success: false,
      error: 'Failed to load sponsor',
    };
  }
};

/**
 * Get sponsors by tier
 */
export const getSponsorsByTier = async (tier) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SPONSORS),
      where('tier', '==', tier),
      where('active', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const sponsors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      sponsors,
    };
  } catch (error) {
    console.error('Error getting sponsors by tier:', error);
    return {
      success: false,
      error: 'Failed to load sponsors',
      sponsors: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// SPONSOR IMPACT STATS
// ══════════════════════════════════════════════════════════════

/**
 * Get sponsor's total impact contribution
 */
export const getSponsorImpact = async (sponsorId) => {
  try {
    const sponsor = await getSponsor(sponsorId);

    if (!sponsor.success) {
      return sponsor;
    }

    const sponsorData = sponsor.sponsor;

    // Calculate total impact value
    const totalImpactValue = sponsorData.sessionsFunded * 25; // $25 per session

    return {
      success: true,
      impact: {
        sessionsFunded: sponsorData.sessionsFunded || 0,
        totalContribution: sponsorData.totalContribution || 0,
        impactValue: totalImpactValue,
        activeEmployees: sponsorData.activeEmployees || 0,
        totalEmployeeKm: sponsorData.totalEmployeeKm || 0,
        multiplier: sponsorData.multiplier,
        tier: sponsorData.tier,
      },
    };
  } catch (error) {
    console.error('Error getting sponsor impact:', error);
    return {
      success: false,
      error: 'Failed to load sponsor impact',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// SPONSOR MATCHING
// ══════════════════════════════════════════════════════════════

/**
 * Get sponsor multiplier for a user (if they're part of a sponsored company)
 */
export const getUserSponsorMultiplier = async (userId) => {
  try {
    // In production, you would check user's company affiliation
    // For now, return default multiplier of 1
    // This would be enhanced with company-user relationship tracking

    // Example query (if you have a user_companies table):
    // const userCompanyDoc = await getDoc(doc(db, 'user_companies', userId));
    // if (userCompanyDoc.exists()) {
    //   const companyId = userCompanyDoc.data().companyId;
    //   const sponsor = await getSponsor(companyId);
    //   return sponsor.sponsor.multiplier;
    // }

    return {
      success: true,
      multiplier: 1, // Default: no sponsorship
      sponsorName: null,
    };
  } catch (error) {
    console.error('Error getting user sponsor multiplier:', error);
    return {
      success: false,
      multiplier: 1, // Default on error
    };
  }
};

/**
 * Check if user is part of a sponsored company
 */
export const isUserSponsored = async (userId) => {
  const { multiplier } = await getUserSponsorMultiplier(userId);
  return multiplier > 1;
};

// ══════════════════════════════════════════════════════════════
// SPONSOR LEADERBOARD
// ══════════════════════════════════════════════════════════════

/**
 * Get top sponsors by impact
 */
export const getSponsorLeaderboard = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SPONSORS),
      where('active', '==', true),
      orderBy('sessionsFunded', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = querySnapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      ...doc.data(),
      impactValue: (doc.data().sessionsFunded || 0) * 25,
    }));

    return {
      success: true,
      leaderboard,
    };
  } catch (error) {
    console.error('Error getting sponsor leaderboard:', error);
    return {
      success: false,
      error: 'Failed to load sponsor leaderboard',
      leaderboard: [],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Subscribe to active sponsors (real-time)
 */
export const subscribeToSponsors = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.SPONSORS),
    where('active', '==', true),
    orderBy('multiplier', 'desc')
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const sponsors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(sponsors);
    },
    (error) => {
      console.error('Error subscribing to sponsors:', error);
      callback([]);
    }
  );
};

/**
 * Subscribe to a single sponsor (real-time)
 */
export const subscribeToSponsor = (sponsorId, callback) => {
  return onSnapshot(
    doc(db, COLLECTIONS.SPONSORS, sponsorId),
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to sponsor:', error);
      callback(null);
    }
  );
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Format sponsor tier label
 */
export const formatSponsorTier = (tier) => {
  const tierLabels = {
    [SPONSOR_TIERS.BRONZE]: 'Bronze Partner',
    [SPONSOR_TIERS.SILVER]: 'Silver Partner',
    [SPONSOR_TIERS.GOLD]: 'Gold Partner',
    [SPONSOR_TIERS.PLATINUM]: 'Platinum Partner',
  };

  return tierLabels[tier] || 'Partner';
};

/**
 * Get tier color
 */
export const getTierColor = (tier) => {
  const tierColors = {
    [SPONSOR_TIERS.BRONZE]: '#CD7F32',
    [SPONSOR_TIERS.SILVER]: '#C0C0C0',
    [SPONSOR_TIERS.GOLD]: '#FFD700',
    [SPONSOR_TIERS.PLATINUM]: '#E5E4E2',
  };

  return tierColors[tier] || '#6200ee';
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  getActiveSponsors,
  getSponsor,
  getSponsorsByTier,
  getSponsorImpact,
  getUserSponsorMultiplier,
  isUserSponsored,
  getSponsorLeaderboard,
  subscribeToSponsors,
  subscribeToSponsor,
  formatSponsorTier,
  getTierColor,
};
