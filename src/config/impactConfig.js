// Together We Ride - Active Impact Platform Configuration
// This is the HEART of the app - where activity transforms into youth opportunity

// ══════════════════════════════════════════════════════════════
// IMPACT CONVERSION RATES
// ══════════════════════════════════════════════════════════════

// The fundamental equation of our platform: Distance → Youth Sessions
// These rates determine how many youth cycling sessions are funded per km

export const IMPACT_CONVERSION = {
  // Base conversion rate (youth sessions per km)
  // Example: 1 km = 0.5 youth sessions means 2 km funds 1 complete youth session
  BASE_RATE_KM_TO_SESSIONS: 0.5,

  // Activity type multipliers (some activities may have different rates)
  ACTIVITY_MULTIPLIERS: {
    cycling: 1.0, // Standard rate
    walking: 1.0, // Equal impact - we value all active movement
    wheeling: 1.2, // Slight bonus for inclusive activities
    running: 1.0, // Standard rate
  },

  // Minimum distance to register impact (prevents spam)
  MIN_DISTANCE_FOR_IMPACT: 0.5, // 0.5 km minimum

  // Maximum single activity distance (fraud prevention)
  MAX_SINGLE_ACTIVITY_DISTANCE: 500, // 500 km max per activity
};

// ══════════════════════════════════════════════════════════════
// CORPORATE SPONSORSHIP MULTIPLIERS
// ══════════════════════════════════════════════════════════════

export const SPONSOR_MULTIPLIERS = {
  bronze: {
    multiplier: 1.5,
    label: 'Bronze Partner',
    description: '1.5x impact matching',
    minMonthlyCommitment: 500, // USD
    color: '#CD7F32',
  },
  silver: {
    multiplier: 2.0,
    label: 'Silver Partner',
    description: '2x impact matching',
    minMonthlyCommitment: 1500, // USD
    color: '#C0C0C0',
  },
  gold: {
    multiplier: 3.0,
    label: 'Gold Partner',
    description: '3x impact matching',
    minMonthlyCommitment: 5000, // USD
    color: '#FFD700',
  },
  platinum: {
    multiplier: 5.0,
    label: 'Platinum Partner',
    description: '5x impact matching',
    minMonthlyCommitment: 10000, // USD
    color: '#E5E4E2',
  },
};

// ══════════════════════════════════════════════════════════════
// YOUTH SESSION COSTING
// ══════════════════════════════════════════════════════════════

// What does a "youth session" actually cost and include?
export const YOUTH_SESSION = {
  // Average cost per session (USD)
  COST_PER_SESSION: 25,

  // What's included in a session
  INCLUDES: [
    'Professional cycling instruction',
    'Safety equipment (helmet, reflective gear)',
    'Bike use (if needed)',
    'Snacks and hydration',
    'Insurance coverage',
    'Course completion certificate',
  ],

  // Typical session details
  DURATION_MINUTES: 90,
  MAX_PARTICIPANTS_PER_SESSION: 12,
  MIN_AGE: 6,
  MAX_AGE: 16,
};

// ══════════════════════════════════════════════════════════════
// IMPACT MILESTONES & ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════

