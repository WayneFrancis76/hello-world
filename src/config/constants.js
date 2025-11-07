// Together We Ride - App-wide Constants
// Design system configuration for consistent UI/UX

// ══════════════════════════════════════════════════════════════
// COLOR PALETTE
// ══════════════════════════════════════════════════════════════

export const COLORS = {
  // Primary Brand Colors
  primary: '#6200ee',
  primaryLight: '#9d46ff',
  primaryDark: '#0a00b6',

  // Secondary Colors
  secondary: '#03dac6',
  secondaryLight: '#66fff9',
  secondaryDark: '#00a896',

  // Impact Colors (The heart of our platform!)
  impactGreen: '#00C853',
  impactGreenLight: '#5EFC82',
  impactGold: '#FFD700',
  impactGoldDark: '#FFA000',

  // Activity Type Colors
  cycling: '#6200ee',
  walking: '#2196F3',
  wheeling: '#00BCD4',
  running: '#FF5722',

  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Difficulty Colors
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',

  // Neutral Colors
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceDark: '#121212',

  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textInverse: '#ffffff',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Border Colors
  border: '#E0E0E0',
  borderDark: '#9E9E9E',

  // Sponsor Tier Colors
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

// ══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ══════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
    massive: 48,
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// ══════════════════════════════════════════════════════════════
// SPACING SYSTEM
// ══════════════════════════════════════════════════════════════

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ══════════════════════════════════════════════════════════════
// SIZING
// ══════════════════════════════════════════════════════════════

export const SIZING = {
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Icon Sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },

  // Avatar Sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    xxl: 128,
  },

  // Touch Target (minimum for accessibility)
  touchTarget: 44,

  // Common Element Heights
  buttonHeight: 48,
  inputHeight: 56,
  tabBarHeight: 60,
  headerHeight: 56,
};

// ══════════════════════════════════════════════════════════════
// SHADOWS
// ══════════════════════════════════════════════════════════════

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },

  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

// ══════════════════════════════════════════════════════════════
// ANIMATION TIMINGS
// ══════════════════════════════════════════════════════════════

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  },

  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ══════════════════════════════════════════════════════════════
// RIDE CONSTANTS
// ══════════════════════════════════════════════════════════════

export const RIDE_TYPES = {
  ROAD: 'road',
  GRAVEL: 'gravel',
  MTB: 'mtb',
  VIRTUAL: 'virtual',
};

export const RIDE_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const RIDE_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const RIDE_TYPE_LABELS = {
  [RIDE_TYPES.ROAD]: 'Road',
  [RIDE_TYPES.GRAVEL]: 'Gravel',
  [RIDE_TYPES.MTB]: 'Mountain Bike',
  [RIDE_TYPES.VIRTUAL]: 'Virtual',
};

export const DIFFICULTY_LABELS = {
  [RIDE_DIFFICULTY.BEGINNER]: 'Beginner',
  [RIDE_DIFFICULTY.INTERMEDIATE]: 'Intermediate',
  [RIDE_DIFFICULTY.ADVANCED]: 'Advanced',
};

// ══════════════════════════════════════════════════════════════
// ACTIVITY CONSTANTS (Core of Active Impact Platform!)
// ══════════════════════════════════════════════════════════════

export const ACTIVITY_TYPES = {
  CYCLING: 'cycling',
  WALKING: 'walking',
  WHEELING: 'wheeling',
  RUNNING: 'running',
};

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.CYCLING]: 'Cycling',
  [ACTIVITY_TYPES.WALKING]: 'Walking',
  [ACTIVITY_TYPES.WHEELING]: 'Wheeling',
  [ACTIVITY_TYPES.RUNNING]: 'Running',
};

export const ACTIVITY_TYPE_ICONS = {
  [ACTIVITY_TYPES.CYCLING]: 'bicycle',
  [ACTIVITY_TYPES.WALKING]: 'walk',
  [ACTIVITY_TYPES.WHEELING]: 'wheelchair',
  [ACTIVITY_TYPES.RUNNING]: 'run',
};

