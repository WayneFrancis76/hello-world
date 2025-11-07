// Together We Ride - Activity Dashboard
// Shows user's activities and quick log button

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useImpact } from '../../hooks/useImpact';
import ImpactCounter from '../../components/impact/ImpactCounter';
import Button from '../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const ActivityDashboardScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const { userImpact, loading } = useImpact();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back, {userProfile?.displayName || 'Rider'}!</Text>
        <Text style={styles.subtitle}>Every km makes a difference</Text>
      </View>

      {userImpact && (
        <ImpactCounter
          sessions={userImpact.totalYouthSessionsFunded || 0}
          animate={true}
          style={styles.counter}
        />
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.totalKmLogged?.toFixed(1) || '0.0'}</Text>
          <Text style={styles.statLabel}>Total KM</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Button
          title="Start Activity"
          variant="impact"
          size="large"
          fullWidth
          style={styles.actionButton}
        />

        <Button
          title="View History"
          variant="outline"
          fullWidth
        />
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <Text style={styles.placeholderText}>Your recent activities will appear here</Text>
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
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  welcome: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textInverse,
    opacity: 0.9,
  },
  counter: {
    margin: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  actionContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  recentContainer: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xxl,
  },
});

export default ActivityDashboardScreen;
