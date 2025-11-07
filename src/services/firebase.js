// Together We Ride - Firebase Configuration & Initialization
// Firebase v9+ Modular SDK

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ══════════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION
// ══════════════════════════════════════════════════════════════

// TODO: Replace with your actual Firebase project credentials
// Get these from: Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional, for Analytics
};

// ══════════════════════════════════════════════════════════════
// FIREBASE SETUP INSTRUCTIONS
// ══════════════════════════════════════════════════════════════

/*
SETUP STEPS:

1. CREATE FIREBASE PROJECT
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "together-we-ride" (or your preferred name)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. ENABLE AUTHENTICATION
   - In Firebase Console, go to: Build → Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method
   - Click "Save"

3. CREATE FIRESTORE DATABASE
   - In Firebase Console, go to: Build → Firestore Database
   - Click "Create database"
   - Choose "Start in production mode" (we'll add security rules later)
   - Select a location close to your users
   - Click "Enable"

4. CREATE STORAGE BUCKET
   - In Firebase Console, go to: Build → Storage
   - Click "Get started"
   - Start in production mode
   - Click "Done"

5. GET YOUR CONFIG
   - In Firebase Console, go to: Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>) to create a web app
   - Register app with nickname "together-we-ride-app"
   - Copy the firebaseConfig object
   - Paste it above, replacing the placeholder values

6. FIRESTORE SECURITY RULES
   - In Firestore, go to "Rules" tab
   - Copy and paste the rules from the bottom of this file
   - Publish the rules

7. STORAGE SECURITY RULES
   - In Storage, go to "Rules" tab
   - Copy and paste the storage rules from the bottom of this file
   - Publish the rules

8. CREATE FIRESTORE INDEXES (if needed)
   - You may need composite indexes for complex queries
   - Firebase will tell you in the console if an index is needed
   - Click the provided link to auto-create the index
*/

// ══════════════════════════════════════════════════════════════
// INITIALIZE FIREBASE
// ══════════════════════════════════════════════════════════════

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence for Firestore (great for offline-first experience)
// Note: This is enabled by default in web SDK v9+

// ══════════════════════════════════════════════════════════════
// COLLECTION REFERENCES (for convenience)
// ══════════════════════════════════════════════════════════════

export const COLLECTIONS = {
  USERS: 'users',
  RIDES: 'rides',
  ACTIVITIES: 'activities',
  IMPACT: 'impact',
  YOUTH_PROGRAMS: 'youthPrograms',
  SPONSORS: 'sponsors',
  MEDIA: 'media',
  NOTIFICATIONS: 'notifications',
  ACHIEVEMENTS: 'achievements',
  LIVE_LOCATIONS: 'liveLocations',
  RIDE_PARTICIPANTS: 'rideParticipants', // Subcollection under rides
};

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export { app, auth, db, storage };
export default app;

// ══════════════════════════════════════════════════════════════
// FIRESTORE SECURITY RULES (copy to Firebase Console)
// ══════════════════════════════════════════════════════════════

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (public data)
      allow read: if true;

      // Users can only create/update their own profile
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);

      // Users cannot delete profiles (admin only via Firebase Console)
      allow delete: if false;
    }

    // Rides collection
    match /rides/{rideId} {
      // Anyone can read rides (public)
      allow read: if true;

      // Authenticated users can create rides
      allow create: if isSignedIn();

      // Only ride leader can update/delete their ride
      allow update: if isSignedIn() &&
                      (resource.data.leaderId == request.auth.uid ||
                       request.resource.data.leaderId == request.auth.uid);
      allow delete: if isSignedIn() && resource.data.leaderId == request.auth.uid;

      // Ride participants subcollection
      match /participants/{participantId} {
        allow read: if true;
        allow write: if isSignedIn();
      }
    }

    // Activities collection
    match /activities/{activityId} {
      // Users can read their own activities
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;

      // Users can create their own activities
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;

      // Users can update/delete their own activities
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }

    // Impact collection (user impact stats)
    match /impact/{userId} {
      // Users can read their own impact, anyone can read for leaderboards
      allow read: if true;

      // Only server (Cloud Functions) can write impact data
      // This prevents users from falsifying their impact
      allow write: if false;
    }

    // Youth Programs (read-only for users, managed by admins)
    match /youthPrograms/{programId} {
      allow read: if true;
      allow write: if false; // Admin only
    }

    // Sponsors (read-only for users, managed by admins)
    match /sponsors/{sponsorId} {
      allow read: if true;
      allow write: if false; // Admin only
    }

    // Media collection
    match /media/{mediaId} {
      // Anyone can read media (public)
      allow read: if true;

      // Users can create media
      allow create: if isSignedIn();

      // Users can update/delete their own media
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }

    // Live locations (during active rides/activities)
    match /liveLocations/{locationId} {
      // Anyone can read live locations (for real-time tracking)
      allow read: if true;

      // Users can only update their own location
      allow create, update: if isSignedIn() &&
                              request.resource.data.userId == request.auth.uid;

      // Auto-delete after 24 hours (use TTL)
      allow delete: if true;
    }

    // Notifications
    match /notifications/{notificationId} {
      // Users can only read their own notifications
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;

      // Users can mark notifications as read
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;

      // Server creates notifications
      allow create, delete: if false;
    }

    // Achievements
    match /achievements/{achievementId} {
      // Users can read their own achievements
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;

      // Server creates achievements
      allow write: if false;
    }
  }
}
*/

// ══════════════════════════════════════════════════════════════
// FIREBASE STORAGE RULES (copy to Firebase Console)
// ══════════════════════════════════════════════════════════════

/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    function isVideo() {
      return request.resource.contentType.matches('video/.*');
    }

    function isValidSize() {
      // Max 2MB for images, 50MB for videos
      return (isImage() && request.resource.size < 2 * 1024 * 1024) ||
             (isVideo() && request.resource.size < 50 * 1024 * 1024);
    }

    // User avatars
    match /avatars/{userId}/{fileName} {
      allow read: if true; // Public
      allow write: if isSignedIn() &&
                     request.auth.uid == userId &&
                     isImage() &&
                     request.resource.size < 2 * 1024 * 1024;
    }

    // Ride media
    match /rides/{rideId}/{fileName} {
      allow read: if true; // Public
      allow write: if isSignedIn() && isValidSize();
    }

    // Activity media
    match /activities/{activityId}/{fileName} {
      allow read: if true; // Public
      allow write: if isSignedIn() && isValidSize();
    }

    // Youth program media (admin only for writes)
    match /youthPrograms/{programId}/{fileName} {
      allow read: if true; // Public
      allow write: if false; // Admin only via Firebase Console
    }

    // Sponsor logos (admin only for writes)
    match /sponsors/{sponsorId}/{fileName} {
      allow read: if true; // Public
      allow write: if false; // Admin only
    }
  }
}
*/
