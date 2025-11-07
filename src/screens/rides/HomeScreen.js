// Together We Ride - Home Screen
// Main feed of upcoming rides - follows service/hooks patterns established

import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRides } from '../../hooks/useRides';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const HomeScreen = ({ navigation }) => {
  const { rides, loading, error, refresh } = useRides(true, 20);

  const renderRideCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.rideTitle}>{item.title}</Text>
      <Text style={styles.rideDetail}>📍 {item.meetingPoint?.address || 'Location TBD'}</Text>
      <Text style={styles.rideDetail}>📏 {item.distance} • {item.difficulty}</Text>
      <Text style={styles.rideDetail}>👥 {item.currentRiders}/{item.maxRiders} riders</Text>
      <Text style={styles.impactText}>🌟 Impact: {item.youthSessionsGenerated || 0} sessions</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        renderItem={renderRideCard}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No upcoming rides</Text>
            <Text style={styles.emptySubtext}>Check back soon or create your own!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  rideDetail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  impactText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.impactGreen,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginTop: SPACING.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  error: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    textAlign: 'center',
    padding: SPACING.lg,
  },
});

export default HomeScreen;
