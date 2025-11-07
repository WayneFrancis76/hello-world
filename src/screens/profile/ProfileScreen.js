// Together We Ride - Profile Screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { signOutUser } from '../../services/authService';
import Button from '../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const ProfileScreen = () => {
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOutUser();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>{userProfile?.displayName || 'User'}</Text>
        <Text style={styles.email}>{userProfile?.email}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.totalKmLogged?.toFixed(0) || 0}</Text>
          <Text style={styles.statLabel}>Total KM</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.youthSessionsFunded?.toFixed(0) || 0}</Text>
          <Text style={styles.statLabel}>Sessions Funded</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.totalStars || 0}</Text>
          <Text style={styles.statLabel}>Stars Earned</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Button
          title="Edit Profile"
          variant="outline"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="My Achievements"
          variant="outline"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="Settings"
          variant="outline"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="Sign Out"
          variant="outline"
          fullWidth
          onPress={handleSignOut}
          style={[styles.menuButton, { borderColor: COLORS.error }]}
          textStyle={{ color: COLORS.error }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.huge,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  menuSection: {
    padding: SPACING.md,
  },
  menuButton: {
    marginBottom: SPACING.md,
  },
});

export default ProfileScreen;
