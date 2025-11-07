# Together We Ride 🚴✨

**Turn Your Activity Into Youth Opportunity**

A revolutionary cross-platform social network that connects cyclists and transforms every kilometer logged into tangible youth cycling opportunities through the **Active Impact Platform**.

[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-50.0-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 What Makes This Special

**Together We Ride** isn't just another fitness app. It's a purpose-built digital ecosystem where:

- **Every km matters**: Whether cycling, walking, wheeling, or running - your activity directly funds youth cycling programs
- **Real impact tracking**: Watch in real-time as your kilometers convert to funded youth cycling sessions
- **Community powered**: Join group rides or track solo activities - all contributing to a shared mission
- **Transparent outcomes**: See exactly which youth programs benefit from your efforts
- **Corporate amplification**: Sponsor matching multipliers (2x, 3x, 5x) exponentially increase your impact

### The Innovation: Active Impact Platform™

```
1 km logged = 0.5 youth sessions funded
10 km ride = 5 sessions = $125 impact value
Corporate 3x match = 15 sessions = $375 impact value!
```

---

## 🎯 Key Features

### 🚴 Group Rides
- Create and discover rides by location, difficulty, and date
- Real-time GPS tracking with live rider locations
- Ride leader reputation system with star ratings
- Automatic impact calculation for all participants
- In-ride photo/video capture and sharing

### 💪 Individual Activity Tracking
- Track cycling, walking, wheeling (wheelchair/scooter), or running
- GPS-based automatic tracking or manual entry
- Live impact counter showing sessions funded in real-time
- Auto-pause detection and route visualization
- Activity streaks and personal records

### 🌟 Active Impact Platform
- **Real-time impact calculation**: See youth sessions funded as you move
- **Transparent allocation**: Track which programs receive your contributions
- **Impact milestones**: Earn badges at 100km, 500km, 1000km, 5000km
- **Community leaderboards**: Compare impact with friends and community
- **Monthly impact reports**: Detailed breakdown of your contribution

### 👥 Youth Program Integration
- Directory of funded youth cycling programs
- Success stories and testimonials from participants
- Transparent session allocation and delivery tracking
- Geographic distribution of program impact
- Direct connection between your km and program outcomes

### 🏢 Corporate Sponsorship
- Tiered sponsorship system (Bronze 1.5x, Silver 2x, Gold 3x, Platinum 5x)
- Employee engagement tracking
- Corporate impact dashboards
- ROI reporting for sponsors
- Challenge and team competition features

### 🎮 Gamification
- Achievement badges for distance and impact milestones
- Activity streaks with rewards
- Impact tier system (Starter → Bronze → Silver → Gold → Platinum → Diamond)
- Social sharing of achievements
- Challenge participation tracking

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React Native with Expo SDK 50
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **State Management**: React Context API + Hooks
- **Real-time**: Firestore real-time listeners
- **Location**: Expo Location API with background tracking
- **Media**: Expo Camera + Image Picker + Media Library
- **Maps**: React Native Maps
- **Storage**: AsyncStorage for local caching

### Project Structure

```
together-we-ride/
├── src/
│   ├── config/
│   │   ├── constants.js              # App-wide constants
│   │   └── impactConfig.js           # Impact calculation config
│   │
│   ├── services/                     # Business logic layer
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── rideService.js
│   │   ├── activityService.js
│   │   ├── impactService.js          # ⭐ Core impact calculations
│   │   ├── sponsorshipService.js
│   │   ├── youthProgramService.js
│   │   ├── mediaService.js
│   │   ├── locationService.js
│   │   └── userService.js
│   │
│   ├── contexts/                     # Global state management
│   │   ├── AuthContext.js
│   │   ├── RideContext.js
│   │   ├── ActivityContext.js
│   │   └── ImpactContext.js          # ⭐ Real-time impact state
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useRides.js
│   │   ├── useActivity.js
│   │   ├── useImpact.js
│   │   ├── useLocation.js
│   │   ├── useMedia.js
│   │   └── useDebounce.js
│   │
│   ├── utils/                        # Helper functions
│   │   ├── dateUtils.js
│   │   ├── validationUtils.js
│   │   ├── locationUtils.js
│   │   ├── imageUtils.js
│   │   ├── impactCalculations.js     # ⭐ Impact math
│   │   ├── activityUtils.js
│   │   └── storageKeys.js
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── common/                   # Buttons, Cards, Inputs
│   │   ├── rides/                    # Ride-specific components
│   │   ├── activity/                 # Activity tracking components
│   │   ├── impact/                   # ⭐ Impact display components
│   │   ├── media/                    # Photo/video components
│   │   ├── location/                 # Map components
│   │   ├── sponsors/                 # Sponsor components
│   │   └── profile/                  # Profile components
│   │
│   ├── screens/                      # Full-screen views
│   │   ├── auth/                     # Login, Signup, Welcome
│   │   ├── rides/                    # Ride management screens
│   │   ├── activity/                 # Activity tracking screens
│   │   ├── impact/                   # ⭐ Impact dashboards
│   │   ├── media/                    # Media gallery
│   │   ├── profile/                  # User profile
│   │   ├── sponsors/                 # Sponsor information
│   │   └── social/                   # Notifications, Search
│   │
│   └── navigation/                   # Navigation configuration
│       ├── AppNavigator.js
│       ├── MainTabNavigator.js
│       ├── AuthStackNavigator.js
│       └── ...
│
├── App.js                            # App entry point
├── package.json                      # Dependencies
└── README.md                         # This file!
```

### Design Patterns

- **Feature-based architecture**: Code organized by feature domain
- **Service layer pattern**: Business logic separated from UI
- **Context + Hooks pattern**: Global state management
- **Container/Presentational**: Logic separated from presentation
- **Real-time subscriptions**: Firestore listeners for live data
- **Offline-first**: Local caching with AsyncStorage

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (cross-platform)
- Firebase account

### Step 1: Clone & Install

```bash
git clone https://github.com/yourorg/together-we-ride.git
cd together-we-ride
npm install
```

### Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project" and follow the wizard
   - Name it "together-we-ride"

2. **Enable Authentication**
   - Navigate to Authentication → Sign-in method
   - Enable "Email/Password"

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"
   - Start in **production mode**
   - Choose a location near your users

4. **Create Storage Bucket**
   - Navigate to Storage
   - Click "Get started"
   - Use production mode rules

5. **Get Configuration**
   - Project Settings → General → Your apps
   - Click web icon (</>) to register a web app
   - Copy the `firebaseConfig` object

6. **Update App Configuration**
   ```javascript
   // src/services/firebase.js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

7. **Deploy Security Rules**
   - Copy the Firestore rules from `src/services/firebase.js` (bottom of file)
   - Paste in Firestore → Rules tab
   - Publish the rules
   - Repeat for Storage rules

### Step 3: Run the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Step 4: Initial Data Setup (Optional)

For testing, you may want to seed initial data:

1. **Create Youth Programs**
   - Add documents to `youthPrograms` collection
   - Include fields: name, location, description, sessionsReceived, etc.

2. **Create Sponsors** (optional)
   - Add documents to `sponsors` collection
   - Include fields: companyName, tier, multiplier, etc.

---

## 📱 Usage Guide

### For Regular Users

1. **Sign Up**: Create an account with email/password
2. **Explore Rides**: Browse upcoming group rides
3. **Join a Ride**: Tap a ride → Join → Track on ride day
4. **Log Solo Activity**: Activity tab → Start Activity → Choose type → Start tracking
5. **View Impact**: Impact tab → See your personal and community impact
6. **Track Progress**: Profile → View stats, streaks, and achievements

### For Ride Leaders

1. **Create Ride**: Home → + → Fill details (title, location, date, difficulty, etc.)
2. **Manage Participants**: View who joined, manage capacity
3. **Start Ride**: On ride day, start tracking to log impact
4. **Complete Ride**: End tracking → View collective impact
5. **Earn Stars**: Receive ratings from participants

### For Corporate Sponsors

1. **Contact Admin**: Reach out via support email
2. **Choose Tier**: Bronze (1.5x), Silver (2x), Gold (3x), Platinum (5x)
3. **Employee Activation**: Employees link accounts to corporate sponsor
4. **Track Impact**: View dashboard showing employee engagement and ROI

---

## 🔧 Configuration

### Impact Conversion Rate

Edit `src/config/impactConfig.js`:

```javascript
export const IMPACT_CONVERSION = {
  BASE_RATE_KM_TO_SESSIONS: 0.5, // 1 km = 0.5 sessions
  ACTIVITY_MULTIPLIERS: {
    cycling: 1.0,
    walking: 1.0,
    wheeling: 1.2, // Bonus for inclusive activities
    running: 1.0,
  },
};
```

### Youth Session Cost

```javascript
export const YOUTH_SESSION = {
  COST_PER_SESSION: 25, // $25 USD
  DURATION_MINUTES: 90,
  // ... other settings
};
```

### Milestones

```javascript
export const IMPACT_MILESTONES = {
  distance: [
    { km: 100, badge: 'century', label: 'Century Club' },
    { km: 500, badge: 'champion', label: 'Impact Champion' },
    // ... add more
  ],
};
```

---

## 🎨 Customization

### Colors

Edit `src/config/constants.js`:

```javascript
export const COLORS = {
  primary: '#6200ee',      // Main brand color
  secondary: '#03dac6',    // Accent color
  impactGreen: '#00C853',  // Impact color
  // ... customize all colors
};
```

### Features

Toggle features in constants:

```javascript
// Enable/disable features
export const FEATURES = {
  CORPORATE_SPONSORS: true,
  MEDIA_UPLOAD: true,
  LIVE_TRACKING: true,
  // ... add feature flags
};
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

---

## 📊 Firebase Data Model

### Collections

```
users/
  {userId}/
    - Profile data
    - Stats
    - Impact metrics

rides/
  {rideId}/
    - Ride details
    - Participants array
    - Impact stats

activities/
  {activityId}/
    - Activity data
    - GPS route
    - Impact calculated

impact/
  {userId}/
    - Aggregated impact
    - Milestones
    - Rankings

youthPrograms/
  {programId}/
    - Program details
    - Sessions received
    - Testimonials

sponsors/
  {sponsorId}/
    - Company details
    - Multiplier tier
    - Impact contribution

liveLocations/ (TTL 24h)
  {activityId}_{userId}/
    - Real-time GPS
    - Auto-expires
```

---

## 🚀 Deployment

### Production Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

### Environment Variables

Create `.env` file (not committed to git):

```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Cloud Functions (Recommended)

Deploy Cloud Functions for:
- Impact calculation verification
- Automated leaderboard updates
- Monthly report generation
- Notification triggers
- Data aggregation

---

## 🤝 Contributing

Contributions welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Youth Cycling Programs**: For partnering to receive funded sessions
- **Corporate Sponsors**: For matching and amplifying impact
- **Community**: For every kilometer logged in service of youth opportunity
- **React Native Community**: For amazing tools and libraries

---

## 📞 Support

- **Email**: support@togetherweride.app
- **Website**: https://togetherweride.app
- **Issues**: GitHub Issues tab
- **Docs**: See `docs/` folder for additional documentation

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core ride creation and discovery
- ✅ Individual activity tracking
- ✅ Active Impact Platform
- ✅ Real-time GPS tracking
- ✅ Impact dashboards

### Phase 2 (Next)
- [ ] Push notifications
- [ ] Social features (follow, comments, reactions)
- [ ] Advanced challenges and competitions
- [ ] Stripe integration for corporate sponsors
- [ ] Admin dashboard

### Phase 3 (Future)
- [ ] AI-powered route recommendations
- [ ] Wearable device integration (Apple Watch, Garmin)
- [ ] Voice coaching during activities
- [ ] AR features for gamification
- [ ] International expansion

---

## 💡 Key Implementation Notes

### Impact Calculation
Impact is calculated in `src/config/impactConfig.js` using:
```javascript
const sessions = distanceKm * baseRate * activityMultiplier * sponsorMultiplier;
```

This calculation happens:
- **Client-side**: For real-time display during tracking
- **Server-side**: For verification and official recording (Cloud Functions)

### Real-time Tracking
Location updates every 5 seconds using Expo Location:
```javascript
Location.watchPositionAsync({
  accuracy: Location.Accuracy.High,
  timeInterval: 5000,
  distanceInterval: 10,
}, callback);
```

### Fraud Prevention
Activities flagged for review if:
- Speed exceeds realistic maximums for activity type
- Duration too short for distance
- Missing GPS data for distances > 20km
- Suspicious patterns detected

---

**Built with ❤️ for youth opportunity and community impact.**

**Together We Ride - Every kilometer matters. Every rider makes a difference.**

🚴✨🌟
