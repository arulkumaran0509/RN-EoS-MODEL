import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' (pistachio), 'secondary' (dark green), 'outline', 'danger', 'ghost'
  size = 'medium',     // 'small', 'medium', 'large'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyles = () => {
    const list = [styles.baseButton];

    switch (variant) {
      case 'primary':
        list.push(styles.primaryButton);
        break;
      case 'secondary':
        list.push(styles.secondaryButton);
        break;
      case 'outline':
        list.push(styles.outlineButton);
        break;
      case 'danger':
        list.push(styles.dangerButton);
        break;
      case 'ghost':
        list.push(styles.ghostButton);
        break;
      default:
        list.push(styles.primaryButton);
    }

    switch (size) {
      case 'small':
        list.push(styles.smallButton);
        break;
      case 'large':
        list.push(styles.largeButton);
        break;
      default:
        list.push(styles.mediumButton);
    }

    if (disabled || loading) {
      list.push(styles.disabledButton);
    }

    return list;
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'primary':
        return COLORS.darkGreen;
      case 'secondary':
      case 'danger':
        return COLORS.white;
      case 'outline':
      case 'ghost':
        return COLORS.darkGreen;
      default:
        return COLORS.darkGreen;
    }
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyles(), style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : 20}
              color={textColor}
              style={styles.iconLeft}
            />
          )}
          {title ? (
            <Text style={[styles.text, { color: textColor }, textStyle]}>
              {title}
            </Text>
          ) : null}
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : 20}
              color={textColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.pistachio,
    ...SHADOWS.small,
  },
  secondaryButton: {
    backgroundColor: COLORS.darkGreen,
    ...SHADOWS.small,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.darkGreen,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
    ...SHADOWS.small,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 26,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
