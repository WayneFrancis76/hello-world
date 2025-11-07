// Together We Ride - Welcome/Onboarding Screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚴✨🌟</Text>
      <Text style={styles.title}>Together We Ride</Text>
      <Text style={styles.tagline}>Turn Your Activity Into Youth Opportunity</Text>

      <View style={styles.featureContainer}>
        <Text style={styles.feature}>📍 Join group rides or track solo activities</Text>
        <Text style={styles.feature}>🚴 Every km you log funds youth cycling</Text>
        <Text style={styles.feature}>💚 See your real-time impact on communities</Text>
        <Text style={styles.feature}>🏆 Earn milestones and achievements</Text>
      </View>

      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Login')}
        variant="impact"
        size="large"
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.huge,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.impactGreen,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  featureContainer: {
    marginBottom: SPACING.xxl,
  },
  feature: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.md,
  },
});

export default WelcomeScreen;