export const IMPACT_MILESTONES = {
  distance: [
    { km: 10, badge: 'first_steps', label: 'First Steps', icon: '🌱' },
    { km: 50, badge: 'getting_started', label: 'Getting Started', icon: '🚴' },
    { km: 100, badge: 'century', label: 'Century Club', icon: '💯' },
    { km: 250, badge: 'committed', label: 'Committed Contributor', icon: '⭐' },
    { km: 500, badge: 'champion', label: 'Impact Champion', icon: '🏆' },
    { km: 1000, badge: 'hero', label: 'Community Hero', icon: '🦸' },
    { km: 2500, badge: 'legend', label: 'Living Legend', icon: '👑' },
    { km: 5000, badge: 'ultimate', label: 'Ultimate Impact', icon: '💎' },
    { km: 10000, badge: 'immortal', label: 'Impact Immortal', icon: '🌟' },
  ],

  youthSessions: [
    { sessions: 10, badge: 'first_impact', label: 'First Impact', icon: '🎯' },
    { sessions: 50, badge: 'difference_maker', label: 'Difference Maker', icon: '✨' },
    { sessions: 100, badge: 'youth_supporter', label: 'Youth Supporter', icon: '🎓' },
    { sessions: 250, badge: 'community_builder', label: 'Community Builder', icon: '🏘️' },
    { sessions: 500, badge: 'life_changer', label: 'Life Changer', icon: '💝' },
    { sessions: 1000, badge: 'movement_leader', label: 'Movement Leader', icon: '🚀' },
    { sessions: 2500, badge: 'impact_titan', label: 'Impact Titan', icon: '⚡' },
    { sessions: 5000, badge: 'changemaker', label: 'Changemaker', icon: '🌍' },
  ],

  streaks: [
    { days: 3, badge: 'getting_consistent', label: 'Getting Consistent', icon: '📅' },
    { days: 7, badge: 'week_warrior', label: 'Week Warrior', icon: '🔥' },
    { days: 14, badge: 'two_week_streak', label: 'Two Week Streak', icon: '💪' },
    { days: 30, badge: 'month_master', label: 'Month Master', icon: '📆' },
    { days: 50, badge: 'unstoppable', label: 'Unstoppable', icon: '🚀' },
    { days: 100, badge: 'century_streak', label: 'Century Streak', icon: '💯' },
    { days: 365, badge: 'year_long', label: 'Year Long Impact', icon: '🎊' },
  ],
};

// ══════════════════════════════════════════════════════════════
// YOUTH PROGRAM ALLOCATION ALGORITHM
// ══════════════════════════════════════════════════════════════

export const ALLOCATION_STRATEGY = {
  // How to distribute funded sessions across youth programs
  METHOD: 'weighted_distribution', // Options: 'round_robin', 'weighted_distribution', 'user_choice'

  // Weighting factors for distribution
  WEIGHTS: {
    programNeed: 0.4, // Programs with fewer sessions get priority
    geographic: 0.2, // Prioritize local programs to user
    programPerformance: 0.2, // Programs with good outcomes get more
    equalDistribution: 0.2, // Ensure all programs get some sessions
  },

  // Minimum sessions per month per program
  MIN_SESSIONS_PER_PROGRAM: 10,

  // Maximum percentage of total sessions one program can receive
  MAX_PROGRAM_ALLOCATION_PERCENT: 40,
};

// ══════════════════════════════════════════════════════════════
// IMPACT LEADERBOARDS
// ══════════════════════════════════════════════════════════════

export const LEADERBOARDS = {
  // Leaderboard categories
  CATEGORIES: [
    { id: 'all_time_km', label: 'All-Time Distance', metric: 'totalKmLogged' },
    { id: 'all_time_sessions', label: 'All-Time Sessions', metric: 'youthSessionsFunded' },
    { id: 'monthly_km', label: 'This Month - Distance', metric: 'monthlyKm' },
    { id: 'monthly_sessions', label: 'This Month - Sessions', metric: 'monthlySessions' },
    { id: 'weekly_km', label: 'This Week - Distance', metric: 'weeklyKm' },
    { id: 'current_streak', label: 'Current Streak', metric: 'currentStreak' },
  ],

  // Leaderboard sizes
  TOP_USERS_COUNT: 100,
  DISPLAY_TOP_COUNT: 10, // Show top 10 in main view

  // Update frequency
  UPDATE_FREQUENCY_HOURS: 1, // Recalculate every hour
};

// ══════════════════════════════════════════════════════════════
// IMPACT REPORTING
// ══════════════════════════════════════════════════════════════

export const REPORTING = {
  // Report generation schedule
  WEEKLY_REPORT_DAY: 0, // Sunday
  MONTHLY_REPORT_DAY: 1, // 1st of month

  // Report includes
  METRICS_INCLUDED: [
    'totalKmLogged',
    'youthSessionsFunded',
    'programsSupported',
    'co2Saved', // Bonus environmental metric
    'caloriesBurned', // Health metric
    'timeActive',
    'activitiesCompleted',
    'milestonesReached',
  ],

  // Comparison periods
  COMPARE_TO_PREVIOUS: true,
  SHOW_COMMUNITY_AVERAGE: true,
  SHOW_RANK_CHANGE: true,
};

// ══════════════════════════════════════════════════════════════
// GAMIFICATION SETTINGS
// ══════════════════════════════════════════════════════════════

