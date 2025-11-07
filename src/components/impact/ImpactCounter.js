// Together We Ride - Impact Counter Component
// Animated counter showing youth sessions funded - THE HEART OF THE APP!

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';
import { formatSessions } from '../../utils/impactCalculations';

const ImpactCounter = ({
  sessions,
  showLabel = true,
  size = 'large', // 'small', 'medium', 'large'
  animate = true,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const previousSessions = useRef(0);

  useEffect(() => {
    if (animate && sessions !== previousSessions.current) {
      // Animate from previous value to new value
      Animated.timing(animatedValue, {
        toValue: sessions,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      previousSessions.current = sessions;
    } else {
      animatedValue.setValue(sessions);
    }
  }, [sessions, animate]);

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return TYPOGRAPHY.fontSize.xl;
      case 'medium':
        return TYPOGRAPHY.fontSize.xxxl;
      case 'large':
      default:
        return TYPOGRAPHY.fontSize.massive;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✨</Text>
      </View>

      <View style={styles.countContainer}>
        <Animated.Text
          style={[
            styles.count,
            {
              fontSize: getFontSize(),
              color: COLORS.impactGreen,
            },
          ]}
        >
          {animate
            ? animatedValue.interpolate({
                inputRange: [0, sessions],
                outputRange: ['0', sessions.toFixed(1)],
              })
            : sessions.toFixed(1)}
        </Animated.Text>

        {showLabel && (
          <Text style={styles.label}>Youth Sessions Funded</Text>
        )}
      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚴</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
  },
  iconContainer: {
    marginHorizontal: SPACING.md,
  },
  icon: {
    fontSize: 32,
  },
  countContainer: {
    alignItems: 'center',
  },
  count: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: -1,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default ImpactCounter;
