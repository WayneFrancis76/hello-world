// Together We Ride - Main Tab Navigator
// Bottom tab navigation with 4 main sections

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

// Import stack navigators (these would be implemented following the same pattern)
// For now, we'll import placeholder screens
import HomeScreen from '../screens/rides/HomeScreen';
import ActivityDashboardScreen from '../screens/activity/ActivityDashboardScreen';
import ImpactDashboardScreen from '../screens/impact/ImpactDashboardScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Rides') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Impact') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Rides"
        component={HomeScreen}
        options={{ title: 'Together We Ride' }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityDashboardScreen}
        options={{ title: 'My Activity' }}
      />
      <Tab.Screen
        name="Impact"
        component={ImpactDashboardScreen}
        options={{
          title: 'Active Impact',
          tabBarBadge: '🌟', // Always show to highlight the core feature!
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
