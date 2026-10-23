import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';

export const AppLogo = ({
  size = 80,
  showBadge = true,
  badgeText,
  style,
}) => {
  const iconSize = size * 0.52;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: COLORS.softPistachio,
            borderColor: COLORS.border,
          },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              width: size * 0.82,
              height: size * 0.82,
              borderRadius: (size * 0.82) / 2,
              backgroundColor: '#FFFFFF',
            },
          ]}
        >
          {/* Fresh Organic Grocery Leaf Emblem */}
          <Text style={{ fontSize: iconSize }}>🥗</Text>
        </View>

        {showBadge && (
          <View
            style={[
              styles.leafBadge,
              {
                width: size * 0.32,
                height: size * 0.32,
                borderRadius: (size * 0.32) / 2,
                backgroundColor: COLORS.darkGreen,
              },
            ]}
          >
            <Text style={{ fontSize: size * 0.16 }}>🌿</Text>
          </View>
        )}
      </View>

      {badgeText ? (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeLabel}>{badgeText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    ...SHADOWS.medium,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  leafBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...SHADOWS.small,
  },
  badgeContainer: {
    marginTop: 8,
    backgroundColor: COLORS.darkGreen,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FONTS.bold,
    letterSpacing: 1,
  },
});
