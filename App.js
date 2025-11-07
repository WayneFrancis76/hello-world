// Together We Ride - Main App Entry Point
// Production-ready React Native app with Active Impact Platform

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { AuthProvider } from './src/contexts/AuthContext';
import { RideProvider } from './src/contexts/RideContext';
import { ActivityProvider } from './src/contexts/ActivityContext';
import { ImpactProvider } from './src/contexts/ImpactContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ImpactProvider>
          <RideProvider>
            <ActivityProvider>
              <AppNavigator />
              <StatusBar style="auto" />
            </ActivityProvider>
          </RideProvider>
        </ImpactProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