export const GAMIFICATION = {
  // Points system (for future features)
  POINTS_PER_KM: 10,
  POINTS_PER_SESSION_FUNDED: 50,
  POINTS_FOR_PHOTO: 5,
  POINTS_FOR_RIDE_COMPLETION: 25,

  // Challenge types
  CHALLENGE_TYPES: [
    { id: 'distance', label: 'Distance Challenge', description: 'Log X km in Y days' },
    { id: 'sessions', label: 'Impact Challenge', description: 'Fund X sessions in Y days' },
    { id: 'streak', label: 'Consistency Challenge', description: 'Log activity X days in a row' },
    { id: 'team', label: 'Team Challenge', description: 'Team collective goal' },
  ],

  // Rewards tiers
  REWARD_TIERS: [
    { name: 'Bronze', threshold: 100, color: '#CD7F32' },
    { name: 'Silver', threshold: 500, color: '#C0C0C0' },
    { name: 'Gold', threshold: 1000, color: '#FFD700' },
    { name: 'Platinum', threshold: 5000, color: '#E5E4E2' },
  ],
};

// ══════════════════════════════════════════════════════════════
// IMPACT VISUALIZATION
// ══════════════════════════════════════════════════════════════

export const VISUALIZATION = {
  // Counter animation speed
  COUNTER_ANIMATION_DURATION: 2000, // 2 seconds

  // Graph settings
  CHART_COLORS: {
    cycling: '#6200ee',
    walking: '#2196F3',
    wheeling: '#00BCD4',
    running: '#FF5722',
    impact: '#00C853',
  },

  // Progress bar animations
  PROGRESS_BAR_ANIMATION: true,
  PROGRESS_BAR_DURATION: 1500, // 1.5 seconds

  // Celebration animations
  SHOW_CONFETTI_ON_MILESTONE: true,
  CONFETTI_DURATION: 3000, // 3 seconds

  // Impact meter settings
  METER_SEGMENTS: 10,
  METER_UPDATE_FREQUENCY: 1000, // Update every second during active tracking
};

// ══════════════════════════════════════════════════════════════
// FRAUD PREVENTION
// ══════════════════════════════════════════════════════════════

export const FRAUD_PREVENTION = {
  // Maximum realistic speeds (km/h) by activity type
  MAX_SPEED: {
    cycling: 60, // Professional cyclist speed
    walking: 8, // Fast walking
    wheeling: 15, // Wheelchair racing speed
    running: 25, // Elite runner pace
  },

  // Maximum daily distance by activity type
  MAX_DAILY_DISTANCE: {
    cycling: 300, // Long endurance ride
    walking: 50, // Marathon+
    wheeling: 50, // Marathon equivalent
    running: 50, // Ultramarathon
  },

  // Minimum duration for distance (seconds per km)
  MIN_DURATION_PER_KM: {
    cycling: 120, // 2 minutes per km (30 km/h)
    walking: 480, // 8 minutes per km (7.5 km/h max)
    wheeling: 240, // 4 minutes per km (15 km/h max)
    running: 180, // 3 minutes per km (20 km/h)
  },

  // GPS validation
  REQUIRE_GPS_FOR_DISTANCES_OVER: 20, // km
  MAX_GPS_ACCURACY: 100, // meters
  MIN_GPS_POINTS: 10, // Minimum GPS points for validation

  // Manual review triggers
  MANUAL_REVIEW_TRIGGERS: {
    singleActivityDistanceOver: 200, // km
    dailyDistanceOver: 250, // km
    averageSpeedOver: 45, // km/h for cycling
    suspiciousPattern: true, // Detect repeated identical activities
  },
};

// ══════════════════════════════════════════════════════════════
// SOCIAL SHARING TEMPLATES
// ══════════════════════════════════════════════════════════════