export const ACTIVITY_TYPE_COLORS = {
  [ACTIVITY_TYPES.CYCLING]: COLORS.cycling,
  [ACTIVITY_TYPES.WALKING]: COLORS.walking,
  [ACTIVITY_TYPES.WHEELING]: COLORS.wheeling,
  [ACTIVITY_TYPES.RUNNING]: COLORS.running,
};

// ══════════════════════════════════════════════════════════════
// SPONSOR TIER CONSTANTS
// ══════════════════════════════════════════════════════════════

export const SPONSOR_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

export const SPONSOR_TIER_LABELS = {
  [SPONSOR_TIERS.BRONZE]: 'Bronze',
  [SPONSOR_TIERS.SILVER]: 'Silver',
  [SPONSOR_TIERS.GOLD]: 'Gold',
  [SPONSOR_TIERS.PLATINUM]: 'Platinum',
};

export const SPONSOR_TIER_MULTIPLIERS = {
  [SPONSOR_TIERS.BRONZE]: 1.5,
  [SPONSOR_TIERS.SILVER]: 2,
  [SPONSOR_TIERS.GOLD]: 3,
  [SPONSOR_TIERS.PLATINUM]: 5,
};

export const SPONSOR_TIER_COLORS = {
  [SPONSOR_TIERS.BRONZE]: COLORS.bronze,
  [SPONSOR_TIERS.SILVER]: COLORS.silver,
  [SPONSOR_TIERS.GOLD]: COLORS.gold,
  [SPONSOR_TIERS.PLATINUM]: COLORS.platinum,
};

// ══════════════════════════════════════════════════════════════
// LOCATION & GPS CONSTANTS
// ══════════════════════════════════════════════════════════════

export const LOCATION = {
  // Update interval during active tracking (milliseconds)
  UPDATE_INTERVAL: 5000, // 5 seconds

  // Minimum distance between updates (meters)
  MIN_DISTANCE: 10, // 10 meters

  // GPS accuracy thresholds (meters)
  ACCURACY_EXCELLENT: 10,
  ACCURACY_GOOD: 50,
  ACCURACY_FAIR: 100,
  ACCURACY_POOR: 500,

  // Auto-pause detection (milliseconds of inactivity)
  AUTO_PAUSE_THRESHOLD: 120000, // 2 minutes

  // Minimum speed to consider "moving" (km/h)
  MIN_SPEED_THRESHOLD: 1,

  // Location permission error messages
  PERMISSION_DENIED: 'Location permission denied. Please enable location access in settings.',
  LOCATION_UNAVAILABLE: 'Location services unavailable. Please enable location services.',
};

// ══════════════════════════════════════════════════════════════
// MEDIA CONSTANTS
// ══════════════════════════════════════════════════════════════

export const MEDIA = {
  // Image constraints
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2 MB
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  IMAGE_QUALITY: 0.8, // 80%

  // Video constraints
  MAX_VIDEO_DURATION: 30, // seconds
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50 MB

  // File types
  SUPPORTED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'heic'],
  SUPPORTED_VIDEO_TYPES: ['mp4', 'mov'],
};

// ══════════════════════════════════════════════════════════════
// PAGINATION & LIMITS
// ══════════════════════════════════════════════════════════════

export const LIMITS = {
  // List pagination
  RIDES_PER_PAGE: 20,
  ACTIVITIES_PER_PAGE: 20,
  MEDIA_PER_PAGE: 30,
  NOTIFICATIONS_PER_PAGE: 50,

  // Input limits
  MAX_RIDE_TITLE_LENGTH: 100,
  MAX_RIDE_DESCRIPTION_LENGTH: 500,
  MAX_BIO_LENGTH: 200,
  MAX_ACTIVITY_NOTES_LENGTH: 300,

  // Ride constraints
  MIN_RIDE_PARTICIPANTS: 2,
  MAX_RIDE_PARTICIPANTS: 100,

  // Search debounce
  SEARCH_DEBOUNCE_MS: 300,

  // Cache duration
  CACHE_DURATION_MS: 300000, // 5 minutes
  IMPACT_CACHE_DURATION_MS: 30000, // 30 seconds (impact data updates frequently)
};

