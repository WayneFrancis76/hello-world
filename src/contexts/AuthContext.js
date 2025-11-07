// Together We Ride - Authentication Context
// Global authentication state management

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthChange, getCurrentUser, getUserProfile } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        // User is signed in
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
        });

        // Fetch user profile from Firestore
        try {
          const { success, profile, error: profileError } = await getUserProfile(authUser.uid);

          if (success) {
            setUserProfile(profile);
            setError(null);
          } else {
            setError(profileError);
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          setError('Failed to load user profile');
          setUserProfile(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { success, profile, error: profileError } = await getUserProfile(user.uid);

      if (success) {
        setUserProfile(profile);
        setError(null);
        return { success: true };
      } else {
        setError(profileError);
        return { success: false, error: profileError };
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to refresh profile');
      return { success: false, error: 'Failed to refresh profile' };
    }
  };

  // Update user profile in context (without re-fetching)
  const updateProfile = (updates) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        ...updates,
      });
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
