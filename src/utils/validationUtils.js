// Together We Ride - Validation Utilities
// Form validation helpers

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true };
};

/**
 * Validate display name
 */
export const validateDisplayName = (displayName) => {
  if (!displayName || displayName.trim() === '') {
    return { valid: false, error: 'Display name is required' };
  }

  if (displayName.length < 2) {
    return { valid: false, error: 'Display name must be at least 2 characters' };
  }

  if (displayName.length > 50) {
    return { valid: false, error: 'Display name must be less than 50 characters' };
  }

  return { valid: true };
};

/**
 * Validate ride title
 */
export const validateRideTitle = (title) => {
  if (!title || title.trim() === '') {
    return { valid: false, error: 'Ride title is required' };
  }

  if (title.length > 100) {
    return { valid: false, error: 'Title must be less than 100 characters' };
  }

  return { valid: true };
};

/**
 * Validate ride description
 */
export const validateRideDescription = (description) => {
  if (description && description.length > 500) {
    return { valid: false, error: 'Description must be less than 500 characters' };
  }

  return { valid: true };
};

/**
 * Validate distance
 */
export const validateDistance = (distance) => {
  if (!distance) {
    return { valid: false, error: 'Distance is required' };
  }

  const num = parseFloat(distance);

  if (isNaN(num)) {
    return { valid: false, error: 'Distance must be a number' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Distance must be greater than 0' };
  }

  if (num > 500) {
    return { valid: false, error: 'Distance must be less than 500 km' };
  }

  return { valid: true, value: num };
};

/**
 * Validate duration (in seconds)
 */
export const validateDuration = (duration) => {
  if (!duration) {
    return { valid: false, error: 'Duration is required' };
  }

  const num = parseInt(duration);

  if (isNaN(num)) {
    return { valid: false, error: 'Duration must be a number' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Duration must be greater than 0' };
  }

  if (num > 86400) {
    // 24 hours
    return { valid: false, error: 'Duration must be less than 24 hours' };
  }

  return { valid: true, value: num };
};

/**
 * Validate max riders
 */
export const validateMaxRiders = (maxRiders) => {
  if (!maxRiders) {
    return { valid: false, error: 'Maximum riders is required' };
  }

  const num = parseInt(maxRiders);

  if (isNaN(num)) {
    return { valid: false, error: 'Maximum riders must be a number' };
  }

  if (num < 2) {
    return { valid: false, error: 'Must allow at least 2 riders' };
  }

  if (num > 100) {
    return { valid: false, error: 'Maximum riders cannot exceed 100' };
  }

  return { valid: true, value: num };
};

/**
 * Validate location/address
 */
export const validateLocation = (location) => {
  if (!location || location.trim() === '') {
    return { valid: false, error: 'Location is required' };
  }

  if (location.length > 200) {
    return { valid: false, error: 'Location must be less than 200 characters' };
  }

  return { valid: true };
};

/**
 * Validate date (must be in future)
 */
export const validateFutureDate = (date) => {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }

  const selectedDate = new Date(date);
  const now = new Date();

  if (selectedDate <= now) {
    return { valid: false, error: 'Date must be in the future' };
  }

  return { valid: true };
};

/**
 * Validate form with multiple fields
 */
export const validateForm = (fields, validators) => {
  const errors = {};

  Object.keys(validators).forEach((fieldName) => {
    const validator = validators[fieldName];
    const value = fields[fieldName];

    const result = validator(value);

    if (!result.valid) {
      errors[fieldName] = result.error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validateRideTitle,
  validateRideDescription,
  validateDistance,
  validateDuration,
  validateMaxRiders,
  validateLocation,
  validateFutureDate,
  validateForm,
};