// ══════════════════════════════════════════════════════════════
// NOTIFICATION TYPES
// ══════════════════════════════════════════════════════════════

export const NOTIFICATION_TYPES = {
  RIDE_REMINDER_24H: 'ride_reminder_24h',
  RIDE_REMINDER_1H: 'ride_reminder_1h',
  RIDE_PARTICIPANT_JOINED: 'ride_participant_joined',
  RIDE_CANCELLED: 'ride_cancelled',
  MEDIA_REACTION: 'media_reaction',
  IMPACT_MILESTONE: 'impact_milestone',
  WEEKLY_IMPACT_SUMMARY: 'weekly_impact_summary',
  MONTHLY_IMPACT_REPORT: 'monthly_impact_report',
  YOUTH_PROGRAM_FUNDED: 'youth_program_funded',
  SPONSOR_MATCH_ACTIVATED: 'sponsor_match_activated',
  CHALLENGE_INVITATION: 'challenge_invitation',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  NEW_FOLLOWER: 'new_follower',
};

// ══════════════════════════════════════════════════════════════
// ERROR MESSAGES
// ══════════════════════════════════════════════════════════════

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_FAILED: 'Authentication failed. Please check your credentials.',
  PERMISSION_DENIED: 'Permission denied. Please enable required permissions.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  GPS_UNAVAILABLE: 'GPS unavailable. Please enable location services.',
  MEDIA_UPLOAD_FAILED: 'Failed to upload media. Please try again.',
  RIDE_FULL: 'This ride is full. You cannot join at this time.',
  INVALID_INPUT: 'Invalid input. Please check your entries.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// ══════════════════════════════════════════════════════════════
// SUCCESS MESSAGES
// ══════════════════════════════════════════════════════════════

export const SUCCESS_MESSAGES = {
  RIDE_CREATED: 'Ride created successfully!',
  RIDE_JOINED: 'You joined the ride!',
  RIDE_LEFT: 'You left the ride.',
  ACTIVITY_LOGGED: 'Activity logged successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEDIA_UPLOADED: 'Media uploaded successfully!',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
};

// ══════════════════════════════════════════════════════════════
// APP METADATA
// ══════════════════════════════════════════════════════════════

export const APP_INFO = {
  NAME: 'Together We Ride',
  TAGLINE: 'Turn Your Activity Into Youth Opportunity',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@togetherweride.app',
  WEBSITE: 'https://togetherweride.app',
  PRIVACY_POLICY_URL: 'https://togetherweride.app/privacy',
  TERMS_URL: 'https://togetherweride.app/terms',
};

// ══════════════════════════════════════════════════════════════
// STORAGE KEYS (for AsyncStorage)
// ══════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  USER_TOKEN: '@together_we_ride:user_token',
  USER_PROFILE: '@together_we_ride:user_profile',
  ONBOARDING_COMPLETED: '@together_we_ride:onboarding_completed',
  CACHED_RIDES: '@together_we_ride:cached_rides',
  CACHED_IMPACT: '@together_we_ride:cached_impact',
  LAST_LOCATION: '@together_we_ride:last_location',
  ACTIVITY_PREFERENCES: '@together_we_ride:activity_preferences',
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SIZING,
  SHADOWS,
  ANIMATION,
  RIDE_TYPES,
  RIDE_DIFFICULTY,
  RIDE_STATUS,
  ACTIVITY_TYPES,
  SPONSOR_TIERS,
  LOCATION,
  MEDIA,
  LIMITS,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_INFO,
  STORAGE_KEYS,
};
