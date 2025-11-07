// Together We Ride - Image Utilities
// Image compression and resizing helpers

import { MEDIA } from '../config/constants';

/**
 * Check if image size exceeds limit
 */
export const isImageTooLarge = (sizeBytes) => {
  return sizeBytes > MEDIA.MAX_IMAGE_SIZE;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Get file extension from URI
 */
export const getFileExtension = (uri) => {
  if (!uri) return '';

  return uri.split('.').pop().toLowerCase();
};

/**
 * Check if file is an image
 */
export const isImage = (uri) => {
  const extension = getFileExtension(uri);
  return MEDIA.SUPPORTED_IMAGE_TYPES.includes(extension);
};

/**
 * Check if file is a video
 */
export const isVideo = (uri) => {
  const extension = getFileExtension(uri);
  return MEDIA.SUPPORTED_VIDEO_TYPES.includes(extension);
};

/**
 * Generate thumbnail URL from image URL (placeholder)
 * In production, use Cloud Functions to generate thumbnails
 */
export const getThumbnailUrl = (imageUrl) => {
  // For now, return original URL
  // In production, implement thumbnail generation
  return imageUrl;
};

/**
 * Calculate resize dimensions maintaining aspect ratio
 */
export const calculateResizeDimensions = (currentWidth, currentHeight, maxWidth, maxHeight) => {
  let width = currentWidth;
  let height = currentHeight;

  // Calculate aspect ratio
  const aspectRatio = width / height;

  // Resize if width exceeds max
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  // Resize if height exceeds max
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = (width, height) => {
  if (width > MEDIA.MAX_IMAGE_WIDTH || height > MEDIA.MAX_IMAGE_HEIGHT) {
    return {
      valid: false,
      error: `Image dimensions exceed maximum (${MEDIA.MAX_IMAGE_WIDTH}x${MEDIA.MAX_IMAGE_HEIGHT})`,
    };
  }

  return { valid: true };
};

export default {
  isImageTooLarge,
  formatFileSize,
  getFileExtension,
  isImage,
  isVideo,
  getThumbnailUrl,
  calculateResizeDimensions,
  validateImageDimensions,
};
