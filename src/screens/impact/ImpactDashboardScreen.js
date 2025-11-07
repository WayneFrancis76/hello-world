// Together We Ride - Impact Dashboard
// THE HEART OF THE APP - Shows community impact and youth programs

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useImpact } from '../../hooks/useImpact';
import ImpactCounter from '../../components/impact/ImpactCounter';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const ImpactDashboardScreen = () => {
  const { communityImpact, communityLoading } = useImpact();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Active Impact Platform</Text>
        <Text style={styles.heroSubtitle}>
          Every kilometer transforms into opportunity
        </Text>
      </View>

      {communityImpact && (
        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Community Impact</Text>

          <View style={styles.impactCard}>
            <ImpactCounter
              sessions={communityImpact.totalSessions}
              size="large"
              animate={false}
            />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{communityImpact.totalKm.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total KM</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{communityImpact.totalUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>${(communityImpact.totalValue || 0).toFixed(0)}</Text>
              <Text style={styles.statLabel}>Impact Value</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{Math.floor(communityImpact.totalSessions)}</Text>
              <Text style={styles.statLabel}>Youth Reached</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.programsSection}>
        <Text style={styles.sectionTitle}>Youth Programs</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Youth cycling programs funded by your activity will appear here
          </Text>
        </View>
      </View>

      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Inspiring stories from youth participants
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: COLORS.impactGreen,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textInverse,
    opacity: 0.9,
  },
  communitySection: {
    padding: SPACING.md,
  },
  impactCard: {
    marginVertical: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statBox: {
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
    color: COLORS.impactGreen,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  programsSection: {
    padding: SPACING.md,
  },
  storiesSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  placeholderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ImpactDashboardScreen;
