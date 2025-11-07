// Together We Ride - Date Utilities
// Helper functions for date formatting and calculations

/**
 * Format date to readable string
 * Example: "Mar 15, 2024"
 */
export const formatDate = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format time to readable string
 * Example: "2:30 PM"
 */
export const formatTime = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format date and time together
 * Example: "Mar 15, 2024 at 2:30 PM"
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Format duration in seconds to readable string
 * Example: 3665 seconds → "1h 1m 5s"
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Format duration in seconds to HH:MM:SS
 * Example: 3665 → "01:01:05"
 */
export const formatDurationHMS = (seconds) => {
  if (!seconds || seconds <= 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs].map((v) => String(v).padStart(2, '0')).join(':');
};

/**
 * Get relative time string
 * Example: "2 hours ago", "in 3 days"
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isPast = diffMs < 0;

  if (diffSec < 60) {
    return isPast ? 'just now' : 'in a moment';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return isPast
      ? `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
      : `in ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return isPast
      ? `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
      : `in ${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return isPast
      ? `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
      : `in ${diffDay} day${diffDay > 1 ? 's' : ''}`;
  }

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return isPast
      ? `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`
      : `in ${diffWeek} week${diffWeek > 1 ? 's' : ''}`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return isPast
      ? `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
      : `in ${diffMonth} month${diffMonth > 1 ? 's' : ''}`;
  }

  const diffYear = Math.floor(diffDay / 365);
  return isPast
    ? `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
    : `in ${diffYear} year${diffYear > 1 ? 's' : ''}`;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const d = date.toDate ? date.toDate() : new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 */
export const isPast = (date) => {
  if (!date) return false;

  const d = date.toDate ? date.toDate() : new Date(date);
  return d.getTime() < new Date().getTime();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date) => {
  if (!date) return false;

  const d = date.toDate ? date.toDate() : new Date(date);
  return d.getTime() > new Date().getTime();
};

/**
 * Get start of day
 */
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 */
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const startOfWeek = new Date(d.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get start of year
 */
export const getStartOfYear = (date = new Date()) => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Subtract days from date
 */
export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

/**
 * Days between two dates
 */
export const daysBetween = (date1, date2) => {
  const d1 = date1.toDate ? date1.toDate() : new Date(date1);
  const d2 = date2.toDate ? date2.toDate() : new Date(date2);

  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatDurationHMS,
  getRelativeTime,
  isToday,
  isPast,
  isFuture,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getStartOfMonth,
  getStartOfYear,
  addDays,
  subtractDays,
  daysBetween,
};