export const SHARING = {
  // Templates for sharing impact
  TEMPLATES: {
    activityComplete: (distance, sessions) =>
      `Just logged ${distance} km on Together We Ride and funded ${sessions} youth cycling sessions! 🚴✨ Every km makes a difference. #TogetherWeRide #ActiveImpact`,

    milestone: (milestone, totalSessions) =>
      `Achievement unlocked: ${milestone}! 🎉 I've now funded ${totalSessions} youth cycling sessions through Together We Ride. Join me in turning activity into opportunity! #TogetherWeRide`,

    weeklyReport: (weekKm, weekSessions) =>
      `This week I logged ${weekKm} km and funded ${weekSessions} youth sessions! 💪 Making an impact one ride at a time. #TogetherWeRide #ActiveImpact`,

    challenge: (challengeName) =>
      `I'm taking on the ${challengeName} challenge on Together We Ride! Join me and let's create impact together! 🚀 #TogetherWeRide`,
  },

  // Social media hashtags
  HASHTAGS: ['#TogetherWeRide', '#ActiveImpact', '#YouthCycling', '#CommunityImpact'],
};

// ══════════════════════════════════════════════════════════════
// NOTIFICATIONS & MOTIVATION
// ══════════════════════════════════════════════════════════════

export const MOTIVATION = {
  // Encouraging messages for different scenarios
  MESSAGES: {
    firstActivity: [
      'Amazing start! Every journey begins with a single ride. 🌟',
      'You just funded your first youth cycling sessions! 🎉',
      'Welcome to the impact movement! Your activity matters. 💪',
    ],

    milestone: [
      'Incredible achievement! You\'re making a real difference! 🏆',
      'Milestone unlocked! The youth thank you! 🙌',
      'You\'re a champion for youth cycling! Keep it up! ⭐',
    ],

    streak: [
      'Consistency is key! Your streak is inspiring! 🔥',
      'Day after day, you\'re creating opportunity! 💫',
      'Your dedication is changing lives! Keep going! 🚀',
    ],

    comeback: [
      'Welcome back! Ready to create more impact? 💪',
      'Every return is a new opportunity to make a difference! ✨',
      'Great to see you again! Let\'s ride! 🚴',
    ],
  },

  // Reminder preferences
  REMINDERS: {
    inactiveAfterDays: 3, // Remind if no activity for 3 days
    weeklyGoalReminder: true,
    monthlyReportNotification: true,
  },
};

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

// Calculate youth sessions from distance
export const calculateYouthSessions = (distanceKm, activityType, sponsorMultiplier = 1) => {
  if (distanceKm < IMPACT_CONVERSION.MIN_DISTANCE_FOR_IMPACT) {
    return 0;
  }

  const activityMultiplier = IMPACT_CONVERSION.ACTIVITY_MULTIPLIERS[activityType] || 1;
  const baseRate = IMPACT_CONVERSION.BASE_RATE_KM_TO_SESSIONS;

  const sessions = distanceKm * baseRate * activityMultiplier * sponsorMultiplier;

  // Round to 1 decimal place
  return Math.round(sessions * 10) / 10;
};

// Calculate monetary value of impact
export const calculateImpactValue = (sessions) => {
  return sessions * YOUTH_SESSION.COST_PER_SESSION;
};

// Get next milestone for user
export const getNextMilestone = (currentKm) => {
  return IMPACT_MILESTONES.distance.find((m) => m.km > currentKm) || null;
};

// Get next session milestone
export const getNextSessionMilestone = (currentSessions) => {
  return IMPACT_MILESTONES.youthSessions.find((m) => m.sessions > currentSessions) || null;
};

// Check if activity is suspicious (fraud detection)
export const isSuspiciousActivity = (activity) => {
  const { distance, duration, type, speed } = activity;

  // Check maximum speed
  if (speed > FRAUD_PREVENTION.MAX_SPEED[type]) {
    return true;
  }

  // Check minimum duration
  const minDuration = distance * FRAUD_PREVENTION.MIN_DURATION_PER_KM[type];
  if (duration < minDuration) {
    return true;
  }

  // Check single activity maximum
  if (distance > FRAUD_PREVENTION.MAX_DAILY_DISTANCE[type]) {
    return true;
  }

  return false;
};

export default {
  IMPACT_CONVERSION,
  SPONSOR_MULTIPLIERS,
  YOUTH_SESSION,
  IMPACT_MILESTONES,
  ALLOCATION_STRATEGY,
  LEADERBOARDS,
  REPORTING,
  GAMIFICATION,
  VISUALIZATION,
  FRAUD_PREVENTION,
  SHARING,
  MOTIVATION,
  calculateYouthSessions,
  calculateImpactValue,
  getNextMilestone,
  getNextSessionMilestone,
  isSuspiciousActivity,
};
