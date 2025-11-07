// Together We Ride - useMedia Hook
// Hook for camera and media operations

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { uploadImage, uploadVideo } from '../services/mediaService';

export const useMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  // Request media library permission
  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        setError('Camera permission denied');
        return { success: false, error: 'Camera permission denied' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return {
          success: true,
          uri: result.assets[0].uri,
          type: 'image',
        };
      }

      return { success: false, canceled: true };
    } catch (err) {
      console.error('Error taking photo:', err);
      setError('Failed to take photo');
      return { success: false, error: 'Failed to take photo' };
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermission();

      if (!hasPermission) {
        setError('Media library permission denied');
        return { success: false, error: 'Media library permission denied' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return {
          success: true,
          uri: result.assets[0].uri,
          type: 'image',
        };
      }

      return { success: false, canceled: true };
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image');
      return { success: false, error: 'Failed to pick image' };
    }
  };

  // Record video
  const recordVideo = async () => {
    try {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        setError('Camera permission denied');
        return { success: false, error: 'Camera permission denied' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        videoMaxDuration: 30, // 30 seconds max
        quality: 0.8,
      });

      if (!result.canceled) {
        return {
          success: true,
          uri: result.assets[0].uri,
          type: 'video',
        };
      }

      return { success: false, canceled: true };
    } catch (err) {
      console.error('Error recording video:', err);
      setError('Failed to record video');
      return { success: false, error: 'Failed to record video' };
    }
  };

  // Upload image
  const uploadImageFile = async (uri, userId, context, contextId) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const result = await uploadImage(uri, userId, context, contextId, (progress) => {
      setUploadProgress(progress);
    });

    setUploading(false);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  // Upload video
  const uploadVideoFile = async (uri, userId, context, contextId) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const result = await uploadVideo(uri, userId, context, contextId, (progress) => {
      setUploadProgress(progress);
    });

    setUploading(false);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  return {
    takePhoto,
    pickImage,
    recordVideo,
    uploadImageFile,
    uploadVideoFile,
    uploading,
    uploadProgress,
    error,
  };
};

export default useMedia;
