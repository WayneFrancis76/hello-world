// Together We Ride - Button Component
// Reusable button with variants

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, SIZING, TYPOGRAPHY, SHADOWS } from '../../config/constants';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'text', 'impact'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          textColor: COLORS.textInverse,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
          textColor: COLORS.textPrimary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
          textColor: COLORS.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: COLORS.primary,
        };
      case 'impact':
        return {
          backgroundColor: COLORS.impactGreen,
          borderColor: COLORS.impactGreen,
          textColor: COLORS.textInverse,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          textColor: COLORS.textInverse,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          fontSize: TYPOGRAPHY.fontSize.sm,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md + 4,
          paddingHorizontal: SPACING.lg,
          fontSize: TYPOGRAPHY.fontSize.lg,
        };
      case 'medium':
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          fontSize: TYPOGRAPHY.fontSize.base,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant !== 'text' && SHADOWS.sm,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.textColor,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZING.borderRadius.lg,
    borderWidth: 1,
    minHeight: SIZING.buttonHeight,
  },
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
});

export default Button;
