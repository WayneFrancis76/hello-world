// Together We Ride - Media Service
// Handles photo/video upload to Firebase Storage and media metadata

import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
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
  serverTimestamp,
} from 'firebase/firestore';
import { storage, db, COLLECTIONS } from './firebase';
import { MEDIA } from '../config/constants';

// ══════════════════════════════════════════════════════════════
// UPLOAD MEDIA
// ══════════════════════════════════════════════════════════════

/**
 * Upload image to Firebase Storage
 * Returns download URL and metadata
 */
export const uploadImage = async (
  imageUri,
  userId,
  context = 'activities',
  contextId = null,
  onProgress = null
) => {
  try {
    // Convert URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Check file size
    if (blob.size > MEDIA.MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: `Image too large. Maximum size is ${MEDIA.MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${Math.random().toString(36).substring(7)}.jpg`;
    const storagePath = `${context}/${contextId || userId}/${filename}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload with progress tracking
    let uploadTask;
    if (onProgress) {
      uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });

      await uploadTask;
    } else {
      await uploadBytes(storageRef, blob);
    }

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    const mediaDoc = await addDoc(collection(db, COLLECTIONS.MEDIA), {
      userId,
      type: 'image',
      url: downloadURL,
      storagePath,
      context, // 'activities', 'rides', 'avatars', etc.
      contextId,
      size: blob.size,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      url: downloadURL,
      mediaId: mediaDoc.id,
      storagePath,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.',
    };
  }
};

/**
 * Upload video to Firebase Storage
 */
export const uploadVideo = async (
  videoUri,
  userId,
  context = 'activities',
  contextId = null,
  onProgress = null
) => {
  try {
    // Convert URI to blob
    const response = await fetch(videoUri);
    const blob = await response.blob();

    // Check file size
    if (blob.size > MEDIA.MAX_VIDEO_SIZE) {
      return {
        success: false,
        error: `Video too large. Maximum size is ${MEDIA.MAX_VIDEO_SIZE / 1024 / 1024}MB`,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${Math.random().toString(36).substring(7)}.mp4`;
    const storagePath = `${context}/${contextId || userId}/${filename}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload with progress tracking
    let uploadTask;
    if (onProgress) {
      uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });

      await uploadTask;
    } else {
      await uploadBytes(storageRef, blob);
    }

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    const mediaDoc = await addDoc(collection(db, COLLECTIONS.MEDIA), {
      userId,
      type: 'video',
      url: downloadURL,
      storagePath,
      context,
      contextId,
      size: blob.size,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      url: downloadURL,
      mediaId: mediaDoc.id,
      storagePath,
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    return {
      success: false,
      error: 'Failed to upload video. Please try again.',
    };
  }
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (imageUri, userId, onProgress = null) => {
  return uploadImage(imageUri, userId, 'avatars', userId, onProgress);
};

// ══════════════════════════════════════════════════════════════
// DELETE MEDIA
// ══════════════════════════════════════════════════════════════

/**
 * Delete media from Storage and Firestore
 */
export const deleteMedia = async (mediaId) => {
  try {
    // Get media metadata
    const mediaDoc = await getDoc(doc(db, COLLECTIONS.MEDIA, mediaId));

    if (!mediaDoc.exists()) {
      return { success: false, error: 'Media not found' };
    }

    const mediaData = mediaDoc.data();

    // Delete from Storage
    const storageRef = ref(storage, mediaData.storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTIONS.MEDIA, mediaId));

    return {
      success: true,
      message: 'Media deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting media:', error);
    return {
      success: false,
      error: 'Failed to delete media',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// GET MEDIA
// ══════════════════════════════════════════════════════════════

/**
 * Get media by context (ride, activity, etc.)
 */
export const getMediaByContext = async (context, contextId, limitCount = 30) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MEDIA),
      where('context', '==', context),
      where('contextId', '==', contextId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const media = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      media,
    };
  } catch (error) {
    console.error('Error getting media:', error);
    return {
      success: false,
      error: 'Failed to load media',
      media: [],
    };
  }
};

/**
 * Get user's uploaded media
 */
export const getUserMedia = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MEDIA),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const media = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      media,
    };
  } catch (error) {
    console.error('Error getting user media:', error);
    return {
      success: false,
      error: 'Failed to load media',
      media: [],
    };
  }
};

/**
 * Get single media item
 */
export const getMedia = async (mediaId) => {
  try {
    const mediaDoc = await getDoc(doc(db, COLLECTIONS.MEDIA, mediaId));

    if (mediaDoc.exists()) {
      return {
        success: true,
        media: { id: mediaDoc.id, ...mediaDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Media not found',
      };
    }
  } catch (error) {
    console.error('Error getting media:', error);
    return {
      success: false,
      error: 'Failed to load media',
    };
  }
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Compress image before upload (placeholder - implement with expo-image-manipulator)
 */
export const compressImage = async (imageUri) => {
  // In a real app, use expo-image-manipulator to compress
  // For now, just return the original URI
  return imageUri;
};

/**
 * Generate thumbnail for video (placeholder)
 */
export const generateVideoThumbnail = async (videoUri) => {
  // In a real app, use expo-video-thumbnails
  // For now, return null
  return null;
};

/**
 * Validate media file
 */
export const validateMedia = (fileUri, type) => {
  if (!fileUri) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file extension
  const extension = fileUri.split('.').pop().toLowerCase();

  if (type === 'image') {
    if (!MEDIA.SUPPORTED_IMAGE_TYPES.includes(extension)) {
      return {
        valid: false,
        error: `Unsupported image format. Supported: ${MEDIA.SUPPORTED_IMAGE_TYPES.join(', ')}`,
      };
    }
  } else if (type === 'video') {
    if (!MEDIA.SUPPORTED_VIDEO_TYPES.includes(extension)) {
      return {
        valid: false,
        error: `Unsupported video format. Supported: ${MEDIA.SUPPORTED_VIDEO_TYPES.join(', ')}`,
      };
    }
  }

  return { valid: true };
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export default {
  uploadImage,
  uploadVideo,
  uploadAvatar,
  deleteMedia,
  getMediaByContext,
  getUserMedia,
  getMedia,
  compressImage,
  generateVideoThumbnail,
  validateMedia,
};
